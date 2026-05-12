import { useState, useEffect } from "react";
import Nav from "./components/Nav.jsx";
import WorkoutPage from "./pages/WorkoutPage.jsx";
import MealPlanPage from "./pages/MealPlanPage.jsx";
import SummaryPage from "./pages/SummaryPage.jsx";
import ProgressPage from "./pages/ProgressPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import { getSettings, saveSettings } from "./utils/storage.js";
import { requestPermission, scheduleMealNotifications } from "./utils/notifications.js";

export default function App() {
  const [page, setPage] = useState("workout");
  const [settings, setSettings] = useState(() => getSettings());

  useEffect(() => {
    const hash = window.location.hash.replace("#", "") || "workout";
    if (["workout", "meals", "summary", "progress", "settings"].includes(hash)) {
      setPage(hash);
    }
  }, []);

  useEffect(() => {
    window.location.hash = page;
  }, [page]);

  useEffect(() => {
    if (settings.notificationsEnabled) {
      scheduleMealNotifications();
    }
  }, [settings.notificationsEnabled]);

  function updateSettings(updates) {
    const next = { ...settings, ...updates };
    setSettings(next);
    saveSettings(next);
  }

  async function handleEnableNotifications() {
    const granted = await requestPermission();
    updateSettings({ notificationsEnabled: granted });
    if (granted) scheduleMealNotifications();
  }

  return (
    <div className="app">
      {!settings.planStartDate && page !== "settings" && (
        <div className="setup-banner">
          <span>Set your plan start date to track your week</span>
          <button onClick={() => setPage("settings")}>Set up</button>
        </div>
      )}
      {!settings.notificationsEnabled && page !== "settings" && (
        <div className="setup-banner">
          <span>Enable meal reminders?</span>
          <button onClick={handleEnableNotifications}>Allow</button>
        </div>
      )}

      <main className="main-content">
        {page === "workout" && <WorkoutPage settings={settings} />}
        {page === "meals" && <MealPlanPage settings={settings} />}
        {page === "summary" && <SummaryPage settings={settings} />}
        {page === "progress" && <ProgressPage settings={settings} />}
        {page === "settings" && (
          <SettingsPage settings={settings} onUpdate={updateSettings} />
        )}
      </main>

      <Nav current={page} onChange={setPage} />
    </div>
  );
}
