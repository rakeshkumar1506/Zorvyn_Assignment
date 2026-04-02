import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

const defaultTransactions = [
  { id: 1, date: "2025-04-01", description: "Salary", amount: 5000, category: "Income", type: "income" },
  { id: 2, date: "2025-04-03", description: "Rent", amount: 1200, category: "Housing", type: "expense" },
  { id: 3, date: "2025-04-08", description: "Groceries", amount: 160, category: "Food", type: "expense" },
  { id: 4, date: "2025-04-12", description: "Netflix", amount: 80, category: "Entertainment", type: "expense" },
  { id: 5, date: "2025-04-18", description: "Freelance", amount: 1000, category: "Income", type: "income" },
  { id: 6, date: "2025-04-25", description: "Gym", amount: 70, category: "Health", type: "expense" },
  { id: 7, date: "2025-05-01", description: "Salary", amount: 5000, category: "Income", type: "income" },
  { id: 8, date: "2025-05-02", description: "Rent", amount: 1200, category: "Housing", type: "expense" },
  { id: 9, date: "2025-05-05", description: "Groceries", amount: 180, category: "Food", type: "expense" },
  { id: 10, date: "2025-05-10", description: "Freelance", amount: 600, category: "Income", type: "income" },
  { id: 11, date: "2025-05-15", description: "Shopping", amount: 200, category: "Shopping", type: "expense" },
  { id: 12, date: "2025-05-20", description: "Electricity", amount: 130, category: "Utilities", type: "expense" },
  { id: 13, date: "2025-06-01", description: "Salary", amount: 5000, category: "Income", type: "income" },
  { id: 14, date: "2025-06-02", description: "Rent", amount: 1200, category: "Housing", type: "expense" },
  { id: 15, date: "2025-06-03", description: "Groceries", amount: 150, category: "Food", type: "expense" },
  { id: 16, date: "2025-06-05", description: "Netflix", amount: 15, category: "Entertainment", type: "expense" },
  { id: 17, date: "2025-06-07", description: "Freelance", amount: 800, category: "Income", type: "income" },
  { id: 18, date: "2025-06-08", description: "Electricity", amount: 90, category: "Utilities", type: "expense" },
  { id: 19, date: "2025-06-10", description: "Restaurant", amount: 60, category: "Food", type: "expense" },
  { id: 20, date: "2025-06-12", description: "Gym", amount: 40, category: "Health", type: "expense" },
  { id: 21, date: "2025-06-14", description: "Amazon", amount: 120, category: "Shopping", type: "expense" },
  { id: 22, date: "2025-06-15", description: "Dividends", amount: 200, category: "Income", type: "income" },
  { id: 23, date: "2025-06-17", description: "Uber", amount: 25, category: "Transport", type: "expense" },
  { id: 24, date: "2025-06-20", description: "Internet", amount: 50, category: "Utilities", type: "expense" },
  { id: 25, date: "2025-06-25", description: "Bonus", amount: 500, category: "Income", type: "income" },
];

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : defaultTransactions;
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem("role") || "viewer";
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("role", role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  function addTransaction(tx) {
    const newTx = { ...tx, id: Date.now() };
    setTransactions((prev) => [newTx, ...prev]);
  }

  function editTransaction(updated) {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === updated.id ? updated : tx))
    );
  }

  function deleteTransaction(id) {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  }

  return (
    <AppContext.Provider
      value={{ transactions, role, setRole, darkMode, setDarkMode, addTransaction, editTransaction, deleteTransaction }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
