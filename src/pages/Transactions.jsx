import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import TransactionModal from "../components/TransactionModal";

const CATEGORIES = ["All", "Income", "Housing", "Food", "Entertainment", "Utilities", "Health", "Shopping", "Transport"];

function Transactions() {
  const { transactions, role, addTransaction, editTransaction, deleteTransaction } = useApp();

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showModal, setShowModal] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  let filtered = transactions.filter((tx) => {
    const matchSearch = tx.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "All" || tx.category === filterCategory;
    const matchType = filterType === "all" || tx.type === filterType;
    return matchSearch && matchCategory && matchType;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "date-desc") return new Date(b.date) - new Date(a.date);
    if (sortBy === "date-asc") return new Date(a.date) - new Date(b.date);
    if (sortBy === "amount-desc") return b.amount - a.amount;
    if (sortBy === "amount-asc") return a.amount - b.amount;
    return 0;
  });

  function handleSave(tx) {
    if (editingTx) editTransaction(tx);
    else addTransaction(tx);
    setShowModal(false);
    setEditingTx(null);
  }

  function handleEdit(tx) {
    setEditingTx(tx);
    setShowModal(true);
  }

  function handleDelete(id) {
    if (window.confirm("Delete this transaction?")) deleteTransaction(id);
  }

  const inputClass = "border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white">Transactions</h2>
        {role === "admin" && (
          <button
            onClick={() => { setEditingTx(null); setShowModal(true); }}
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 flex flex-col sm:flex-row flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClass} w-full sm:flex-1 sm:min-w-[140px]`}
        />
        <div className="flex gap-2 flex-wrap">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={`${inputClass} flex-1 sm:flex-none`}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className={`${inputClass} flex-1 sm:flex-none`}>
            {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={`${inputClass} flex-1 sm:flex-none`}>
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-12">No transactions found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Description</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Type</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Amount</th>
                  {role === "admin" && (
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{tx.date}</td>
                    <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-200">{tx.description}</td>
                    <td className="px-4 py-3">
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        tx.type === "income"
                          ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                          : "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300"
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${
                      tx.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"
                    }`}>
                      {tx.type === "income" ? "+" : "-"}₹{tx.amount.toLocaleString()}
                    </td>
                    {role === "admin" && (
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => handleEdit(tx)} className="text-blue-500 hover:text-blue-700 text-xs mr-3">Edit</button>
                        <button onClick={() => handleDelete(tx.id)} className="text-red-400 hover:text-red-600 text-xs">Delete</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile Card List */}
      <div className="sm:hidden flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-8 text-center">
            <p className="text-gray-400 text-sm">No transactions found</p>
          </div>
        ) : (
          filtered.map((tx) => (
            <div key={tx.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                    tx.type === "income"
                      ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400"
                  }`}>
                    {tx.type === "income" ? "↑" : "↓"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{tx.description}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{tx.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${
                  tx.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"
                }`}>
                  {tx.type === "income" ? "+" : "-"}₹{tx.amount.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-2">
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">{tx.category}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    tx.type === "income"
                      ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                      : "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300"
                  }`}>
                    {tx.type}
                  </span>
                </div>
                {role === "admin" && (
                  <div className="flex gap-3">
                    <button onClick={() => handleEdit(tx)} className="text-blue-500 text-xs">Edit</button>
                    <button onClick={() => handleDelete(tx.id)} className="text-red-400 text-xs">Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 text-right">{filtered.length} transaction(s)</p>

      {showModal && (
        <TransactionModal
          existing={editingTx}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingTx(null); }}
        />
      )}

    </div>
  );
}

export default Transactions;
