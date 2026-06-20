import type { SupabaseClient } from "@supabase/supabase-js";

type NotificationInput = {
  channel: "email" | "sms" | "whatsapp";
  recipient: string;
  template: string;
  payload: Record<string, unknown>;
};

export async function queueNotification(
  supabase: SupabaseClient,
  input: NotificationInput
): Promise<void> {
  await supabase.from("notifications").insert({
    channel: input.channel,
    recipient: input.recipient,
    template: input.template,
    payload: input.payload,
    status: "pending",
  });
}

export async function processPendingNotifications(
  supabase: SupabaseClient,
  limit = 50
): Promise<number> {
  const { data: pending } = await supabase
    .from("notifications")
    .select("id, channel, recipient, template, payload")
    .eq("status", "pending")
    .limit(limit);

  if (!pending?.length) return 0;

  for (const note of pending) {
    // Integrate Resend/Twilio/WhatsApp Business API in production
    await supabase
      .from("notifications")
      .update({ status: "sent", sent_at: new Date().toISOString() })
      .eq("id", note.id);
  }

  return pending.length;
}
