import { useState } from "react";
import { getWeeklyProgress, saveWeeklyProgress } from "../utils/storage.js";

const WEEKS = Array.from({ length: 8 }, (_, i) => i + 1);

const MAIN_LIFTS = [
  { id: "bench", label: "Bench" },
  { id: "squat", label: "Squat" },
  { id: "deadlift", label: "Deadlift" },
  { id: "ohp", label: "OHP" },
];

function buildInitialData() {
  return WEEKS.map((w) => ({
    week: w,
    bodyweight: "",
    waist: "",
    energy: "",
    notes: "",
    lifts: Object.fromEntries(MAIN_LIFTS.map((l) => [l.id, ""]))
  }));
}

export default function ProgressPage() {
  const [data, setData] = useState(() => {
    const stored = getWeeklyProgress();
    if (stored?.length === 8) return stored;
    return buildInitialData();
  });
  const [activeWeek, setActiveWeek] = useState(1);

  function updateField(week, field, value) {
    const next = data.map((row) =>
      row.week === week ? { ...row, [field]: value } : row
    );
    setData(next);
    saveWeeklyProgress(next);
  }

  function updateLift(week, liftId, value) {
    const next = data.map((row) =>
      row.week === week
        ? { ...row, lifts: { ...row.lifts, [liftId]: value } }
        : row
    );
    setData(next);
    saveWeeklyProgress(next);
  }

  const row = data.find((d) => d.week === activeWeek);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">8-Week Progress</div>
        <div className="page-subtitle">Track bodyweight, measurements, and best lifts</div>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        {WEEKS.map((w) => {
          const weekData = data.find((d) => d.week === w);
          const hasData = weekData?.bodyweight || weekData?.waist;
          return (
            <button
              key={w}
              className={`btn btn-sm${activeWeek === w ? " btn-primary" : " btn-secondary"}`}
              style={hasData && activeWeek !== w ? { borderColor: "var(--success)", color: "var(--success)" } : {}}
              onClick={() => setActiveWeek(w)}
            >
              W{w}
            </button>
          );
        })}
      </div>

      {row && (
        <div>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 12 }}>Week {activeWeek} — Body</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Bodyweight (kg)</label>
                <input
                  className="form-input"
                  type="number"
                  inputMode="decimal"
                  placeholder="e.g. 88.5"
                  value={row.bodyweight}
                  onChange={(e) => updateField(activeWeek, "bodyweight", e.target.value)}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Waist (cm)</label>
                <input
                  className="form-input"
                  type="number"
                  inputMode="decimal"
                  placeholder="e.g. 90"
                  value={row.waist}
                  onChange={(e) => updateField(activeWeek, "waist", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: 12 }}>Week {activeWeek} — Best Lifts (kg)</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {MAIN_LIFTS.map((lift) => (
                <div key={lift.id} className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">{lift.label}</label>
                  <input
                    className="form-input"
                    type="number"
                    inputMode="decimal"
                    placeholder="kg"
                    value={row.lifts[lift.id] ?? ""}
                    onChange={(e) => updateLift(activeWeek, lift.id, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="form-group">
              <label className="form-label">Energy / recovery this week (1-10)</label>
              <input
                className="form-input"
                type="number"
                min="1"
                max="10"
                inputMode="numeric"
                placeholder="1-10"
                value={row.energy}
                onChange={(e) => updateField(activeWeek, "energy", e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Notes</label>
              <textarea
                className="form-input"
                placeholder="Any wins, struggles, adjustments made..."
                value={row.notes}
                onChange={(e) => updateField(activeWeek, "notes", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="section-heading">Overview</div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="progress-table" style={{ padding: "0 8px" }}>
            <thead>
              <tr>
                <th>Wk</th>
                <th>Weight</th>
                <th>Waist</th>
                <th>Bench</th>
                <th>Squat</th>
                <th>Deadlift</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.week} style={row.week === activeWeek ? { background: "rgba(249,115,22,0.06)" } : {}}>
                  <td style={{ color: "var(--accent)", fontWeight: 600 }}>W{row.week}</td>
                  <td>{row.bodyweight ? `${row.bodyweight}kg` : "—"}</td>
                  <td>{row.waist ? `${row.waist}cm` : "—"}</td>
                  <td>{row.lifts?.bench || "—"}</td>
                  <td>{row.lifts?.squat || "—"}</td>
                  <td>{row.lifts?.deadlift || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
