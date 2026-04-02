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

  // Filter
  let filtered = transactions.filter((tx) => {
    const matchSearch = tx.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "All" || tx.category === filterCategory;
    const matchType = filterType === "all" || tx.type === filterType;
    return matchSearch && matchCategory && matchType;
  });

  // Sort
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "date-desc") return new Date(b.date) - new Date(a.date);
    if (sortBy === "date-asc") return new Date(a.date) - new Date(b.date);
    if (sortBy === "amount-desc") return b.amount - a.amount;
    if (sortBy === "amount-asc") return a.amount - b.amount;
    return 0;
  });

  function handleSave(tx) {
    if (editingTx) {
      editTransaction(tx);
    } else {
      addTransaction(tx);
    }
    setShowModal(false);
    setEditingTx(null);
  }

  function handleEdit(tx) {
    setEditingTx(tx);
    setShowModal(true);
  }

  function handleDelete(id) {
    if (window.confirm("Delete this transaction?")) {
      deleteTransaction(id);
    }
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-800">Transactions</h2>
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
      <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[140px]"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-12">No transactions found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Description</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Type</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Amount</th>
                  {role === "admin" && (
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-500">{tx.date}</td>
                    <td className="px-4 py-3 font-medium text-gray-700">{tx.description}</td>
                    <td className="px-4 py-3">
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        tx.type === "income"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-right font-semibold ${
                      tx.type === "income" ? "text-green-600" : "text-red-500"
                    }`}>
                      {tx.type === "income" ? "+" : "-"}${tx.amount.toLocaleString()}
                    </td>
                    {role === "admin" && (
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleEdit(tx)}
                          className="text-blue-500 hover:text-blue-700 text-xs mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="text-red-400 hover:text-red-600 text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Count */}
      <p className="text-xs text-gray-400 text-right">{filtered.length} transaction(s)</p>

      {/* Modal */}
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
