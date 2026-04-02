import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import TransactionModal from "../components/TransactionModal";

const CATEGORIES = ["All", "Income", "Housing", "Food", "Entertainment", "Utilities", "Health", "Shopping", "Transport"];
const PAGE_SIZE = 10;

function Transactions() {
  const { transactions, role, addTransaction, editTransaction, deleteTransaction } = useApp();

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showModal, setShowModal] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [page, setPage] = useState(1);

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

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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

  function handleFilterChange(setter) {
    return (e) => { setter(e.target.value); setPage(1); };
  }

  function exportCSV() {
    const headers = ["Date", "Description", "Category", "Type", "Amount"];
    const rows = filtered.map((tx) => [tx.date, tx.description, tx.category, tx.type, tx.amount]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const inputClass = "border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Transactions</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{filtered.length} records found</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            CSV
          </button>
          {role === "admin" && (
            <button
              onClick={() => { setEditingTx(null); setShowModal(true); }}
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 flex flex-col sm:flex-row flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={handleFilterChange(setSearch)}
          className={`${inputClass} w-full sm:flex-1 sm:min-w-[160px]`}
        />
        <div className="flex gap-2 flex-wrap">
          <select value={filterType} onChange={handleFilterChange(setFilterType)} className={inputClass}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select value={filterCategory} onChange={handleFilterChange(setFilterCategory)} className={inputClass}>
            {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select value={sortBy} onChange={handleFilterChange(setSortBy)} className={inputClass}>
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        {paginated.length === 0 ? (
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
                {paginated.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{tx.date}</td>
                    <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-200">{tx.description}</td>
                    <td className="px-4 py-3">
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">{tx.category}</span>
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
                    <td className={`px-4 py-3 text-right font-semibold ${tx.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
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

      {/* Mobile Cards */}
      <div className="sm:hidden flex flex-col gap-3">
        {paginated.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-8 text-center">
            <p className="text-gray-400 text-sm">No transactions found</p>
          </div>
        ) : (
          paginated.map((tx) => (
            <div key={tx.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                    tx.type === "income" ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400" : "bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400"
                  }`}>
                    {tx.type === "income" ? "↑" : "↓"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{tx.description}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{tx.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${tx.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                  {tx.type === "income" ? "+" : "-"}₹{tx.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-2">
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">{tx.category}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    tx.type === "income" ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" : "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300"
                  }`}>{tx.type}</span>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                  page === p
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

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
