import { useState } from "react";

function Subjects({ setPage, onSelectSubject }) {
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubjName, setNewSubjName] = useState("");
  const [newSubjIcon, setNewSubjIcon] = useState("📖");
  const [newSubjDesc, setNewSubjDesc] = useState("");
  const [newSubjTopics, setNewSubjTopics] = useState("");

  const initialSubjects = [
    {
      id: "java",
      name: "Java",
      icon: "☕",
      category: "Programming",
      description: "Object-oriented programming, collections framework, multi-threading, and JVM fundamentals.",
      topics: ["OOP & Interfaces", "Collections & Generics", "Exceptions", "Streams API"]
    },
    {
      id: "cpp",
      name: "C++",
      icon: "💻",
      category: "Systems",
      description: "Low-level system programming, pointers, manual memory management, and STL containers.",
      topics: ["Pointers & References", "Classes & Templates", "STL Library", "Memory Management"]
    },
    {
      id: "dbms",
      name: "DBMS",
      icon: "🗄️",
      category: "Databases",
      description: "Relational database concepts, SQL queries, normalization, ACID properties, and indexing.",
      topics: ["SQL & Joins", "Normalization (1NF-BCNF)", "Transactions & ACID", "Indexing"]
    },
    {
      id: "math",
      name: "Mathematics",
      icon: "📐",
      category: "Foundations",
      description: "Discrete math, linear algebra, calculus, and probability for computer science and engineering.",
      topics: ["Linear Algebra", "Calculus", "Probability & Stats", "Graph Theory"]
    },
    {
      id: "python",
      name: "Python",
      icon: "🐍",
      category: "Programming",
      description: "Rapid prototyping, data manipulation, automation scripts, and modern backend development.",
      topics: ["Data Structures", "OOP in Python", "List Comprehensions", "Modules & Pip"]
    },
    {
      id: "webdev",
      name: "Web Dev",
      icon: "🌐",
      category: "Fullstack",
      description: "HTML5, CSS3, modern JavaScript (ES6+), React, Node.js, and RESTful API architectures.",
      topics: ["React Components", "State & Props", "Async/Await & Fetch", "Responsive CSS"]
    }
  ];

  const [subjectsList, setSubjectsList] = useState(() => {
    const saved = localStorage.getItem("studybuddy_custom_subjects");
    return saved ? JSON.parse(saved) : initialSubjects;
  });

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubjName.trim()) return;

    const newSubject = {
      id: newSubjName.toLowerCase().replace(/\s+/g, "-"),
      name: newSubjName.trim(),
      icon: newSubjIcon || "📖",
      category: "Custom",
      description: newSubjDesc.trim() || "User-defined subject for study notes and practice.",
      topics: newSubjTopics ? newSubjTopics.split(",").map(t => t.trim()).filter(Boolean) : ["General Notes"]
    };

    const updated = [...subjectsList, newSubject];
    setSubjectsList(updated);
    localStorage.setItem("studybuddy_custom_subjects", JSON.stringify(updated));

    setNewSubjName("");
    setNewSubjDesc("");
    setNewSubjTopics("");
    setShowAddModal(false);
  };

  const filteredSubjects = subjectsList.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category?.toLowerCase().includes(q)
    );
  });

  const handleOpenSubjectNotes = (subjectName) => {
    if (onSelectSubject) {
      onSelectSubject(subjectName);
    }
    setPage("notes");
  };

  return (
    <div className="page-container subjects-page-layout">
      {/* Top Banner */}
      <div className="section-header-block">
        <div>
          <h1 className="page-heading">📚 Course Subjects</h1>
          <p className="page-subheading">Select any subject to jump straight into its notes and topics</p>
        </div>
        <button
          type="button"
          className="btn-primary-action"
          onClick={() => setShowAddModal(true)}
        >
          <span>➕ Add Subject</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="subjects-toolbar">
        <div className="search-bar-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search subjects by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearch("")}
            >
              ✕
            </button>
          )}
        </div>
        <span className="subjects-count-tag">{filteredSubjects.length} Subjects available</span>
      </div>

      {/* Grid of Subject Cards */}
      <div className="subjects-grid">
        {filteredSubjects.map((subject) => (
          <div className="subject-card-item" key={subject.id || subject.name}>
            <div className="subject-card-header">
              <span className="subject-card-icon">{subject.icon}</span>
              <span className="subject-category-badge">{subject.category || "General"}</span>
            </div>

            <h2 className="subject-card-title">{subject.name}</h2>
            <p className="subject-card-description">{subject.description}</p>

            {subject.topics && subject.topics.length > 0 && (
              <div className="subject-topics-cloud">
                {subject.topics.map((topic, i) => (
                  <span key={i} className="topic-chip">{topic}</span>
                ))}
              </div>
            )}

            <div className="subject-card-actions">
              <button
                type="button"
                className="btn-view-subject-notes"
                onClick={() => handleOpenSubjectNotes(subject.name)}
              >
                <span>📝 View Notes</span>
                <span className="arrow-icon">→</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Subject Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Subject</h3>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubject} className="modal-form">
              <div className="form-group">
                <label htmlFor="subj-name">Subject Name</label>
                <input
                  id="subj-name"
                  type="text"
                  placeholder="e.g. Operating Systems"
                  value={newSubjName}
                  onChange={(e) => setNewSubjName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subj-icon">Emoji Icon</label>
                <input
                  id="subj-icon"
                  type="text"
                  placeholder="e.g. ⚙️"
                  value={newSubjIcon}
                  onChange={(e) => setNewSubjIcon(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="subj-desc">Description</label>
                <textarea
                  id="subj-desc"
                  rows={3}
                  placeholder="Brief summary of what this course covers..."
                  value={newSubjDesc}
                  onChange={(e) => setNewSubjDesc(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="subj-topics">Key Topics (comma separated)</label>
                <input
                  id="subj-topics"
                  type="text"
                  placeholder="Threads, Deadlocks, Paging, Virtual Memory"
                  value={newSubjTopics}
                  onChange={(e) => setNewSubjTopics(e.target.value)}
                />
              </div>

              <div className="modal-footer-actions">
                <button
                  type="button"
                  className="btn-secondary-action"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary-action">
                  Create Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subjects;