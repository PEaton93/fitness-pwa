const PREFIX = "fittrack_";

export function getToday() {
  return new Date().toISOString().split("T")[0];
}

export function getSettings() {
  try {
    return JSON.parse(localStorage.getItem(`${PREFIX}settings`) || "{}");
  } catch {
    return {};
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(`${PREFIX}settings`, JSON.stringify(settings));
  } catch {
    console.warn("Storage quota exceeded — settings not saved");
  }
}

export function getWorkoutLog(date = getToday()) {
  try {
    return JSON.parse(localStorage.getItem(`${PREFIX}workout_${date}`) || "null");
  } catch {
    return null;
  }
}

export function saveWorkoutLog(log, date = getToday()) {
  try {
    localStorage.setItem(`${PREFIX}workout_${date}`, JSON.stringify(log));
  } catch {
    console.warn("Storage quota exceeded — workout log not saved");
  }
}

export function getMealLog(date = getToday()) {
  try {
    return JSON.parse(localStorage.getItem(`${PREFIX}meals_${date}`) || "null");
  } catch {
    return null;
  }
}

export function saveMealLog(log, date = getToday()) {
  try {
    localStorage.setItem(`${PREFIX}meals_${date}`, JSON.stringify(log));
  } catch {
    console.warn("Storage quota exceeded — meal log not saved");
  }
}

export function getWeeklyProgress() {
  try {
    return JSON.parse(localStorage.getItem(`${PREFIX}weekly`) || "[]");
  } catch {
    return [];
  }
}

export function saveWeeklyProgress(data) {
  try {
    localStorage.setItem(`${PREFIX}weekly`, JSON.stringify(data));
  } catch {
    console.warn("Storage quota exceeded — weekly progress not saved");
  }
}

export function getCurrentWeek(planStartDate) {
  if (!planStartDate) return null;
  const start = new Date(planStartDate);
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  const week = Math.floor(diffDays / 7) + 1;
  if (week < 1 || week > 8) return null;
  return week;
}
