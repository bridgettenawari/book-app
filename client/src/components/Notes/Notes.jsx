import { useState, useEffect } from "react";
import { apiGet, apiPost, apiPatch, apiDelete } from "../../Api";
import "./Notes.css";

function Notes({ bookId }) {
	const [notes, setNotes] = useState([]);
	const [newNote, setNewNote] = useState("");
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	// Fetch notes for the book
	useEffect(() => {
		setLoading(true);
		apiGet(`/books/${bookId}/notes`)
			.then((data) => {
				if (data.error) setError(data.error);
				else setNotes(data);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, [bookId]);

	// Add a new note
	const handleAddNote = () => {
		if (!newNote.trim()) return;
		apiPost(`/books/${bookId}/notes`, { content: newNote.trim() })
			.then((data) => {
				if (data.error) setError(data.error);
				else {
					setNotes((prev) => [...prev, data]);
					setNewNote("");
				}
			})
			.catch((err) => setError(err.message));
	};

	// Edit a note
	const handleEditNote = (id, updatedContent) => {
		if (!updatedContent.trim()) return;
		apiPatch(`/notes/${id}`, { content: updatedContent.trim() })
			.then((data) => {
				if (data.error) setError(data.error);
				else setNotes((prev) => prev.map((n) => (n.id === id ? data : n)));
			})
			.catch((err) => setError(err.message));
	};

	// Delete a note
	const handleDeleteNote = (id) => {
		apiDelete(`/notes/${id}`)
			.then((data) => {
				if (data.error) setError(data.error);
				else setNotes((prev) => prev.filter((n) => n.id !== id));
			})
			.catch((err) => setError(err.message));
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
				{notes.map((note) => (
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
				))}
			</ul>

			<div className="add-note">
				<textarea
					value={newNote}
					onChange={(e) => setNewNote(e.target.value)}
					placeholder="Write a note..."
				/>
				<button onClick={handleAddNote} disabled={!newNote.trim()}>
					+ Add Note
				</button>
			</div>
		</div>
	);
}

export default Notes;
