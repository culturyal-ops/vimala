import type { SupabaseClient } from "@supabase/supabase-js";
import { CommerceError } from "@/lib/commerce/contracts/errors";

type ProductStock = {
  id: string;
  inventory_quantity: number;
  reserved_quantity: number;
  stock_status: string;
};

export async function getAvailableStock(
  supabase: SupabaseClient,
  productId: string
): Promise<number> {
  const { data, error } = await supabase
    .from("products")
    .select("id, inventory_quantity, reserved_quantity, stock_status")
    .eq("id", productId)
    .single();

  if (error || !data) {
    throw new CommerceError("NOT_FOUND", "Product not found", 404);
  }
  const row = data as ProductStock;
  return Math.max(0, row.inventory_quantity - row.reserved_quantity);
}

export async function reserveInventory(
  supabase: SupabaseClient,
  orderId: string,
  items: Array<{ productId: string; quantity: number }>
): Promise<void> {
  for (const item of items) {
    const available = await getAvailableStock(supabase, item.productId);
    if (available < item.quantity) {
      throw new CommerceError("OUT_OF_STOCK", `Insufficient stock for product`, 409, {
        productId: item.productId,
        available,
        requested: item.quantity,
      });
    }

    const { data: product } = await supabase
      .from("products")
      .select("reserved_quantity")
      .eq("id", item.productId)
      .single();

    const currentReserved = (product?.reserved_quantity as number) ?? 0;

    await supabase
      .from("products")
      .update({ reserved_quantity: currentReserved + item.quantity })
      .eq("id", item.productId);

    await supabase.from("inventory_reservations").insert({
      product_id: item.productId,
      order_id: orderId,
      quantity: item.quantity,
      status: "held",
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    });
  }
}

export async function commitReservations(
  supabase: SupabaseClient,
  orderId: string
): Promise<void> {
  const { data: reservations } = await supabase
    .from("inventory_reservations")
    .select("id, product_id, quantity")
    .eq("order_id", orderId)
    .eq("status", "held");

  if (!reservations?.length) return;

  for (const res of reservations) {
    const { data: product } = await supabase
      .from("products")
      .select("inventory_quantity, reserved_quantity")
      .eq("id", res.product_id)
      .single();

    if (product) {
      const inv = product.inventory_quantity as number;
      const reserved = product.reserved_quantity as number;
      const newInv = Math.max(0, inv - res.quantity);
      const newReserved = Math.max(0, reserved - res.quantity);
      const stockStatus =
        newInv === 0 ? "out_of_stock" : newInv <= 5 ? "low_stock" : "in_stock";

      await supabase
        .from("products")
        .update({
          inventory_quantity: newInv,
          reserved_quantity: newReserved,
          stock_status: stockStatus,
        })
        .eq("id", res.product_id);
    }

    await supabase
      .from("inventory_reservations")
      .update({ status: "committed" })
      .eq("id", res.id);
  }
}

export async function releaseReservations(
  supabase: SupabaseClient,
  orderId: string
): Promise<void> {
  const { data: reservations } = await supabase
    .from("inventory_reservations")
    .select("id, product_id, quantity, status")
    .eq("order_id", orderId)
    .in("status", ["held", "committed"]);

  if (!reservations?.length) return;

  for (const res of reservations) {
    if (res.status === "held") {
      const { data: product } = await supabase
        .from("products")
        .select("reserved_quantity")
        .eq("id", res.product_id)
        .single();

      if (product) {
        const reserved = product.reserved_quantity as number;
        await supabase
          .from("products")
          .update({ reserved_quantity: Math.max(0, reserved - res.quantity) })
          .eq("id", res.product_id);
      }
    }

    if (res.status === "committed") {
      const { data: product } = await supabase
        .from("products")
        .select("inventory_quantity")
        .eq("id", res.product_id)
        .single();

      if (product) {
        const inv = product.inventory_quantity as number;
        await supabase
          .from("products")
          .update({
            inventory_quantity: inv + res.quantity,
            stock_status: inv + res.quantity <= 5 ? "low_stock" : "in_stock",
          })
          .eq("id", res.product_id);
      }
    }

    await supabase
      .from("inventory_reservations")
      .update({ status: "released" })
      .eq("id", res.id);
  }
}
