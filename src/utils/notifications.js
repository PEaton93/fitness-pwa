import { MEALS } from "../data/mealPlan.js";

let scheduledTimers = [];

export async function requestPermission() {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function scheduleMealNotifications() {
  clearScheduledNotifications();
  if (Notification.permission !== "granted") return;

  const now = new Date();

  MEALS.forEach((meal) => {
    const [h, m] = meal.time.split(":").map(Number);
    const notifyTime = new Date();
    notifyTime.setHours(h, m - meal.notifyMinutesBefore, 0, 0);

    const msUntil = notifyTime - now;
    if (msUntil <= 0) return;

    const timer = setTimeout(() => {
      const label = meal.notifyMinutesBefore > 0
        ? `${meal.name} in ${meal.notifyMinutesBefore} minutes`
        : `Time for ${meal.name}`;

      new Notification("FitTrack - Meal Time", {
        body: `${label} · ${meal.calories} kcal · ${meal.protein}g protein`,
        icon: "/fitness-pwa/icons/icon.svg",
        badge: "/fitness-pwa/icons/icon.svg",
        tag: meal.id,
        renotify: false,
      });
    }, msUntil);

    scheduledTimers.push(timer);
  });
}

export function clearScheduledNotifications() {
  scheduledTimers.forEach(clearTimeout);
  scheduledTimers = [];
}
