const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const expensesFilePath = path.join(__dirname, "data", "expenses.json");

app.use(express.json());
app.use(express.static("public"));

// Valid categories in English
const validCategories = [
  "Food",
  "Leisure",
  "Electronics",
  "Services",
  "Clothing",
  "Health",
  "Others",
]; 

/**
 * Validates the request body for expense data.
 *
 *
 * @param {object} req - objeto req de la pétición
 * @param {object} res - objeto req de la pétición
 * @returns {null} Devuelve null si todo ha ido bien
 */
const validateData = (req, res) => {
  if (!req.body.amount || !req.body.description || !req.body.category) {
    return res.status(400).json({ error: "Todos los campo son requeridos" });
  }
  if (typeof req.body.amount !== "number" || req.body.amount <= 0) {
    return res
      .status(400)
      .json({ error: "El gasto debe ser un número positivo" });
  }
  if (
    !req.body.description ||
    typeof req.body.description !== "string" ||
    req.body.description.length === 0 ||
    req.body.description.length > 40
  ) {
    return res.status(400).json({
      error: "La descripción debe tener entre 1 y 40 caracteres.",
    });
  }
  if (!req.body.category || !validCategories.includes(req.body.category)) {
    return res.status(400).json({ error: "Categoría inválida." });
  }
  return null;
}

/**
 * Read the expenses from data/expenses.json file
 *
 * @returns An array with all the expenses as objects
 */
const readExpenses = () => {
  try {
    const data = fs.readFileSync(expensesFilePath, "utf8");
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
  const ids = expenses.map((exp) => exp.id);
  return ids.length ? Math.max(...ids) + 1 : 1;
};

// Iteración 1
app.get("/api/expenses", (req, res) => {
  const expenses = readExpenses();
  res.status(200).json(expenses);
});

// Iteración 1b
app.get("/api/categories", (req, res) => {
  res.status(200).json(validCategories);
});

// Iteración 2
app.post("/api/expenses", (req, res) => {
  const expenses = readExpenses();
  const { description, amount, category } = req.body;
  validateData(req,res);
  const newExpense = {
    id: getNextId(expenses),
    description,
    amount,
    category,
  };
  expenses.push(newExpense);
  expenses.sort((a, b) => a.id - b.id);

  try {
    saveExpenses(expenses);
    res.status(201).json(newExpense); // 201 Nueva entrada
  } catch (err) {
    res.status(500).json({ error: "Error al escribir en el fichero:", err });
  }
});

// Iteración 3
app.put("/api/expenses/:id", (req, res) => {
  const id = req.params.id;
  const { description, amount, category } = req.body;
  const expenses = readExpenses();
  const expenseIndex = expenses.findIndex((e) => +e.id === +id);
  
  if (expenseIndex == -1) {
    return res.status(404).json({ error: "No encontrado." });
  } else {
    expenses[expenseIndex] = {
      ...expenses[expenseIndex],
      description,
      category,
      amount,
    };
    validateData(req,res);
    saveExpenses(expenses);
    res.status(200).json(expenses[expenseIndex]);
  }
});

// Iteración 4
app.delete("/api/expenses/:id", (req, res) => {
  const id = req.params.id;
  const expenses = readExpenses();
  const expenseIndex = expenses.findIndex((e) => +e.id === +id);
  if (expenseIndex == -1) {
    return res.status(404).json({ error: "No encontrado." });
  } else {
    expensesDeletedItem = expenses.filter(e=>+e.id != +id);
    saveExpenses(expensesDeletedItem);
    res.status(200).json({ "success": true });
  }
});

// Iteración 5
app.get("/api/expenses/summary", (req, res) => {
    const expenses = readExpenses();

const sum = expenses.reduce((summary, e) => {
  return summary + e.amount;
}, 0);
    res.status(200).json({total: sum});
});

app.use((req, res)=>{
    res.status(404).json({ "error": "Not found" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
