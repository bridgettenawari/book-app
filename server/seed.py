#!/usr/bin/env python3
import requests
import json
from app import app
from models import db, User, Book, Note

def fetch_books_from_openlibrary(query, limit=300, country="Global"):
    url = f"https://openlibrary.org/search.json?q={query}&limit={limit}"
    res = requests.get(url)
    if res.status_code == 200:
        return res.json().get("docs", [])
    return []

def fetch_books_from_subject(subject="place:kenya", limit=300, country="Kenya"):
    url = f"https://openlibrary.org/subjects/{subject}.json?limit={limit}"
    res = requests.get(url)
    if res.status_code == 200:
        return res.json().get("works", [])
    return []

def fetch_epub_link(title):
    url = f"https://standardebooks.org/api/books?title={title}"
    res = requests.get(url)
    if res.status_code == 200:
        data = res.json()
        if data and "epub_url" in data[0]:
            return data[0]["epub_url"]
    return None

with app.app_context():
    db.create_all()

    # Clear database
    User.query.delete()
    Book.query.delete()
    Note.query.delete()

    users = [
        User(username='orina2005', password='password123'),
        User(username='maryatieno', password='12345678'),
    ]
    db.session.add_all(users)
    db.session.commit()

    # Fetch Global books
    global_books_data = fetch_books_from_openlibrary("love", limit=300, country="Global")
    global_books = []
    for b in global_books_data:

        new_book = Book(
            title=b.get("title"),
            author=", ".join(b.get("author_name", [])) if b.get("author_name") else None,
            country="Global",
            epub_link=fetch_epub_link(b.get("title")),
            cover_i=str(b.get("cover_i")) if b.get("cover_i") else None,
            series_position=str(b.get("series_position")) if b.get("series_position") else None,
            series_name=json.dumps(b.get("series_name")) if b.get("series_name") else None,
            first_publish_year=b.get("first_publish_year"),
            author_name=json.dumps(b.get("author_name")) if b.get("author_name") else None,
            ebook_access=b.get("ebook_access"),
            ia=json.dumps(b.get("ia")) if b.get("ia") else None,
            isbn=json.dumps(b.get("isbn")) if b.get("isbn") else None,
            language=json.dumps(b.get("language")) if b.get("language") else None,
            key=b.get("key") if b.get("key") else None
        )



        global_books.append(new_book)
        db.session.add(new_book)
    db.session.commit()

    # Fetch Kenyan books
    kenyan_books_data = fetch_books_from_subject("place:kenya", limit=300, country="Kenya")
    kenyan_books = []
    for b in kenyan_books_data:
        authors = [a.get("name") for a in b.get("authors", []) if a.get("name")]
        
        new_book = Book(
            title=b.get("title"),
            author=", ".join(authors) if authors else None,
            country="Kenya",
            epub_link=fetch_epub_link(b.get("title")),
            cover_i=str(b.get("cover_id")) if b.get("cover_id") else None,
            series_position=None,  
            series_name=None,
            first_publish_year=b.get("first_publish_year"),
            author_name=json.dumps(authors) if authors else None,  
            ebook_access=None,     
            ia=json.dumps(b.get("ia")) if b.get("ia") else None,
            isbn=json.dumps([b.get("availability", {}).get("isbn")]) if b.get("availability", {}).get("isbn") else None,
            language=None,        
            key=b.get("key") if b.get("key") else None
    )
        kenyan_books.append(new_book)
        db.session.add(new_book)
    db.session.commit()

    # Attach notes
    notes = [
        Note(content="Loved the opening chapter!", book_id=global_books[0].id, user_id=users[0].id),
        Note(content="This book is amazing.", book_id=kenyan_books[0].id, user_id=users[1].id),
    ]
    db.session.add_all(notes)
    db.session.commit()

    print("Database seeded successfully!")
