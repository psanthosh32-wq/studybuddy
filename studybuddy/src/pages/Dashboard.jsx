import { useState, useEffect } from "react";
import { fetchNotes } from "../api";

function Dashboard({ setPage, user, token, onSelectSubject }) {
  const [notesCount, setNotesCount] = useState(3);
  const [recentNotes, setRecentNotes] = useState([]);
  const [studyHours, setStudyHours] = useState(4.5);
  const studyGoal = 6.0;

  // Focus Timer state
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [timerMode, setTimerMode] = useState("focus"); // 'focus' | 'break'

  useEffect(() => {
    let interval = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
      alert(timerMode === "focus" ? "🎉 Great study session! Take a 5-minute break." : "⏰ Break finished! Ready to resume studying?");
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds, timerMode]);

  useEffect(() => {
    async function loadStats() {
      try {
        const notes = await fetchNotes(token);
        if (Array.isArray(notes)) {
          setNotesCount(notes.length);
          setRecentNotes(notes.slice(0, 3));
        }
      } catch {
        const cached = localStorage.getItem("studybuddy_notes_cache");
        if (cached) {
          const parsed = JSON.parse(cached);
          setNotesCount(parsed.length);
          setRecentNotes(parsed.slice(0, 3));
        }
      }
    }
    loadStats();
  }, [token]);

  const toggleTimer = () => {
    setTimerActive(!timerActive);
  };

  const resetTimer = (mode = timerMode) => {
    setTimerActive(false);
    setTimerMode(mode);
    setTimerSeconds(mode === "focus" ? 25 * 60 : 5 * 60);
  };

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = Math.min(100, Math.round((studyHours / studyGoal) * 100));

  return (
    <div className="page-container dashboard-page-layout">
      {/* Hero Welcome Banner */}
      <section className="dashboard-hero-card">
        <div className="hero-content">
          <div className="hero-greeting-pill">🌟 Academic Hub</div>
          <h1 className="hero-title">Welcome back, {user?.name || "Student"}! 👋</h1>
          <p className="hero-subtitle">
            You're on track today. Review your subjects, record essential lecture takeaways, and keep up your daily streak!
          </p>
          <div className="hero-actions-row">
            <button
              type="button"
              className="btn-hero-primary"
              onClick={() => setPage("notes")}
            >
              <span>✍️ Write a Note</span>
            </button>
            <button
              type="button"
              className="btn-hero-secondary"
              onClick={() => setPage("subjects")}
            >
              <span>📚 Explore Subjects</span>
            </button>
          </div>
        </div>
        <div className="hero-illustration">
          <div className="hero-circle-accent">
            <span className="hero-emoji">🎯</span>
          </div>
        </div>
      </section>

      {/* KPI Stats Grid */}
      <section className="stats-kpi-grid">
        <div
          className="kpi-card hover-interactive"
          onClick={() => setPage("subjects")}
          role="button"
          tabIndex={0}
        >
          <div className="kpi-icon-box bg-blue">📚</div>
          <div className="kpi-data">
            <span className="kpi-number">6</span>
            <span className="kpi-label">Active Subjects</span>
          </div>
        </div>

        <div
          className="kpi-card hover-interactive"
          onClick={() => setPage("notes")}
          role="button"
          tabIndex={0}
        >
          <div className="kpi-icon-box bg-purple">📝</div>
          <div className="kpi-data">
            <span className="kpi-number">{notesCount}</span>
            <span className="kpi-label">Saved Notes</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box bg-amber">🔥</div>
          <div className="kpi-data">
            <span className="kpi-number">5 Days</span>
            <span className="kpi-label">Study Streak</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box bg-emerald">⏱️</div>
          <div className="kpi-data">
            <div className="kpi-goal-row">
              <span className="kpi-number">{studyHours}</span>
              <span className="kpi-number-sub">/ {studyGoal} hrs</span>
            </div>
            <span className="kpi-label">Daily Goal ({progressPercent}%)</span>
          </div>
        </div>
      </section>

      {/* Dual Section: Focus Timer + Study Goal Progress */}
      <section className="dashboard-widgets-grid">
        {/* Interactive Focus Timer */}
        <div className="widget-card timer-widget">
          <div className="widget-header">
            <div>
              <h2 className="widget-title">⏱️ Pomodoro Focus Timer</h2>
              <p className="widget-subtitle">Stay immersed in deep work sessions</p>
            </div>
            <div className="timer-mode-toggle">
              <button
                type="button"
                className={`timer-pill-btn ${timerMode === "focus" ? "active" : ""}`}
                onClick={() => resetTimer("focus")}
              >
                Focus (25m)
              </button>
              <button
                type="button"
                className={`timer-pill-btn ${timerMode === "break" ? "active" : ""}`}
                onClick={() => resetTimer("break")}
              >
                Break (5m)
              </button>
            </div>
          </div>

          <div className="timer-display-box">
            <div className="timer-clock-digits">{formatTimer(timerSeconds)}</div>
            <p className="timer-status-hint">
              {timerActive
                ? timerMode === "focus"
                  ? "🧠 Focused study in progress..."
                  : "☕ Enjoying a short break..."
                : "Press Start to begin your session"}
            </p>
          </div>

          <div className="timer-controls-row">
            <button
              type="button"
              className={`btn-timer-toggle ${timerActive ? "active" : ""}`}
              onClick={toggleTimer}
            >
              {timerActive ? "⏸️ Pause" : "▶️ Start Session"}
            </button>
            <button
              type="button"
              className="btn-timer-reset"
              onClick={() => resetTimer()}
            >
              🔄 Reset
            </button>
          </div>
        </div>

        {/* Daily Goal & Recent Activity */}
        <div className="widget-card goal-widget">
          <div className="widget-header">
            <div>
              <h2 className="widget-title">🎯 Daily Study Target</h2>
              <p className="widget-subtitle">Track today's allocated study time</p>
            </div>
            <span className="goal-status-badge">{progressPercent}% complete</span>
          </div>

          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}>
              <span className="progress-bar-label">{progressPercent}%</span>
            </div>
          </div>

          <div className="goal-adjust-row">
            <span>Log study hours:</span>
            <div className="adjust-buttons-group">
              <button
                type="button"
                className="btn-adjust"
                onClick={() => setStudyHours((prev) => Math.max(0, +(prev - 0.5).toFixed(1)))}
              >
                - 30m
              </button>
              <span className="current-hours-val">{studyHours} hrs</span>
              <button
                type="button"
                className="btn-adjust"
                onClick={() => setStudyHours((prev) => +(prev + 0.5).toFixed(1))}
              >
                + 30m
              </button>
            </div>
          </div>

          {/* Recent Notes Preview */}
          <div className="recent-notes-preview">
            <div className="recent-header">
              <span className="recent-title">Recent Notes</span>
              <button
                type="button"
                className="btn-link-all"
                onClick={() => setPage("notes")}
              >
                View all →
              </button>
            </div>

            {recentNotes.length === 0 ? (
              <p className="empty-recent-text">No notes yet. Start writing in the Notes tab!</p>
            ) : (
              <div className="recent-notes-list">
                {recentNotes.map((n) => (
                  <div
                    key={n._id}
                    className="recent-note-row"
                    onClick={() => {
                      if (onSelectSubject) onSelectSubject(n.subject);
                      setPage("notes");
                    }}
                  >
                    <span className="recent-subj-pill">{n.subject}</span>
                    <span className="recent-note-title">{n.title}</span>
                    <span className="recent-arrow">→</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;