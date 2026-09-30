import { useState } from "react";

function Navbar({ page, setPage, user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (targetPage) => {
    setPage(targetPage);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "subjects", label: "Subjects", icon: "📚" },
    { id: "notes", label: "Notes", icon: "📝" }
  ];

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand / Logo */}
        <div className="navbar-brand" onClick={() => handleNavClick("dashboard")} role="button" tabIndex={0}>
          <div className="brand-icon-box">📚</div>
          <div className="brand-text-group">
            <span className="brand-title">StudyBuddy</span>
            <span className="brand-subtitle">Learning Hub</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link-btn ${page === item.id ? "active" : ""}`}
              onClick={() => handleNavClick(item.id)}
            >
              <span className="nav-item-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Info & Actions */}
        <div className="nav-actions">
          {user && (
            <div className="user-profile-badge" title={`Signed in as ${user.email || user.name}`}>
              <div className="user-avatar-circle">{getInitials(user.name)}</div>
              <div className="user-info-text">
                <span className="user-name">{user.name || "Student"}</span>
              </div>
            </div>
          )}

          <button className="btn-logout" onClick={onLogout} title="Log out of StudyBuddy">
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Logout</span>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            className={`mobile-menu-toggle ${mobileMenuOpen ? "open" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          {user && (
            <div className="mobile-user-card">
              <div className="user-avatar-circle">{getInitials(user.name)}</div>
              <div>
                <p className="mobile-user-name">{user.name}</p>
                <p className="mobile-user-email">{user.email}</p>
              </div>
            </div>
          )}

          <div className="mobile-nav-links">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`mobile-nav-btn ${page === item.id ? "active" : ""}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="nav-item-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="mobile-logout-wrapper">
            <button className="mobile-logout-btn" onClick={onLogout}>
              <span>🚪</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;