/** Shared API route paths — storefront and VRM must stay in sync */
export const COMMERCE_API = {
  cartSync: "/api/commerce/cart/sync",
  shippingRates: "/api/commerce/shipping/rates",
  checkoutCreate: "/api/commerce/checkout",
  checkoutSession: (id: string) => `/api/commerce/checkout/${id}`,
  couponValidate: "/api/commerce/coupons/validate",
  paymentRazorpay: "/api/commerce/payments/razorpay",
  paymentVerify: "/api/commerce/payments/verify",
  webhookRazorpay: "/api/commerce/webhooks/razorpay",
  webhookShiprocket: "/api/commerce/webhooks/shiprocket",
  order: (id: string) => `/api/commerce/orders/${id}`,
  orders: "/api/commerce/orders",
  returnCreate: "/api/commerce/returns",
  analytics: "/api/commerce/analytics",
  abandonedCart: "/api/commerce/abandoned-cart",
} as const;

export const COMMERCE_HEADERS = {
  idempotency: "x-idempotency-key",
  session: "x-cart-session",
} as const;
