import { useState, useEffect } from "react";
import { fetchNotes, addNote, deleteNoteApi } from "../api";

function Notes({ token, user, initialSubjectFilter, onClearSubjectFilter }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Java");
  const [customSubject, setCustomSubject] = useState("");
  const [content, setContent] = useState("");

  // Filter & search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(initialSubjectFilter || "All");

  const defaultSubjects = ["Java", "C++", "DBMS", "Mathematics", "Python", "Web Dev"];

  useEffect(() => {
    if (initialSubjectFilter) {
      setSelectedSubject(initialSubjectFilter);
    }
  }, [initialSubjectFilter]);

  useEffect(() => {
    loadNotes();
  }, [token]);

  const loadNotes = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await fetchNotes(token);
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("Could not fetch notes from server, loading local cache:", err);
      // Fallback to local storage if server is offline
      const local = localStorage.getItem("studybuddy_notes_cache");
      if (local) {
        setNotes(JSON.parse(local));
      } else {
        // Default sample notes so the user sees a rich UI
        const sampleNotes = [
          {
            _id: "demo-1",
            title: "Java OOP Concepts & Interfaces",
            subject: "Java",
            content: "Encapsulation, Inheritance, Polymorphism, and Abstraction. Abstract classes cannot be instantiated. Interfaces support multiple inheritance in Java.",
            createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
          },
          {
            _id: "demo-2",
            title: "Database Normalization (1NF, 2NF, 3NF)",
            subject: "DBMS",
            content: "1NF: Atomic values. 2NF: No partial dependency on primary key. 3NF: No transitive dependency. BCNF: Stricter version of 3NF for multi-attribute keys.",
            createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
          },
          {
            _id: "demo-3",
            title: "C++ Pointers and Memory Allocation",
            subject: "C++",
            content: "Stack vs Heap memory. Use `new` and `delete` operators. Smart pointers in modern C++ include std::unique_ptr, std::shared_ptr, and std::weak_ptr.",
            createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
          }
        ];
        setNotes(sampleNotes);
        localStorage.setItem("studybuddy_notes_cache", JSON.stringify(sampleNotes));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const finalSubject = subject === "Custom" ? customSubject.trim() : subject;
    if (!title.trim() || !finalSubject || !content.trim()) {
      setErrorMsg("Please fill out all fields.");
      return;
    }

    setSaving(true);
    const newNotePayload = {
      title: title.trim(),
      subject: finalSubject,
      content: content.trim()
    };

    try {
      const result = await addNote(newNotePayload, token);
      const createdNote = result.note || result;
      setNotes((prev) => [createdNote, ...prev]);
      setTitle("");
      setContent("");
      if (subject === "Custom") setCustomSubject("");
      setSuccessMsg("Note saved successfully!");
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      // Local fallback note creation
      const offlineNote = {
        _id: "local-" + Date.now(),
        ...newNotePayload,
        createdAt: new Date().toISOString()
      };
      const updated = [offlineNote, ...notes];
      setNotes(updated);
      localStorage.setItem("studybuddy_notes_cache", JSON.stringify(updated));
      setTitle("");
      setContent("");
      if (subject === "Custom") setCustomSubject("");
      setSuccessMsg("Note saved locally (Offline mode)!");
      setTimeout(() => setSuccessMsg(""), 3500);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      await deleteNoteApi(noteId, token);
      setNotes((prev) => prev.filter((n) => n._id !== noteId));
      setSuccessMsg("Note deleted successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      // Offline fallback deletion
      const updated = notes.filter((n) => n._id !== noteId);
      setNotes(updated);
      localStorage.setItem("studybuddy_notes_cache", JSON.stringify(updated));
      setSuccessMsg("Note removed from view.");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  // Derive unique subject filter list
  const existingSubjects = Array.from(new Set(notes.map((n) => n.subject).filter(Boolean)));
  const allFilterOptions = ["All", ...Array.from(new Set([...defaultSubjects, ...existingSubjects]))];

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    const matchesSubject = selectedSubject === "All" || note.subject?.toLowerCase() === selectedSubject.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      note.title?.toLowerCase().includes(query) ||
      note.content?.toLowerCase().includes(query) ||
      note.subject?.toLowerCase().includes(query);
    return matchesSubject && matchesQuery;
  });

  const getSubjectBadgeColor = (subj) => {
    switch (subj?.toLowerCase()) {
      case "java": return "badge-java";
      case "c++": return "badge-cpp";
      case "dbms": return "badge-dbms";
      case "mathematics": return "badge-math";
      case "python": return "badge-python";
      case "web dev": return "badge-web";
      default: return "badge-default";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Just now";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="page-container notes-page-layout">
      {/* Page Header */}
      <div className="section-header-block">
        <div>
          <h1 className="page-heading">📝 Study Notes</h1>
          <p className="page-subheading">Create, organize, and search your subject notes</p>
        </div>
        <div className="notes-stats-pill">
          <span>{notes.length} Total Notes</span>
        </div>
      </div>

      {/* Global Alerts */}
      {errorMsg && (
        <div className="alert-banner alert-error" role="alert">
          <span className="alert-icon">⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="alert-banner alert-success" role="alert">
          <span className="alert-icon">✅</span>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Grid: Left = Creator, Right = List & Search */}
      <div className="notes-main-grid">
        {/* Note Creator Form */}
        <div className="note-editor-card">
          <div className="card-header-styled">
            <span className="header-icon">✍️</span>
            <div>
              <h2 className="card-title">Create New Note</h2>
              <p className="card-subtitle">Quickly capture lecture takeaways</p>
            </div>
          </div>

          <form onSubmit={handleCreateNote} className="note-form">
            <div className="form-group">
              <label htmlFor="note-title">Note Title</label>
              <input
                id="note-title"
                type="text"
                placeholder="e.g. Binary Search Trees & AVL"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="note-subject">Subject</label>
              <select
                id="note-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                {defaultSubjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
                <option value="Custom">+ Custom Subject...</option>
              </select>
            </div>

            {subject === "Custom" && (
              <div className="form-group">
                <label htmlFor="custom-subject">Custom Subject Name</label>
                <input
                  id="custom-subject"
                  type="text"
                  placeholder="e.g. Operating Systems"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <div className="label-with-meta">
                <label htmlFor="note-content">Note Content</label>
                <span className="char-count">{content.length} chars</span>
              </div>
              <textarea
                id="note-content"
                rows={6}
                placeholder="Write your study notes, definitions, formulas, or key ideas..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary-action"
              disabled={saving}
            >
              {saving ? "Saving Note..." : "💾 Save Note"}
            </button>
          </form>
        </div>

        {/* Notes Browser & List */}
        <div className="notes-browser-column">
          {/* Search & Filter Toolbar */}
          <div className="notes-toolbar-card">
            <div className="search-bar-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search notes by title, keyword, or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setSearchQuery("")}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Subject Filter Pills */}
            <div className="subject-filter-scroller">
              <span className="filter-label">Filter:</span>
              {allFilterOptions.map((subj) => (
                <button
                  key={subj}
                  type="button"
                  className={`filter-chip ${selectedSubject.toLowerCase() === subj.toLowerCase() ? "active" : ""}`}
                  onClick={() => {
                    setSelectedSubject(subj);
                    if (onClearSubjectFilter) onClearSubjectFilter();
                  }}
                >
                  {subj}
                </button>
              ))}
            </div>
          </div>

          {/* Notes List */}
          {loading ? (
            <div className="notes-loading-state">
              <div className="loading-spinner"></div>
              <p>Loading your study notes...</p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="notes-empty-state">
              <div className="empty-icon">📖</div>
              <h3>No notes found</h3>
              <p>
                {searchQuery || selectedSubject !== "All"
                  ? "Try changing your search term or subject filter."
                  : "Start writing your first note using the form on the left!"}
              </p>
              {(searchQuery || selectedSubject !== "All") && (
                <button
                  type="button"
                  className="btn-outline-reset"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSubject("All");
                  }}
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <div className="notes-cards-grid">
              {filteredNotes.map((note) => (
                <article key={note._id} className="note-card-item">
                  <div className="note-card-top">
                    <span className={`subject-pill-tag ${getSubjectBadgeColor(note.subject)}`}>
                      {note.subject || "General"}
                    </span>
                    <span className="note-date-text">{formatDate(note.createdAt)}</span>
                  </div>

                  <h3 className="note-item-title">{note.title}</h3>
                  <p className="note-item-body">{note.content}</p>

                  <div className="note-card-bottom">
                    <button
                      type="button"
                      className="btn-delete-note"
                      onClick={() => handleDeleteNote(note._id)}
                      title="Delete this note"
                    >
                      <span>🗑️ Delete</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notes;