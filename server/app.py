from flask import Flask, make_response, request, jsonify
from flask_migrate import Migrate
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
)
from flask_bcrypt import Bcrypt
from models import *
from marshmallow import ValidationError
from flask_cors import CORS

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'fake_secret_key'
app.secret_key = 'fake_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app, origins=[
    "https://book-app-rosy.vercel.app",
    "http://localhost:5173"
])

db.init_app(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)


def current_user():
  # Helper to fetch the logged-in user from the JWT identity
  user_id = get_jwt_identity()
  return User.query.get(int(user_id)) if user_id is not None else None


# Authentication
@app.route('/signup', methods=['POST'])
def signup():
  user_schema = UserSchema()
  req = request.get_json()
  try:
    data = user_schema.load(req) # validates and deserializes the data received from the user
  except ValidationError as err:
    return make_response(jsonify({"error": err.messages}), 400)

  # Encrypt password using bcrypt
  encrypted = bcrypt.generate_password_hash(data['password']).decode('utf-8')
  user = User(username=data['username'], password=encrypted)
  db.session.add(user) # add user to database
  db.session.commit()

  access_token = create_access_token(identity=str(user.id))
  return make_response(jsonify({
      "access_token": access_token,
      "user": user_schema.dump(user)
  }), 201)

@app.route('/login', methods=['POST'])
def login():
  user_schema = UserSchema()
  req = request.get_json()
  username = req.get('username')
  password = req.get('password')

  user = User.query.filter(User.username == username).first()

  # Checks if the input password when hashed matches the one stored in the database
  if user and bcrypt.check_password_hash(user.password, password):
    access_token = create_access_token(identity=str(user.id))
    return make_response(jsonify({
        "access_token": access_token,
        "user": user_schema.dump(user)
    }), 200)
  return make_response(jsonify({"error": "Login failed!"}), 401)

@app.route('/logout', methods=['DELETE'])
def logout():
  # Stateless JWTs: there's nothing to invalidate server-side.
  # The frontend just discards the token it's holding.
  return make_response({}, 204)

@app.route('/check', methods=['GET'])
@jwt_required()
def check_session():
  user_schema = UserSchema()
  user = current_user()
  if user:
    return make_response(jsonify(user_schema.dump(user)), 200)
  return make_response(jsonify({"error": "Not logged in!"}), 401)

@app.route('/')
def home():
  return "Welcome!"

# Books
@app.route('/books', methods=['GET'])
def get_books():
  book_schema = BookSchema(many=True)

  # Get query parameters
  page = request.args.get('page', 1, type=int)
  per_page = request.args.get('per_page', 30, type=int)

  search = request.args.get('q', None, type=str)
  query = Book.query
  if search:
    query = query.filter(Book.title.ilike(f"%{search}%"))

  # Paginate the query
  pagination = query.paginate(page=page, per_page=per_page, error_out=False)

  # Return paginated results + metadata
  return make_response(jsonify({
      "page": pagination.page,
      "per_page": pagination.per_page,
      "total": pagination.total,
      "total_pages": pagination.pages,
      "books": book_schema.dump(pagination.items)
  }), 200)


@app.route('/books/kenya', methods=['GET'])
def get_kenyan_books():
  book_schema = BookSchema(many=True)

  page = request.args.get('page', 1, type=int)
  per_page = request.args.get('per_page', 30, type=int)

  search = request.args.get('q', None, type=str)
  query = Book.query.filter_by(country="Kenya")
  if search:
      query = query.filter(Book.title.ilike(f"%{search}%"))

  pagination = query.paginate(page=page, per_page=per_page, error_out=False)

  return make_response(jsonify({
      "page": pagination.page,
      "per_page": pagination.per_page,
      "total": pagination.total,
      "total_pages": pagination.pages,
      "books": book_schema.dump(pagination.items)
  }), 200)

@app.route('/books/<int:book_id>', methods=['GET'])
@jwt_required()
def get_book(book_id):
  book_schema = BookSchema()
  book = Book.query.get(book_id)
  if not book:
      return make_response(jsonify({"error": "Book not found"}), 404)
  return make_response(jsonify(book_schema.dump(book)), 200)

# Recently viewed books
@app.route('/recent', methods=['GET'])
@jwt_required()
def get_recently_viewed():
  user = current_user()
  book_schema = BookSchema(many=True)
  return make_response(jsonify(book_schema.dump(user.recently_viewed)), 200)

def add_to_recent(user, book):
    if book not in user.recently_viewed:
        user.recently_viewed.append(book)

@app.route('/books/<int:book_id>/view', methods=['POST'])
@jwt_required()
def mark_viewed(book_id):
  user = current_user()
  book = Book.query.get(book_id)
  if not book:
      return make_response(jsonify({"error": "Book not found"}), 404)
  add_to_recent(user, book)
  db.session.commit()
  return make_response(jsonify(BookSchema(many=True).dump(user.recently_viewed)), 200)

