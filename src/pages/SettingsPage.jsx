import { requestPermission, scheduleMealNotifications } from "../utils/notifications.js";

export default function SettingsPage({ settings, onUpdate }) {
  async function handleNotifications() {
    if (settings.notificationsEnabled) {
      onUpdate({ notificationsEnabled: false });
      return;
    }
    const granted = await requestPermission();
    onUpdate({ notificationsEnabled: granted });
    if (granted) scheduleMealNotifications();
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Settings</div>
      </div>

      <div className="card">
        <div className="card-title">Plan Start Date</div>
        <div className="card-meta">
          Used to calculate which week you're on (Week 1–8)
        </div>
        <input
          className="form-input"
          type="date"
          value={settings.planStartDate ?? ""}
          onChange={(e) => onUpdate({ planStartDate: e.target.value })}
        />
      </div>

      <div className="card">
        <div className="card-title">Meal notifications</div>
        <div className="card-meta" style={{ marginBottom: 12 }}>
          Sends a reminder before each meal. Requires the app to be open or installed as a PWA.
          Notifications: Pre-workout 04:45, Post-workout 06:30, Lunch 12:00, Snack 15:00, Dinner 18:30.
        </div>
        <button
          className={`btn btn-full${settings.notificationsEnabled ? " btn-secondary" : " btn-primary"}`}
          onClick={handleNotifications}
        >
          {settings.notificationsEnabled ? "Disable notifications" : "Enable meal notifications"}
        </button>
        {settings.notificationsEnabled && (
          <div style={{ fontSize: 13, color: "var(--success)", marginTop: 8, textAlign: "center" }}>
            Notifications enabled — scheduled for today's meals
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title">Daily targets</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 2 }}>
          <div>Calories: <strong style={{ color: "var(--text)" }}>2,577 kcal</strong></div>
          <div>Protein: <strong style={{ color: "var(--text)" }}>196g</strong></div>
          <div>Carbs: <strong style={{ color: "var(--text)" }}>287g</strong></div>
          <div>Fat: <strong style={{ color: "var(--text)" }}>72g</strong></div>
          <div>Water: <strong style={{ color: "var(--text)" }}>3L</strong></div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">About</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
          8-Week Strength Return + Visible Recomp Plan<br />
          33yo male · 5'11" · 14 stone · 5am Mon–Fri<br /><br />
          All data is stored locally on this device. Nothing leaves your browser.
        </div>
      </div>
    </div>
  );
}
