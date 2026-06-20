export type CommerceErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "OUT_OF_STOCK"
  | "COUPON_INVALID"
  | "COUPON_EXPIRED"
  | "PAYMENT_FAILED"
  | "IDEMPOTENCY_CONFLICT"
  | "UNAUTHORIZED"
  | "INTERNAL_ERROR";

export class CommerceError extends Error {
  readonly code: CommerceErrorCode;
  readonly status: number;
  readonly details?: Record<string, unknown>;

  constructor(
    code: CommerceErrorCode,
    message: string,
    status = 400,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "CommerceError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function toApiError(error: unknown): {
  status: number;
  body: { error: { code: string; message: string; details?: Record<string, unknown> } };
} {
  if (error instanceof CommerceError) {
    return {
      status: error.status,
      body: {
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      },
    };
  }
  console.error("[commerce]", error);
  return {
    status: 500,
    body: {
      error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
    },
  };
}
