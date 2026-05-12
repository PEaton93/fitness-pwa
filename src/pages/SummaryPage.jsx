import { useState, useEffect } from "react";
import { MEALS, WATER_GOAL_ML } from "../data/mealPlan.js";
import { WORKOUT_DAYS, DAILY_TARGETS } from "../data/workoutPlan.js";
import { getWorkoutLog, getMealLog, saveMealLog } from "../utils/storage.js";

function ProgressBar({ label, value, max, colorClass, unit = "" }) {
  const pct = Math.min((value / max) * 100, 100);
  const over = value > max;
  return (
    <div className="progress-bar-wrap">
      <div className="progress-bar-label">
        <span>{label}</span>
        <span style={{ color: over ? "var(--warning)" : "var(--text-muted)" }}>
          {value}{unit} / {max}{unit}
        </span>
      </div>
      <div className="progress-bar-track">
        <div
          className={`progress-bar-fill ${colorClass}`}
          style={{ width: `${pct}%`, background: over ? "var(--warning)" : undefined }}
        />
      </div>
    </div>
  );
}

function getScore(workoutLog, mealLog, dayData) {
  let scores = [];

  if (dayData && workoutLog) {
    const totalSets = dayData.exercises.reduce((a, ex) => a + ex.sets, 0);
    const doneSets = workoutLog.exercises.reduce((a, ex) => a + ex.sets.filter((s) => s.done).length, 0);
    scores.push(totalSets > 0 ? doneSets / totalSets : 1);
  } else if (!dayData) {
    scores.push(1);
  }

  if (mealLog) {
    const loggedMeals = mealLog.meals.filter((m) => m.logged).length;
    scores.push(loggedMeals / MEALS.length);
    scores.push(Math.min(mealLog.waterMl / WATER_GOAL_ML, 1));

    const totalProtein = MEALS.filter((m) => mealLog.meals.find((l) => l.id === m.id)?.logged)
      .reduce((a, m) => a + m.protein, 0);
    scores.push(Math.min(totalProtein / DAILY_TARGETS.protein, 1));
  }

  if (scores.length === 0) return 0;
  return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100);
}

function getScoreMessage(score) {
  if (score >= 90) return "Excellent day. You're exactly on track for your goals.";
  if (score >= 70) return "Solid effort. Minor gaps but you're making consistent progress.";
  if (score >= 50) return "Okay day. Tomorrow is a fresh start.";
  return "Tough one. Don't let it derail you — consistency beats perfection every time.";
}

