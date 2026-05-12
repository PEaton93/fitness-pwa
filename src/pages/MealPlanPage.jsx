import { useState, useEffect } from "react";
import { MEALS, WATER_GOAL_ML, WATER_INCREMENT_ML } from "../data/mealPlan.js";
import { getMealLog, saveMealLog } from "../utils/storage.js";

function buildInitialLog() {
  return {
    meals: MEALS.map((m) => ({ id: m.id, logged: false, loggedAt: null })),
    waterMl: 0
  };
}

function MacroRow({ label, value, unit }) {
  return (
    <span style={{ fontSize: 12, color: "var(--text-muted)", marginRight: 10 }}>
      <strong style={{ color: "var(--text)" }}>{value}{unit}</strong> {label}
    </span>
  );
}

function MealCard({ meal, logEntry, onToggle }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="card"
      style={logEntry.logged ? { borderColor: "var(--success)" } : {}}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div className="meal-time">{meal.time}</div>
          <div className="card-title">{meal.name}</div>
          <div style={{ marginTop: 4 }}>
            <MacroRow label="kcal" value={meal.calories} unit="" />
            <MacroRow label="P" value={meal.protein} unit="g" />
            <MacroRow label="C" value={meal.carbs} unit="g" />
            <MacroRow label="F" value={meal.fat} unit="g" />
          </div>
        </div>
        <button
          className={`btn btn-sm${logEntry.logged ? "" : " btn-secondary"}`}
          style={logEntry.logged ? { background: "var(--success)", color: "#fff" } : {}}
          onClick={onToggle}
        >
          {logEntry.logged ? "Logged" : "Log meal"}
        </button>
      </div>

      <button className="collapse-toggle" onClick={() => setExpanded(!expanded)}>
        {expanded ? "Hide ingredients" : "Show ingredients"}
        <span style={{ marginLeft: 2 }}>{expanded ? "▲" : "▼"}</span>
      </button>

      {expanded && (
        <div style={{ marginTop: 10 }}>
          <div className="meal-ingredients">
            {meal.ingredients.map((ing, i) => (
              <div key={i}>· {ing}</div>
            ))}
          </div>
          {meal.notes && (
            <div style={{ fontSize: 12, color: "var(--text-faint)", fontStyle: "italic" }}>
              {meal.notes}
            </div>
          )}
        </div>
      )}

      {logEntry.logged && logEntry.loggedAt && (
        <div className="meal-logged">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Logged at {logEntry.loggedAt}
        </div>
      )}
    </div>
  );
}

function WaterTracker({ waterMl, onChange }) {
  const glasses = Math.round(WATER_GOAL_ML / WATER_INCREMENT_ML);
  const filledGlasses = Math.floor(waterMl / WATER_INCREMENT_ML);

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div className="card-title">Water</div>
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
          {(waterMl / 1000).toFixed(2)}L / {(WATER_GOAL_ML / 1000)}L
        </span>
      </div>
      <div className="water-glasses">
        {Array.from({ length: glasses }, (_, i) => (
          <button
            key={i}
            className={`water-glass${i < filledGlasses ? " filled" : ""}`}
            onClick={() => onChange(i < filledGlasses ? i * WATER_INCREMENT_ML : (i + 1) * WATER_INCREMENT_ML)}
            title={`${(i + 1) * WATER_INCREMENT_ML}ml`}
          />
        ))}
      </div>
      <div className="progress-bar-wrap" style={{ marginTop: 10 }}>
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill water"
            style={{ width: `${Math.min((waterMl / WATER_GOAL_ML) * 100, 100)}%` }}
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onChange(Math.max(0, waterMl - WATER_INCREMENT_ML))}
        >
          −250ml
        </button>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => onChange(Math.min(WATER_GOAL_ML * 2, waterMl + WATER_INCREMENT_ML))}
        >
          +250ml
        </button>
      </div>
    </div>
  );
}

export default function MealPlanPage() {
  const [log, setLog] = useState(() => getMealLog() ?? buildInitialLog());

  useEffect(() => {
    saveMealLog(log);
  }, [log]);

  function toggleMeal(id) {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setLog((prev) => ({
      ...prev,
      meals: prev.meals.map((m) =>
        m.id === id ? { ...m, logged: !m.logged, loggedAt: !m.logged ? time : null } : m
      )
    }));
  }

  function setWater(ml) {
    setLog((prev) => ({ ...prev, waterMl: ml }));
  }

  const loggedCount = log.meals.filter((m) => m.logged).length;
  const totalCalories = MEALS.filter((m) => log.meals.find((l) => l.id === m.id)?.logged)
    .reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = MEALS.filter((m) => log.meals.find((l) => l.id === m.id)?.logged)
    .reduce((acc, m) => acc + m.protein, 0);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Meals</div>
        <div className="page-subtitle">
          {loggedCount}/{MEALS.length} meals logged · {totalCalories} kcal · {totalProtein}g protein
        </div>
      </div>

      <WaterTracker waterMl={log.waterMl} onChange={setWater} />

      <div className="section-heading">Meal plan</div>

      {MEALS.map((meal) => {
        const entry = log.meals.find((m) => m.id === meal.id) ?? { id: meal.id, logged: false, loggedAt: null };
        return (
          <MealCard
            key={meal.id}
            meal={meal}
            logEntry={entry}
            onToggle={() => toggleMeal(meal.id)}
          />
        );
      })}
    </div>
  );
}
