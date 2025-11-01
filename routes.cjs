const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Book, User, Borrow, Return } = require('./models.cjs');
const router = express.Router();

const JWT_SECRET = process.env.LIB_JWT_SECRET || 'library_secret_key';

router.post('/register', async (req, res) => {
  try {
    let users = req.body;
    if (!Array.isArray(users)) users = [users];
    const hashed = await Promise.all(users.map(async u => {
      const h = await bcrypt.hash(u.password, 10);
      return { ...u, password: h };
    }));
    await User.insertMany(hashed);
    res.status(201).json({ message: `${hashed.length} users registered` });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, admin: user.admin }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create book
router.post('/books', async (req, res) => {
  try {
    const books = Array.isArray(req.body) ? req.body : [req.body];
    const created = await Book.insertMany(books);
    res.status(201).json({ message: `${created.length} books created`, created });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get books
router.get('/books', async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// Get users
router.get('/users', async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// Borrow a book
router.post('/borrow', async (req, res) => {
  try {
    const { username, bookid } = req.body;
    const book = await Book.findById(bookid);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (!book.available) return res.status(400).json({ message: 'Book not available' });
    book.available = false;
    await book.save();
    const borrow = await Borrow.create({ username, bookid });
    res.status(201).json({ message: 'Book borrowed', borrow });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get borrows
router.get('/borrow', async (req, res) => {
  const list = await Borrow.find().populate('bookid', 'name author');
  res.json(list);
});

// Return book
router.post('/return', async (req, res) => {
  try {
    const { username, bookid } = req.body;
    const borrow = await Borrow.findOne({ username, bookid });
    if (!borrow) return res.status(404).json({ message: 'Borrow record not found' });
    const today = new Date();
    const lateDays = Math.max(0, Math.ceil((today - borrow.duedate)/(1000*60*60*24)));
    const fine = lateDays * 10;
    const returned = await Return.create({ username, bookid, duedate: borrow.duedate, fine });
  
    const book = await Book.findById(bookid);
    if (book) { book.available = true; await book.save(); }
    res.status(201).json({ message: 'Book returned', returned, fine });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get returns
router.get('/return', async (req, res) => {
  const list = await Return.find().populate('bookid', 'name author');
  res.json(list);
});

// Update book
router.put('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Book.findByIdAndUpdate(id, req.body, { runValidators: true });
    res.json({ message: 'Book updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