export default function SummaryPage({ settings }) {
  const dayOfWeek = new Date().getDay();
  const dayData = WORKOUT_DAYS[dayOfWeek];

  const [workoutLog] = useState(() => getWorkoutLog());
  const [mealLog, setMealLog] = useState(() => getMealLog());
  const [energy, setEnergy] = useState(() => getMealLog()?.energy ?? null);
  const [notes, setNotes] = useState(() => getMealLog()?.notes ?? "");

  const score = getScore(workoutLog, mealLog, dayData);

  const loggedMeals = mealLog?.meals.filter((m) => m.logged) ?? [];
  const totalCalories = MEALS.filter((m) => loggedMeals.find((l) => l.id === m.id))
    .reduce((a, m) => a + m.calories, 0);
  const totalProtein = MEALS.filter((m) => loggedMeals.find((l) => l.id === m.id))
    .reduce((a, m) => a + m.protein, 0);
  const totalCarbs = MEALS.filter((m) => loggedMeals.find((l) => l.id === m.id))
    .reduce((a, m) => a + m.carbs, 0);
  const totalFat = MEALS.filter((m) => loggedMeals.find((l) => l.id === m.id))
    .reduce((a, m) => a + m.fat, 0);

  const workoutSets = dayData
    ? workoutLog?.exercises.reduce((a, ex) => a + ex.sets.filter((s) => s.done).length, 0) ?? 0
    : null;
  const totalSets = dayData?.exercises.reduce((a, ex) => a + ex.sets, 0) ?? 0;

  const totalVolume = workoutLog?.exercises.reduce((vol, ex) => {
    return vol + ex.sets.filter((s) => s.done && s.weight && s.reps)
      .reduce((s, set) => s + (parseFloat(set.weight) || 0) * (parseFloat(set.reps) || 0), 0);
  }, 0) ?? 0;

  function saveEnergyNotes(e, n) {
    if (!mealLog) return;
    const updated = { ...mealLog, energy: e, notes: n };
    setMealLog(updated);
    saveMealLog(updated);
  }

  const scoreColor =
    score >= 90 ? "var(--success)" :
    score >= 70 ? "var(--accent)" :
    score >= 50 ? "var(--warning)" :
    "var(--danger)";

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Today's Summary</div>
        <div className="page-subtitle">{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</div>
      </div>

      <div className="card" style={{ textAlign: "center" }}>
        <div className="score-circle" style={{ borderColor: scoreColor }}>
          <div className="score-number" style={{ color: scoreColor }}>{score}</div>
          <div className="score-label">/ 100</div>
        </div>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>How you did today</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{getScoreMessage(score)}</div>
      </div>

      {dayData && (
        <>
          <div className="section-heading">Workout — {dayData.name}</div>
          <div className="card">
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
              <div className="macro-cell" style={{ flex: 1 }}>
                <div className="macro-cell-val">{workoutSets}/{totalSets}</div>
                <div className="macro-cell-label">Sets done</div>
              </div>
              <div className="macro-cell" style={{ flex: 1 }}>
                <div className="macro-cell-val">{Math.round(totalVolume).toLocaleString()}</div>
                <div className="macro-cell-label">Total vol (kg)</div>
              </div>
            </div>
            <ProgressBar
              label="Sets completed"
              value={workoutSets}
              max={totalSets}
              colorClass="success"
            />
          </div>
        </>
      )}

      <div className="section-heading">Nutrition</div>
      <div className="card">
        <div className="macro-grid">
          <div className="macro-cell">
            <div className="macro-cell-val">{totalCalories}</div>
            <div className="macro-cell-label">kcal</div>
          </div>
          <div className="macro-cell">
            <div className="macro-cell-val">{totalProtein}g</div>
            <div className="macro-cell-label">Protein</div>
          </div>
          <div className="macro-cell">
            <div className="macro-cell-val">{totalCarbs}g</div>
            <div className="macro-cell-label">Carbs</div>
          </div>
          <div className="macro-cell">
            <div className="macro-cell-val">{totalFat}g</div>
            <div className="macro-cell-label">Fat</div>
          </div>
        </div>
        <ProgressBar label="Calories" value={totalCalories} max={DAILY_TARGETS.calories} colorClass="calories" unit=" kcal" />
        <ProgressBar label="Protein" value={totalProtein} max={DAILY_TARGETS.protein} colorClass="protein" unit="g" />
        <ProgressBar label="Carbs" value={totalCarbs} max={DAILY_TARGETS.carbs} colorClass="carbs" unit="g" />
        <ProgressBar label="Fat" value={totalFat} max={DAILY_TARGETS.fat} colorClass="fat" unit="g" />
      </div>

      <div className="section-heading">Hydration</div>
      <div className="card">
        <ProgressBar
          label="Water"
          value={Math.round((mealLog?.waterMl ?? 0) / 100) / 10}
          max={WATER_GOAL_ML / 1000}
          colorClass="water"
          unit="L"
        />
      </div>

      <div className="section-heading">How did you feel?</div>
      <div className="card">
        <div className="form-group">
          <label className="form-label">Energy level today (1–10)</label>
          <div className="rating-row">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={`rating-btn${energy === n ? " selected" : ""}`}
                onClick={() => {
                  setEnergy(n);
                  saveEnergyNotes(n, notes);
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Notes (optional)</label>
          <textarea
            className="form-input"
            placeholder="Sleep quality, how the session felt, anything to remember..."
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              saveEnergyNotes(energy, e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
}
