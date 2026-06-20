import type { SupabaseClient } from "@supabase/supabase-js";
import type { CouponValidation } from "@/lib/commerce/contracts/types";
import { CommerceError } from "@/lib/commerce/contracts/errors";

type CouponRow = {
  id: string;
  code: string;
  discount_type: "fixed" | "percent";
  discount_value: number;
  min_order_amount: number;
  max_uses: number | null;
  used_count: number;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
};

export async function validateCoupon(
  supabase: SupabaseClient,
  code: string,
  subtotal: number
): Promise<CouponValidation> {
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase())
    .single();

  if (error || !data) {
    return { valid: false, discountAmount: 0, message: "Invalid coupon code" };
  }

  const coupon = data as CouponRow;
  const now = new Date();

  if (!coupon.is_active) {
    return { valid: false, discountAmount: 0, message: "Coupon is inactive" };
  }
  if (coupon.starts_at && new Date(coupon.starts_at) > now) {
    return { valid: false, discountAmount: 0, message: "Coupon not yet active" };
  }
  if (coupon.ends_at && new Date(coupon.ends_at) < now) {
    return { valid: false, discountAmount: 0, message: "Coupon has expired" };
  }
  if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
    return { valid: false, discountAmount: 0, message: "Coupon usage limit reached" };
  }
  if (subtotal < coupon.min_order_amount) {
    return {
      valid: false,
      discountAmount: 0,
      message: `Minimum order ₹${coupon.min_order_amount} required`,
    };
  }

  let discountAmount =
    coupon.discount_type === "fixed"
      ? coupon.discount_value
      : Math.round((subtotal * coupon.discount_value) / 100);

  discountAmount = Math.min(discountAmount, subtotal);

  return {
    valid: true,
    couponId: coupon.id,
    discountAmount,
  };
}

export async function redeemCoupon(
  supabase: SupabaseClient,
  couponId: string,
  orderId: string,
  customerId: string | null,
  discountAmount: number
): Promise<void> {
  const { data: coupon } = await supabase
    .from("coupons")
    .select("used_count")
    .eq("id", couponId)
    .single();

  if (!coupon) {
    throw new CommerceError("COUPON_INVALID", "Coupon not found", 400);
  }

  await supabase.from("coupon_redemptions").insert({
    coupon_id: couponId,
    order_id: orderId,
    customer_id: customerId,
    discount_amount: discountAmount,
  });

  await supabase
    .from("coupons")
    .update({ used_count: (coupon.used_count as number) + 1 })
    .eq("id", couponId);
}

export function calculateGst(subtotal: number, gstRate = 5): number {
  return Math.round((subtotal * gstRate) / 100);
}
