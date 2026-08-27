import { useState, useEffect } from "react";
import { apiGet, apiPost, apiPatch, apiDelete } from "../../Api";
import "./Notes.css";

function Notes({ bookId }) {
	const [notes, setNotes] = useState([]);
	const [newNote, setNewNote] = useState("");
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
		setLoading(true);
		apiGet(`/books/${bookId}/notes`)
			.then((data) => {
				if (data.error) {
					setError(formatError(data.error) || "Could not fetch notes!");
					setNotes([]);
				} else {
					setNotes(Array.isArray(data) ? data : []); // ensures it's an array
				}
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, [bookId]);
``
	// Add a new note
	const handleAddNote = () => {
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
				if (data.error || !data.id) {
					setError(formatError(data.error) || "Could not edit note!");
				} else {
					setNotes((prev) => prev.map((n) => (n.id === id ? data : n)));
					setError(null);
				}
			})
			.catch((err) => setError(err.message));
	};

	// Delete a note
	const handleDeleteNote = (id) => {
		apiDelete(`/notes/${id}`)
			.then((data) => {
				if (data.error || !data.id) {
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
			{loading && <div>Loading notes...</div>}
			{error && <div className="error-message">Error: {error}</div>}

			{!loading && notes.length === 0 && (
				<p className="no-notes">No notes yet.</p>
			)}

			<ul className="notes-list">
				{notes.map((note) =>
					note && note.id ? (
						<li key={note.id} className="note-item">
							<span>{note.content}</span>
							<div className="note-actions">
								<button
									className="edit-btn"
									onClick={() => {
										const updated = prompt("Edit note:", note.content);
										if (updated !== null) handleEditNote(note.id, updated);
									}}
								>
									✎ Edit
								</button>
								<button
									className="delete-btn"
									onClick={() => handleDeleteNote(note.id)}
								>
									🗑 Delete
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
					placeholder="Write a note..."
				/>
				<button onClick={handleAddNote} disabled={!newNote.trim()}>
					{" "}
					{/*Disable button if note is empty*/}+ Add Note
				</button>
			</div>
		</div>
	);
}

export default Notes;
