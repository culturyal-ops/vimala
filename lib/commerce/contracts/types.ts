export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus =
  | "pending"
  | "authorized"
  | "paid"
  | "failed"
  | "refunded"
  | "partially_refunded";

export type FulfillmentStatus =
  | "unfulfilled"
  | "partial"
  | "fulfilled"
  | "returned";

export type PaymentMethod = "razorpay" | "cod" | "whatsapp";

export type ShipmentStatus =
  | "pending"
  | "label_created"
  | "picked_up"
  | "in_transit"
  | "delivered"
  | "rto"
  | "cancelled";

export type ReturnStatus =
  | "requested"
  | "approved"
  | "rejected"
  | "received"
  | "refunded"
  | "exchanged";

export type Address = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};

export type CartLineInput = {
  productId: string;
  quantity: number;
  size?: string;
};

export type ShippingRate = {
  id: string;
  name: string;
  cost: number;
  estimatedDays: string;
  provider: string;
};

export type CheckoutTotals = {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
};

export type OrderSummary = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  total: number;
  currency: string;
  createdAt: string;
};

export type OrderDetail = OrderSummary & {
  email: string | null;
  phone: string | null;
  subtotal: number;
  shippingTotal: number;
  taxTotal: number;
  discountTotal: number;
  shippingAddress: Address | null;
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    size: string | null;
  }>;
  shipments: Array<{
    id: string;
    awb: string | null;
    courierName: string | null;
    trackingUrl: string | null;
    status: ShipmentStatus;
  }>;
};

export type CouponValidation = {
  valid: boolean;
  couponId?: string;
  discountAmount: number;
  message?: string;
};

export type AnalyticsEventName =
  | "page_view"
  | "product_view"
  | "add_to_cart"
  | "checkout_started"
  | "checkout_completed"
  | "payment_failed"
  | "cart_abandoned";
