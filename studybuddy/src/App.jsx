import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import Notes from "./pages/Notes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("studybuddy_token") || "");
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("studybuddy_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [page, setPage] = useState(() => (localStorage.getItem("studybuddy_token") ? "dashboard" : "login"));
  const [subjectFilter, setSubjectFilter] = useState("All");

  useEffect(() => {
    if (token) {
      localStorage.setItem("studybuddy_token", token);
    } else {
      localStorage.removeItem("studybuddy_token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("studybuddy_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("studybuddy_user");
    }
  }, [user]);

  const handleLoginSuccess = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    setPage("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("studybuddy_token");
    localStorage.removeItem("studybuddy_user");
    setPage("login");
  };

  const handleSelectSubjectForNotes = (subjectName) => {
    setSubjectFilter(subjectName);
    setPage("notes");
  };

  // If unauthenticated
  if (!token) {
    if (page === "register") {
      return <Register goToLogin={() => setPage("login")} />;
    }
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        goToRegister={() => setPage("register")}
      />
    );
  }

  // If authenticated
  return (
    <div className="app-layout-wrapper">
      <Navbar
        page={page}
        setPage={setPage}
        user={user}
        onLogout={handleLogout}
      />

      <main className="main-content-area">
        {page === "dashboard" && (
          <Dashboard
            setPage={setPage}
            user={user}
            token={token}
            onSelectSubject={handleSelectSubjectForNotes}
          />
        )}

        {page === "subjects" && (
          <Subjects
            setPage={setPage}
            onSelectSubject={handleSelectSubjectForNotes}
          />
        )}

        {page === "notes" && (
          <Notes
            token={token}
            user={user}
            initialSubjectFilter={subjectFilter}
            onClearSubjectFilter={() => setSubjectFilter("All")}
          />
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p className="footer-brand">📚 <strong>StudyBuddy</strong> — Empowering academic excellence</p>
          <p className="footer-meta">MERN Stack Hackathon Project &bull; Fully Responsive &amp; Real-time Connected</p>
        </div>
      </footer>
    </div>
  );
}

export default App;