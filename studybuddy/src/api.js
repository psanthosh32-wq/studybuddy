const API_BASE = "http://localhost:5000/api";

export async function loginUser(email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to login");
    }
    return data;
  } catch (err) {
    if (err.message.includes("Failed to fetch") || err.name === "TypeError") {
      throw new Error("Unable to reach backend server at http://localhost:5000. Is the backend running?");
    }
    throw err;
  }
}

export async function registerUser(name, email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }
    return data;
  } catch (err) {
    if (err.message.includes("Failed to fetch") || err.name === "TypeError") {
      throw new Error("Unable to reach backend server at http://localhost:5000. Is the backend running?");
    }
    throw err;
  }
}

export async function fetchNotes(token) {
  try {
    const res = await fetch(`${API_BASE}/notes`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to load notes");
    }
    return data;
  } catch (err) {
    if (err.message.includes("Failed to fetch") || err.name === "TypeError") {
      throw new Error("Backend server unreachable");
    }
    throw err;
  }
}

export async function addNote(noteData, token) {
  try {
    const res = await fetch(`${API_BASE}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(noteData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to add note");
    }
    return data;
  } catch (err) {
    if (err.message.includes("Failed to fetch") || err.name === "TypeError") {
      throw new Error("Backend server unreachable");
    }
    throw err;
  }
}

export async function deleteNoteApi(noteId, token) {
  try {
    const res = await fetch(`${API_BASE}/notes/${noteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to delete note");
    }
    return data;
  } catch (err) {
    if (err.message.includes("Failed to fetch") || err.name === "TypeError") {
      throw new Error("Backend server unreachable");
    }
    throw err;
  }
}
