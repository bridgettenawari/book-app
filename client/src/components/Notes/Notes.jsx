import { useState, useEffect } from "react";
import { apiGet, apiPost, apiPatch, apiDelete } from "../../Api";
import "./Notes.css";

function Notes({ bookId, user, setShowPopup }) {
	const [notes, setNotes] = useState([]);
	const [newNote, setNewNote] = useState("");
	const [editingNoteId, setEditingNoteId] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	// stringify errors for displaying
	function formatError(err) {
		if (!err) return "Something went wrong.";
		if (typeof err === "string") return err;
		return Object.entries(err)
			.map(
				([field, msgs]) =>
					`${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`,
			)
			.join(" | ");
	}

	// Fetch notes for the book
	useEffect(() => {
		if (!user) {
			// Prevents showing error 401 if not logged in
			setNotes([]);
			setLoading(false);
			return;
		}
		setLoading(true);
		apiGet(`/books/${bookId}/notes`)
			.then((data) => {
				if (data.error) {
					setError(formatError(data.error) || "Could not fetch notes!");
					setNotes([]);
				} else {
					setNotes(Array.isArray(data) ? data : []);
				}
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, [bookId, user]); // fetch notes if logged in and if a note is added, edited, or deleted
	``;
	// Add a new note
	const handleAddNote = () => {
		if (!user) {
			setShowPopup(true);
			return;
		}
		if (!newNote.trim()) return;
		apiPost(`/books/${bookId}/notes`, { content: newNote.trim() })
			.then((data) => {
				if (data.error || !data.id) {
					setError(formatError(data.error) || "Could not add note!");
				} else {
					setNotes((prev) => [...prev, data]);
					setNewNote("");
					setError(null);
				}
			})
			.catch((err) => setError(err.message));
	};

	// Edit a note
	const handleEditNote = (id, updatedContent) => {
		if (!updatedContent.trim()) return;
		apiPatch(`/notes/${id}`, { content: updatedContent.trim() })
			.then((data) => {
				if (data.error) {
					setError(formatError(data.error) || "Could not edit note!");
				} else {
					setNotes((prev) => prev.map((n) => (n.id === id ? data : n)));
					setNewNote("");
					setError(null);
				}
			})
			.catch((err) => setError(err.message));
	};

	// Delete a note
	const handleDeleteNote = (id) => {
		apiDelete(`/notes/${id}`)
			.then((data) => {
				if (data.error) {
					setError(formatError(data.error) || "Could not delete note!");
				} else {
					setNotes((prev) => prev.filter((n) => n.id !== id));
					setError(null);
				}
			})
			.catch((err) => setError(formatError(err.message)));
	};

	return (
		<div className="notes-section">
			<h3>Notes</h3>
			{loading && (
				<div className="notes-status">
					<div className="spinner">↻</div>loading...
				</div>
			)}
			{error && <div className="error-message">Error: {error}</div>}

			{!loading && notes.length === 0 && (
				<p className="no-notes">No notes yet.</p>
			)}

			<ul className="notes-list">
				{notes.map((note) =>
					note && note.id ? (
						<li key={note.id} className="note-item">
							<div className="note-content">{note.content}</div>
							<div className="note-actions">
								<button
									className="edit-btn"
									onClick={() => {
										setEditingNoteId(note.id);
									}}
								>
									𓂃🖊
								</button>
								<button
									className="delete-btn"
									onClick={() => handleDeleteNote(note.id)}
								>
									🗑
								</button>
							</div>
						</li>
					) : null,
				)}
			</ul>

			<div className="add-note">
				<textarea
					value={newNote}
					onChange={(e) => setNewNote(e.target.value)}
					placeholder={editingNoteId ? "Edit note..." : "Write a note..."} // if editing, show editing note, otherwise show write note
				/>
				<button
					onClick={() => {
						if (editingNoteId) {
							handleEditNote(editingNoteId, newNote);
							setEditingNoteId(null);
						} else {
							handleAddNote();
						}
					}}
					disabled={!newNote.trim()}
				>
					{editingNoteId ? "Save Note" : "+ Add Note"}
				</button>
			</div>
		</div>
	);
}

export default Notes;