# Add to lists
@app.route('/books/<int:book_id>/favorite', methods=['POST'])
@jwt_required()
def add_favorite(book_id):
  user = current_user()
  book = Book.query.get(book_id)
  if not book:
      return make_response(jsonify({"error": "Book not found"}), 404)
  if book in user.favorites:
      user.favorites.remove(book)
  else:
      user.favorites.append(book)
      add_to_recent(user, book)
  db.session.commit()
  return make_response(jsonify(BookSchema(many=True).dump(user.favorites)), 200)

@app.route('/books/<int:book_id>/want', methods=['POST'])
@jwt_required()
def add_want(book_id):
    user = current_user()
    book = Book.query.get(book_id)
    if not book:
        return make_response(jsonify({"error": "Book not found"}), 404)
    if book in user.want_to_read:
        user.want_to_read.remove(book)
    else:
        user.want_to_read.append(book)
        if book in user.reading:
            user.reading.remove(book)
        if book in user.read:
            user.read.remove(book)
        add_to_recent(user, book)
    db.session.commit()
    return make_response(jsonify(BookSchema(many=True).dump(user.want_to_read)), 200)

@app.route('/books/<int:book_id>/reading', methods=['POST'])
@jwt_required()
def add_reading(book_id):
    user = current_user()
    book = Book.query.get(book_id)
    if not book:
        return make_response(jsonify({"error": "Book not found"}), 404)
    if book in user.reading:
        user.reading.remove(book)
    else:
        user.reading.append(book)
        if book in user.want_to_read:
            user.want_to_read.remove(book)
        if book in user.read:
            user.read.remove(book)
        add_to_recent(user, book)
    db.session.commit()
    return make_response(jsonify(BookSchema(many=True).dump(user.reading)), 200)

@app.route('/books/<int:book_id>/read', methods=['POST'])
@jwt_required()
def add_read(book_id):
    user = current_user()
    book = Book.query.get(book_id)
    if not book:
        return make_response(jsonify({"error": "Book not found"}), 404)
    if book in user.read:
        user.read.remove(book)
    else:
        user.read.append(book)
        if book in user.want_to_read:
            user.want_to_read.remove(book)
        if book in user.reading:
            user.reading.remove(book)
        add_to_recent(user, book)
    db.session.commit()
    return make_response(jsonify(BookSchema(many=True).dump(user.read)), 200)

# View lists
@app.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    user = current_user()
    return make_response(jsonify(BookSchema(many=True).dump(user.favorites)), 200)

@app.route('/want', methods=['GET'])
@jwt_required()
def get_want():
    user = current_user()
    return make_response(jsonify(BookSchema(many=True).dump(user.want_to_read)), 200)

@app.route('/reading', methods=['GET'])
@jwt_required()
def get_reading():
    user = current_user()
    return make_response(jsonify(BookSchema(many=True).dump(user.reading)), 200)

@app.route('/read', methods=['GET'])
@jwt_required()
def get_read():
    user = current_user()
    return make_response(jsonify(BookSchema(many=True).dump(user.read)), 200)

# Notes
@app.route('/books/<int:book_id>/notes', methods=['GET'])
@jwt_required()
def get_notes(book_id):
    note_schema = NoteSchema(many=True)
    user_id = get_jwt_identity()
    notes = Note.query.filter(Note.book_id == book_id, Note.user_id == int(user_id)).all()
    return make_response(jsonify(note_schema.dump(notes)), 200)

@app.route('/books/<int:book_id>/notes', methods=['POST'])
@jwt_required()
def make_note(book_id):
  note_schema = NoteSchema()
  req = request.get_json()
  try:
      data = note_schema.load(req)
  except ValidationError as err:
      return make_response(jsonify({"error": err.messages}), 400)
  new_note = Note(content=data['content'], book_id=book_id, user_id=int(get_jwt_identity()))
  db.session.add(new_note)
  db.session.commit()
  return make_response(jsonify(note_schema.dump(new_note)), 201)

@app.route('/notes/<int:id>', methods=['PATCH'])
@jwt_required()
def edit_note(id):
  note_schema = NoteSchema()
  note = Note.query.filter(Note.id == id, Note.user_id == int(get_jwt_identity())).first()
  if not note:
      return make_response(jsonify({"error": "Note not found!"}), 404)
  try:
    req = request.get_json()
    data = note_schema.load(req, partial=True)
  except ValidationError as err:
    return make_response(jsonify({"error": err.messages}), 400)

  # Get the key value pairs from the data received and change the value of the selected note
  for key,value in data.items():
    setattr(note, key, value)
  db.session.commit()
  return make_response(jsonify(note_schema.dump(note)), 200)

@app.route('/notes/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_note(id):
  note = Note.query.filter(Note.id == id, Note.user_id == int(get_jwt_identity())).first()
  if not note:
    return make_response(jsonify({"error": "Note not found!"}), 404)
  db.session.delete(note)
  db.session.commit()
  return make_response(jsonify({"message": "Note deleted successfully!"}), 200)

if __name__ == '__main__':
  app.run(port=5555, debug=True)