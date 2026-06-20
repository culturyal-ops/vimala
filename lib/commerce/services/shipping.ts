import type { SupabaseClient } from "@supabase/supabase-js";
import type { ShippingRate } from "@/lib/commerce/contracts/types";

const KERALA_PINCODES = new Set(["682001", "685508", "685602", "686001"]);

export function calculateShippingRates(
  pincode: string,
  weightGrams = 500
): ShippingRate[] {
  const isKerala = pincode.startsWith("68") || KERALA_PINCODES.has(pincode);
  const weightKg = Math.ceil(weightGrams / 1000);

  const baseStandard = isKerala ? 49 : 99;
  const baseExpress = isKerala ? 99 : 199;

  return [
    {
      id: "standard",
      name: isKerala ? "Kerala Standard" : "All-India Standard",
      cost: baseStandard + (weightKg - 1) * 20,
      estimatedDays: isKerala ? "2-4 days" : "5-8 days",
      provider: "shiprocket",
    },
    {
      id: "express",
      name: isKerala ? "Kerala Express" : "All-India Express",
      cost: baseExpress + (weightKg - 1) * 35,
      estimatedDays: isKerala ? "1-2 days" : "3-5 days",
      provider: "shiprocket",
    },
    {
      id: "store_pickup",
      name: "Store Pickup — Kattappana",
      cost: 0,
      estimatedDays: "Same day",
      provider: "manual",
    },
  ];
}

export async function createShipment(
  supabase: SupabaseClient,
  orderId: string,
  shippingMethod: string,
  weightGrams: number
): Promise<{ shipmentId: string; awb: string | null }> {
  const awb =
    shippingMethod === "store_pickup"
      ? null
      : `SR${Date.now().toString().slice(-10)}`;

  const { data, error } = await supabase
    .from("shipments")
    .insert({
      order_id: orderId,
      provider: shippingMethod === "store_pickup" ? "manual" : "shiprocket",
      awb,
      courier_name:
        shippingMethod === "store_pickup" ? "In-store pickup" : "Shiprocket",
      status: shippingMethod === "store_pickup" ? "delivered" : "label_created",
      weight_grams: weightGrams,
      tracking_url: awb
        ? `https://shiprocket.co/tracking/${awb}`
        : null,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(`Failed to create shipment: ${error?.message}`);
  }

  if (shippingMethod !== "store_pickup") {
    await supabase.from("shipment_events").insert({
      shipment_id: data.id,
      status: "label_created",
      description: "Shipping label generated",
    });
  }

  return { shipmentId: data.id as string, awb };
}

export async function updateShipmentFromWebhook(
  supabase: SupabaseClient,
  awb: string,
  status: string,
  description?: string
): Promise<void> {
  const { data: shipment } = await supabase
    .from("shipments")
    .select("id, order_id, status")
    .eq("awb", awb)
    .single();

  if (!shipment) return;

  await supabase
    .from("shipments")
    .update({
      status,
      ...(status === "delivered" ? { delivered_at: new Date().toISOString() } : {}),
      ...(status === "in_transit" ? { shipped_at: new Date().toISOString() } : {}),
    })
    .eq("id", shipment.id);

  await supabase.from("shipment_events").insert({
    shipment_id: shipment.id,
    status,
    description: description ?? `Status updated to ${status}`,
  });

  if (status === "delivered" && shipment.order_id) {
    await supabase
      .from("orders")
      .update({
        status: "delivered",
        fulfillment_status: "fulfilled",
        delivered_at: new Date().toISOString(),
      })
      .eq("id", shipment.order_id);
  }
}
