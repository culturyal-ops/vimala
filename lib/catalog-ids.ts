/** Deterministic UUIDs shared between static catalog and Supabase seed (1–99). */
export function catalogUuid(index: number): string {
  if (index < 1 || index > 99) {
    throw new Error(`catalogUuid index out of range: ${index}`);
  }
  return `a0000000-0000-4000-8000-${String(index).padStart(12, "0")}`;
}
