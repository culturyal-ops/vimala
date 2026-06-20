import { COMMERCE_API, COMMERCE_HEADERS } from "@/lib/commerce/contracts/api";
import type {
  CouponValidation,
  OrderDetail,
  ShippingRate,
} from "@/lib/commerce/contracts/types";
import type {
  AddressInput,
  CreateCheckoutInput,
  SyncCartInput,
} from "@/lib/commerce/contracts/schemas";
import { getOrCreateSessionToken } from "@/lib/cart-session";

type ApiErrorBody = {
  error: { code: string; message: string; details?: Record<string, unknown> };
};

export class CommerceApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: Record<string, unknown>;

  constructor(status: number, body: ApiErrorBody["error"]) {
    super(body.message);
    this.name = "CommerceApiError";
    this.code = body.code;
    this.status = status;
    this.details = body.details;
  }
}

async function commerceFetch<T>(
  path: string,
  options: RequestInit & { idempotencyKey?: string } = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  const session = getOrCreateSessionToken();
  if (session) headers.set(COMMERCE_HEADERS.session, session);
  if (options.idempotencyKey) {
    headers.set(COMMERCE_HEADERS.idempotency, options.idempotencyKey);
  }

  const { idempotencyKey: _idk, ...fetchOpts } = options;
  const res = await fetch(path, { ...fetchOpts, headers });
  const data: unknown = await res.json();

  if (!res.ok) {
    const err = data as ApiErrorBody;
    throw new CommerceApiError(
      res.status,
      err.error ?? { code: "INTERNAL_ERROR", message: "Request failed" }
    );
  }

  return data as T;
}

export async function syncCart(lines: SyncCartInput["lines"]) {
  const sessionToken = getOrCreateSessionToken();
  return commerceFetch<{ cartId: string }>(COMMERCE_API.cartSync, {
    method: "POST",
    body: JSON.stringify({ sessionToken, lines }),
  });
}

export async function fetchShippingRates(
  pincode: string,
  weightGrams?: number
): Promise<{ rates: ShippingRate[] }> {
  const params = new URLSearchParams({ pincode });
  if (weightGrams !== undefined) params.set("weightGrams", String(weightGrams));
  return commerceFetch<{ rates: ShippingRate[] }>(
    `${COMMERCE_API.shippingRates}?${params}`
  );
}

export async function validateCoupon(
  code: string,
  subtotal: number,
  customerId?: string
): Promise<CouponValidation> {
  return commerceFetch<CouponValidation>(COMMERCE_API.couponValidate, {
    method: "POST",
    body: JSON.stringify({ code, subtotal, customerId }),
  });
}

export type CheckoutResponse = {
  orderId: string;
  orderNumber: string;
  total: number;
  checkoutSessionId?: string;
  payment: {
    razorpayOrderId?: string;
    razorpayKeyId?: string;
    amount?: number;
    currency?: string;
    cod?: boolean;
  };
};

export async function createCheckout(
  input: Omit<CreateCheckoutInput, "sessionToken" | "idempotencyKey"> & {
    idempotencyKey: string;
  }
): Promise<CheckoutResponse> {
  const sessionToken = getOrCreateSessionToken();
  return commerceFetch<CheckoutResponse>(COMMERCE_API.checkoutCreate, {
    method: "POST",
    idempotencyKey: input.idempotencyKey,
    body: JSON.stringify({ ...input, sessionToken }),
  });
}

export async function verifyRazorpayPayment(input: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId: string;
}) {
  return commerceFetch<{ success: boolean; orderId: string }>(
    COMMERCE_API.paymentVerify,
    {
      method: "POST",
      body: JSON.stringify(input),
    }
  );
}

export async function fetchOrder(orderId: string): Promise<OrderDetail> {
  return commerceFetch<OrderDetail>(COMMERCE_API.order(orderId));
}

export async function trackAnalyticsEvent(input: {
  eventName: string;
  sessionId?: string;
  productId?: string;
  properties?: Record<string, unknown>;
}) {
  return commerceFetch<{ ok: boolean }>(COMMERCE_API.analytics, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function snapshotAbandonedCart(input: {
  email?: string;
  phone?: string;
}) {
  const sessionToken = getOrCreateSessionToken();
  return commerceFetch<{ ok: boolean }>(COMMERCE_API.abandonedCart, {
    method: "POST",
    body: JSON.stringify({ sessionToken, ...input }),
  });
}

export async function createReturnRequest(input: {
  orderId: string;
  reason: string;
  items: Array<{ orderItemId: string; quantity: number }>;
}) {
  return commerceFetch<{ id: string; return_number: string }>(
    COMMERCE_API.returnCreate,
    { method: "POST", body: JSON.stringify(input) }
  );
}

export type AddressForm = AddressInput;
