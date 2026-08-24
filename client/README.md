This is a book application where you can view all your favourite books and find out relevant information e.g:
  - Author
  - If its in a series, the series name and position in the series.
  - The year it was published.
  - The author.
  - Whether an ebook is available.
  - The languages available

It was made using:
  - React
  - CSS

1. Set-up instructions:
  - Run 'npm install' on your terminal.
  - To view the application, run 'npm run dev'

2. API and endpoints used:
  - 'https://openlibrary.org/search.json?q=girl&limit=40' is the homepage since the API doesn't have an option to display all books
  - 'https://openlibrary.org/search.json?q=[searchterm]' is the search API

3. Known challenges/bugs:
  - When you search, in order for it to go back to the original page you have to refresh the page.
  - Results load slowly.
