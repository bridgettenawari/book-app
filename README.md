This is a full‑stack book management application where users can browse, search, and organize their favorite books. The app provides detailed information about each book, including:

- The author
- Series details (name and position)
- Year of publication
- Ebook availability
- Languages that the book is available in

Technologies used:

- React(frontend)
- CSS(styling)
- Flask(backend)
- SQLAlchemy(database)
- Marshamallow(serializing and deserializing data)

Set up and run instructions:

- Clone the repository, navigate into the client folder and run:
  npm install
  npm run dev
- Navigate into the server folder and run:
  pipenv install / pip install requirements.txt
  python3 app.py
- Add 'VITE_API_URL=http://localhost:5555' to a .env.local file in your client folder

Core Functionality
- Browse books: View a paginated list of books.
- Search books: Find books by title.
- Favorites: Mark/unmark books as favorites.
- Reading status: Track books as “Want to Read”, “Currently Reading”, or “Read”.
- Recently viewed: Automatically saves books whose status you've changed or books you've added to favorites.
- Notes: Add, edit, and delete personal notes for each book.

Deployment links:
- Frontend: https://book-app-rosy.vercel.app/
- Backend: https://book-app-3f9e.onrender.com