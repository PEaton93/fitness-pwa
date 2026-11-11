import { supabase } from "./supabase.js";

export async function logEvent(eventType, payload = {}) {
  if (!supabase) return;
  try {
    await supabase.from("workout_logs").insert({
      event_type: eventType,
      day_index: payload.dayIndex ?? null,
      event_date: new Date().toISOString().split("T")[0],
      payload: payload,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("logEvent failed:", err);
  }
}
