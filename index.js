const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const expensesFilePath = path.join(__dirname, 'data', 'expenses.json');

app.use(express.json());
app.use(express.static('public'));

// Valid categories in English
const validCategories = ['Food', 'Leisure', 'Electronics', 'Services', 'Clothing', 'Health', 'Others'];

/**
 * Read the expenses from data/expenses.json file
 * 
 * @returns An array with all the expenses as objects
 */
const readExpenses = () => {
  try {
    const data = fs.readFileSync(expensesFilePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

/**
 * Store the expenses in a JSON file
 * 
 * @param {array} expenses Array of objects with the expenses to store
 */
const saveExpenses = (expenses) => {
  fs.writeFileSync(expensesFilePath, JSON.stringify(expenses, null, 2));
};

// Get the next valid ID
const getNextId = (expenses) => {
  const ids = expenses.map(exp => exp.id);
  return ids.length ? Math.max(...ids) + 1 : 1;
};


// Iteración 1
app.get('/api/expenses', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

// Iteración 1b
app.get('/api/categories', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});


// Iteración 2
app.post('/api/expenses', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

// Iteración 3
app.put('/api/expenses/:id', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

// Iteración 4
app.delete('/api/expenses/:id', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

// Iteración 5
app.get('/api/expenses/summary', (req, res) => {
  res.status(501).json({ error: 'Not implemented' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
