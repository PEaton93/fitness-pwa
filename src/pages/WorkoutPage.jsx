import { useState, useEffect } from "react";
import { getWorkoutDayData, PROGRESSION_RULES } from "../data/workoutPlan.js";
import { getWorkoutLog, saveWorkoutLog, getCurrentWeek } from "../utils/storage.js";

function buildInitialLog(dayData) {
  return {
    exercises: dayData.exercises.map((ex) => ({
      id: ex.id,
      sets: Array.from({ length: ex.sets }, () => ({
        weight: "",
        reps: "",
        done: false
      }))
    }))
  };
}

function categoryTag(cat) {
  return <span className={`tag tag-${cat}`}>{cat}</span>;
}

function SetRow({ set, index, type, onChange, onToggle }) {
  const isTime = type === "time";
  const isCarry = type === "carry";

  return (
    <div className="set-row">
      <span className="set-label">Set {index + 1}</span>
      {!isTime && !isCarry && (
        <>
          <input
            className={`set-input${set.done ? " complete" : ""}`}
            type="number"
            inputMode="decimal"
            placeholder="kg"
            value={set.weight}
            onChange={(e) => onChange({ ...set, weight: e.target.value })}
          />
          <input
            className={`set-input${set.done ? " complete" : ""}`}
            type="number"
            inputMode="numeric"
            placeholder="reps"
            value={set.reps}
            onChange={(e) => onChange({ ...set, reps: e.target.value })}
          />
        </>
      )}
      {isTime && (
        <input
          className={`set-input${set.done ? " complete" : ""}`}
          type="text"
          placeholder="e.g. 55s"
          value={set.reps}
          onChange={(e) => onChange({ ...set, reps: e.target.value })}
          style={{ flex: 2 }}
        />
      )}
      {isCarry && (
        <input
          className={`set-input${set.done ? " complete" : ""}`}
          type="text"
          placeholder="load / distance"
          value={set.weight}
          onChange={(e) => onChange({ ...set, weight: e.target.value })}
          style={{ flex: 2 }}
        />
      )}
      <button
        className={`set-done-btn${set.done ? " done" : ""}`}
        onClick={onToggle}
        aria-label="Mark set done"
      >
        {set.done && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>
    </div>
  );
}

function ExerciseCard({ exercise, loggedEx, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const allDone = loggedEx.sets.every((s) => s.done);
  const doneSets = loggedEx.sets.filter((s) => s.done).length;

  function updateSet(i, set) {
    const sets = [...loggedEx.sets];
    sets[i] = set;
    onUpdate({ ...loggedEx, sets });
  }

  function toggleSet(i) {
    const sets = [...loggedEx.sets];
    sets[i] = { ...sets[i], done: !sets[i].done };
    onUpdate({ ...loggedEx, sets });
  }

  return (
    <div className={`card${allDone ? " card-done" : ""}`} style={allDone ? { borderColor: "var(--success)" } : {}}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div className="card-title">{exercise.name}</div>
          <div className="card-meta">
            {exercise.sets} sets × {exercise.reps} &nbsp;
            {categoryTag(exercise.category)}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: allDone ? "var(--success)" : "var(--text-muted)" }}>
            {doneSets}/{exercise.sets}
          </span>
          <button
            className="collapse-toggle"
            onClick={() => setExpanded(!expanded)}
            style={{ fontSize: 20, lineHeight: 1 }}
          >
            {expanded ? "−" : "+"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="sets-container">
          {loggedEx.sets.map((set, i) => (
            <SetRow
              key={i}
              index={i}
              set={set}
              type={exercise.type}
              onChange={(s) => updateSet(i, s)}
              onToggle={() => toggleSet(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function WorkoutPage({ settings }) {
  const currentWeek = getCurrentWeek(settings.planStartDate);
  const dayData = getWorkoutDayData(settings.planStartDate);

  const [log, setLog] = useState(() => {
    const stored = getWorkoutLog();
    if (stored) return stored;
    if (dayData) return buildInitialLog(dayData);
    return null;
  });

  useEffect(() => {
    if (log) saveWorkoutLog(log);
  }, [log]);

  if (!dayData) {
    return (
      <div className="rest-day">
        <div style={{ fontSize: 48, marginBottom: 12 }}>&#128564;</div>
        <h2>Rest Day</h2>
        <p>No training today. Recover, eat well, and come back strong.</p>
        {currentWeek && (
          <p style={{ marginTop: 16, color: "var(--text-muted)" }}>
            Week {currentWeek} of 8
          </p>
        )}
      </div>
    );
  }

  const completedSets = log?.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.done).length, 0
  ) ?? 0;
  const totalSets = dayData.exercises.reduce((acc, ex) => acc + ex.sets, 0);
  const workoutComplete = completedSets === totalSets;

  function updateExercise(exId, updated) {
    setLog((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) => ex.id === exId ? updated : ex)
    }));
  }

  return (
    <div>
      <div className="page-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div className="page-title">{dayData.dayLabel}</div>
            <div className="page-subtitle">{dayData.name}</div>
          </div>
          {currentWeek && <span className="chip">Week {currentWeek}</span>}
        </div>
      </div>

      {currentWeek && (
        <div className="card" style={{ borderColor: "rgba(249,115,22,0.3)", background: "rgba(249,115,22,0.08)" }}>
          <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, marginBottom: 4 }}>
            Week {currentWeek} Progression Rule
          </div>
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {PROGRESSION_RULES[currentWeek]}
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "8px 0 4px" }}>
        <span className="section-heading" style={{ margin: 0 }}>Exercises</span>
        <span style={{ fontSize: 13, color: workoutComplete ? "var(--success)" : "var(--text-muted)" }}>
          {completedSets}/{totalSets} sets
        </span>
      </div>

      <div className="progress-bar-wrap" style={{ marginBottom: 16 }}>
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill success"
            style={{ width: `${totalSets > 0 ? (completedSets / totalSets) * 100 : 0}%` }}
          />
        </div>
      </div>

      {dayData.exercises.map((exercise) => {
        const loggedEx = log?.exercises.find((e) => e.id === exercise.id) ?? {
          id: exercise.id,
          sets: Array.from({ length: exercise.sets }, () => ({ weight: "", reps: "", done: false }))
        };
        return (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            loggedEx={loggedEx}
            onUpdate={(updated) => updateExercise(exercise.id, updated)}
          />
        );
      })}

      {workoutComplete && (
        <div className="card" style={{ borderColor: "var(--success)", textAlign: "center", padding: "20px" }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>&#10003;</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: "var(--success)" }}>Workout complete!</div>
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
            {totalSets} sets done. Check your summary at the end of the day.
          </div>
        </div>
      )}
    </div>
  );
}
