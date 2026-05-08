const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();

app.use(cors());
app.use(express.json());

// === KATEGORIE ===

app.get('/api/categories', (req, res) => {
  try {
    const categories = db.prepare('SELECT * FROM categories ORDER BY name ASC').all();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/categories', (req, res) => {
  try {
    const { name, color } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Nazwa kategorii jest wymagana' });
    }
    const result = db.prepare(
      'INSERT INTO categories (name, color) VALUES (?, ?)'
    ).run(name.trim().toLowerCase(), color || 'bg-secondary');
    const newCategory = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newCategory);
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Kategoria o tej nazwie już istnieje' });
    }
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/categories/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Kategoria nie znaleziona' });
    }
    res.json({ message: 'Kategoria usunięta', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === WYDATKI ===

app.get('/api/expenses', (req, res) => {
  try {
    const expenses = db.prepare('SELECT * FROM expenses ORDER BY date DESC').all();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/expenses/:id', (req, res) => {
  try {
    const expense = db.prepare('SELECT * FROM expenses WHERE id = ?').get(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'Wydatek nie znaleziony' });
    }
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/expenses', (req, res) => {
  try {
    const { category, amount, description, date } = req.body;
    if (!category || !amount || !date) {
      return res.status(400).json({ error: 'Pola category, amount i date są wymagane' });
    }
    const result = db.prepare(
      'INSERT INTO expenses (category, amount, description, date) VALUES (?, ?, ?, ?)'
    ).run(category, amount, description || '', date);
    const newExpense = db.prepare('SELECT * FROM expenses WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/expenses/:id', (req, res) => {
  try {
    const { category, amount, description, date } = req.body;
    const id = req.params.id;
    const existing = db.prepare('SELECT * FROM expenses WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Wydatek nie znaleziony' });
    }
    db.prepare(
      'UPDATE expenses SET category = ?, amount = ?, description = ?, date = ? WHERE id = ?'
    ).run(category, amount, description || '', date, id);
    const updated = db.prepare('SELECT * FROM expenses WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/expenses/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM expenses WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Wydatek nie znaleziony' });
    }
    res.json({ message: 'Wydatek usunięty', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;