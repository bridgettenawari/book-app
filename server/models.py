from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Association tables(simple join tables are shown on top of the normal objects)
favorites = db.Table("favorites",
    db.Column("user_id", db.Integer, db.ForeignKey("user.id")),
    db.Column("book_id", db.Integer, db.ForeignKey("book.id"))
)

want_to_read = db.Table("want_to_read",
    db.Column("user_id", db.Integer, db.ForeignKey("user.id")),
    db.Column("book_id", db.Integer, db.ForeignKey("book.id"))
)

reading = db.Table("reading",
    db.Column("user_id", db.Integer, db.ForeignKey("user.id")),
    db.Column("book_id", db.Integer, db.ForeignKey("book.id"))
)

read = db.Table("read",
    db.Column("user_id", db.Integer, db.ForeignKey("user.id")),
    db.Column("book_id", db.Integer, db.ForeignKey("book.id"))
)

class User(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(80), unique=True, nullable=False)
  password = db.Column(db.String(80), nullable=False)

  notes = db.relationship("Note", back_populates="user")

  favorites = db.relationship("Book", secondary=favorites, back_populates="fav_users")
  want_to_read = db.relationship("Book", secondary=want_to_read, back_populates="want_users")
  reading = db.relationship("Book", secondary=reading, back_populates="reading_users")
  read = db.relationship("Book", secondary=read, back_populates="read_users")

class Book(db.Model):
  __tablename__ = "book"
  id = db.Column(db.Integer, primary_key=True)
  title = db.Column(db.String(200), nullable=False)
  author = db.Column(db.String(200))
  country = db.Column(db.String(100))

  notes = db.relationship("Note", back_populates="book")

  fav_users = db.relationship("User", secondary=favorites, back_populates="favorites")
  want_users = db.relationship("User", secondary=want_to_read, back_populates="want_to_read")
  reading_users = db.relationship("User", secondary=reading, back_populates="reading")
  read_users = db.relationship("User", secondary=read, back_populates="read")

class Note(db.Model):
  __tablename__ = "note"
  id = db.Column(db.Integer, primary_key=True)
  content = db.Column(db.Text, nullable=False)

  book_id = db.Column(db.Integer, db.ForeignKey("book.id"), nullable=False)
  user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

  book = db.relationship("Book", back_populates="notes")
  user = db.relationship("User", back_populates="notes")