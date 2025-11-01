// models.cjs - all schemas
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: String,
  author: String,
  genre: String,
  type: String,
  available: { type: Boolean, default: true }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  password: String,
  email: { type: String, unique: true },
  mobile: { type: Number, unique: true, sparse: true },
  admin: { type: Boolean, default: false }
}, { timestamps: true });

const borrowSchema = new mongoose.Schema({
  username: String,
  bookid: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' , unique: true},
  duedate: { type: Date, default: () => new Date(Date.now() + 15*24*60*60*1000), required: true }
}, { timestamps: true });

const returnSchema = new mongoose.Schema({
  username: String,
  bookid: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', unique: true },
  duedate: { type: Date },
  fine: Number
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);
const User = mongoose.model('User', userSchema);
const Borrow = mongoose.model('Borrow', borrowSchema);
const Return = mongoose.model('Return', returnSchema);

module.exports = { Book, User, Borrow, Return };
