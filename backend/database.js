const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'expenses.db'));

// Tabela kategorii
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    color TEXT DEFAULT 'bg-secondary',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// Tabela wydatków
db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// Wstaw domyślne kategorie (tylko jeśli tabela jest pusta)
const count = db.prepare('SELECT COUNT(*) as count FROM categories').get();
if (count.count === 0) {
  const defaultCategories = [
    { name: 'jedzenie', color: 'bg-success' },
    { name: 'transport', color: 'bg-info' },
    { name: 'rozrywka', color: 'bg-warning text-dark' },
    { name: 'rachunki', color: 'bg-danger' },
    { name: 'zdrowie', color: 'bg-primary' },
    { name: 'inne', color: 'bg-secondary' }
  ];
  const insert = db.prepare('INSERT INTO categories (name, color) VALUES (?, ?)');
  defaultCategories.forEach(cat => insert.run(cat.name, cat.color));
  console.log('Dodano domyślne kategorie.');
}

console.log('Baza danych gotowa.');

module.exports = db;