from flask import Flask, make_response, request, jsonify, session
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from models import *
from marshmallow import ValidationError

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'fake_secret_key'
app.secret_key = 'fake_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)

# Schemas
user_schema = UserSchema()
book_schema = BookSchema()
note_schema = NoteSchema()

# Checks if the user is logged in before any request is fetched
@app.before_request
def check_if_logged_in():
  allowed = ['login', 'signup']
  if not session.get('user_id') and request.endpoint not in allowed:
    return make_response(jsonify({"error": "Access denied!"}), 401)

# Authentication
@app.route('/signup', methods=['POST'])
def signup():
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
  return make_response(jsonify(user_schema.dump(user)), 201) # Sends the users data to the frontend after serializing

@app.route('/login', methods=['POST'])
def login():
  req = request.get_json()
  username = req.get('username')
  password = req.get('password')

  user = User.query.filter(User.username == username).first()

  # Checks if the input password when hashed matches the one stored in the database
  if user and bcrypt.check_password_hash(user.password, password):
    session['user_id'] = user.id
    return make_response(jsonify(user_schema.dump(user)), 200)
  return make_response(jsonify({"error": "Login failed!"}), 401)

@app.route('/logout', methods=['DELETE'])
def logout():
  session['user_id'] = None
  return make_response({}, 204)

@app.route('/check', methods=['GET'])
def check_session():
  if session.get('user_id'):
    # Checks if the user id saved in the session is the same as the user id and if it is, it stays logged in
    user = User.query.filter(User.id == session['user_id']).first()
    return make_response(jsonify(user_schema.dump(user)), 200)
  # Otherwise it logs you out
  return make_response(jsonify({}, 204))

# Books
@app.route('/books', methods=['GET'])
def get_books():
  books = Book.query.all()
  return make_response(jsonify(book_schema.dump(books)), 200)

@app.route('/books/kenya', methods=['GET'])
def get_kenyan_books():
    schema = BookSchema(many=True)
    books = Book.query.filter_by(country="Kenya").all()
    return make_response(jsonify(schema.dump(books)), 200)

# Notes
@app.route('books/<int:book_id>/notes', methods=['GET'])
def get_notes(book_id):
  notes = Note.query.filter(Note.book_id == book_id).all()
  return make_response(jsonify(note_schema.dump(notes)), 200)

@app.route('/books/<int:book_id>/notes', methods=['POST'])
def make_note(book_id):
  req = request.get_json()
  try:
    data = note_schema.load(req)
  except ValidationError as err:
    return make_response(jsonify({"error": err.messages}), 400)
  new_note = Note(content=data['content'], book_id=book_id, user_id=session['user_id'])
  db.session.add(new_note)
  db.session.commit()
  return make_response(jsonify(note_schema.dump(new_note)), 201)

@app.route('/notes/<int:id>')
def edit_note(id):
  note = Note.query.filter(Note.id == id).first()
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
  db.session.add(note)
  db.session.commit()
  return make_response(jsonify(note_schema.dump(note)), 200)

@app.route('/notes/<int:id>', methods=['DELETE'])
def delete_note(id):
  note = Note.query.filter(Note.id == id).first()
  if not note:
    return make_response(jsonify({"error": "Note not found!"}), 404)
  db.session.delete(note)
  db.session.commit()
  return make_response(jsonify({"message": "Note deleted successfully!"}), 200)

if __name__ == '__main__':
  app.run(port=5555, debug=True)