This is a full‑stack book management application where users can browse, search, and organize their favorite books. The app provides detailed information about each book, including:

- The author
- Series details (name and position)
- Year of publication
- Languages that the book is available in

How to operate the application:
- From the homepage, using either the login button there or clicking on the login/signup route, signup or log into your account.
- Head to the books route to browse some books either Kenyan books or Global books depending on what you're in the mood for.
- Add books either to favourites, read, want to read or currently reading.
- You can view the books you've added to those lists in the favorites tab.
- You can add notes to your books and edit or delete them.
- Any book that you've interacted with by adding it to a list can be viewed in the recents tab to help you keep track of you're most recently viewed books.

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

My presentation link:
- https://docs.google.com/presentation/d/10Zz7Ccn-AasnwdEBUt0H58FCM5De5JUoFFza03AUI2Q/edit?usp=sharing
