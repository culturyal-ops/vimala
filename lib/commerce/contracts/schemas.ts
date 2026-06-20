import { z } from "zod";

export const addressSchema = z.object({
  fullName: z.string().min(2).max(120),
  phone: z.string().min(10).max(15),
  addressLine1: z.string().min(5).max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(2).max(80),
  state: z.string().min(2).max(80),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  country: z.string().length(2).default("IN"),
});

export const cartLineSchema = z
  .object({
    productId: z.string().uuid().optional(),
    slug: z.string().min(1).max(200).optional(),
    quantity: z.number().int().min(1).max(99),
    size: z.string().max(20).optional(),
  })
  .refine((line) => Boolean(line.productId ?? line.slug), {
    message: "productId or slug is required",
  });

export const syncCartSchema = z.object({
  sessionToken: z.string().min(8).max(64),
  lines: z.array(cartLineSchema).min(1).max(50),
});

export const shippingRatesSchema = z.object({
  pincode: z.string().regex(/^\d{6}$/),
  weightGrams: z.number().int().min(0).max(50000).optional(),
});

export const createCheckoutSchema = z.object({
  sessionToken: z.string().min(8).max(64),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  shippingMethod: z.string().min(1),
  shippingCost: z.number().min(0),
  paymentMethod: z.enum(["razorpay", "cod", "whatsapp"]),
  couponCode: z.string().max(40).optional(),
  idempotencyKey: z.string().uuid(),
});

export const validateCouponSchema = z.object({
  code: z.string().min(2).max(40),
  subtotal: z.number().min(0),
  customerId: z.string().uuid().optional(),
});

export const razorpayVerifySchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  orderId: z.string().uuid(),
});

export const createReturnSchema = z.object({
  orderId: z.string().uuid(),
  reason: z.string().min(5).max(500),
  items: z.array(
    z.object({
      orderItemId: z.string().uuid(),
      quantity: z.number().int().min(1),
    })
  ).min(1),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "pending",
    "paid",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ]).optional(),
  fulfillmentStatus: z.enum([
    "unfulfilled",
    "partial",
    "fulfilled",
    "returned",
  ]).optional(),
  notes: z.string().max(1000).optional(),
});

export const couponFormSchema = z.object({
  code: z.string().min(2).max(40).transform((v) => v.toUpperCase()),
  title: z.string().min(2).max(120),
  discountType: z.enum(["fixed", "percent"]),
  discountValue: z.number().positive(),
  minOrderAmount: z.number().min(0).default(0),
  maxUses: z.number().int().positive().optional(),
  perCustomerLimit: z.number().int().min(1).default(1),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
  isActive: z.boolean().default(true),
});

export const analyticsEventSchema = z.object({
  eventName: z.enum([
    "page_view",
    "product_view",
    "add_to_cart",
    "checkout_started",
    "checkout_completed",
    "payment_failed",
    "cart_abandoned",
  ]),
  sessionId: z.string().optional(),
  productId: z.string().uuid().optional(),
  properties: z.record(z.string(), z.unknown()).optional(),
});

export type AddressInput = z.infer<typeof addressSchema>;
export type SyncCartInput = z.infer<typeof syncCartSchema>;
export type CreateCheckoutInput = z.infer<typeof createCheckoutSchema>;
export type CouponFormInput = z.infer<typeof couponFormSchema>;
