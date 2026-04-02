import React from "react";
import { useApp } from "../context/AppContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from "recharts";

function Insights() {
  const { transactions, darkMode } = useApp();

  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-10 text-center">
        <p className="text-gray-400 text-sm">No data to show insights</p>
      </div>
    );
  }

  const totalIncome = transactions.filter((tx) => tx.type === "income").reduce((s, tx) => s + tx.amount, 0);
  const totalExpenses = transactions.filter((tx) => tx.type === "expense").reduce((s, tx) => s + tx.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  // Category totals
  const categoryTotals = {};
  transactions.filter((tx) => tx.type === "expense").forEach((tx) => {
    categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
  });
  const categoryEntries = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const topCategory = categoryEntries[0];

  // Monthly data
  const monthlyMap = {};
  transactions.forEach((tx) => {
    const month = tx.date.slice(0, 7);
    if (!monthlyMap[month]) monthlyMap[month] = { income: 0, expenses: 0 };
    if (tx.type === "income") monthlyMap[month].income += tx.amount;
    else monthlyMap[month].expenses += tx.amount;
  });

  const monthlyData = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month: new Date(month + "-01").toLocaleString("default", { month: "short", year: "2-digit" }),
      Income: data.income,
      Expenses: data.expenses,
      Saved: data.income - data.expenses,
    }));

  const bestSavingsMonth = [...monthlyData].sort((a, b) => b.Saved - a.Saved)[0];
  const highestExpenseMonth = [...monthlyData].sort((a, b) => b.Expenses - a.Expenses)[0];
  const avgMonthlyExpense = monthlyData.length > 0
    ? Math.round(monthlyData.reduce((s, m) => s + m.Expenses, 0) / monthlyData.length)
    : 0;

  // Month-over-month comparison (last 2 months)
  const lastTwo = monthlyData.slice(-2);
  const momChange = lastTwo.length === 2
    ? (((lastTwo[1].Expenses - lastTwo[0].Expenses) / lastTwo[0].Expenses) * 100).toFixed(1)
    : null;

  const axisColor = darkMode ? "#9ca3af" : "#6b7280";
  const gridColor = darkMode ? "#374151" : "#f0f0f0";
  const tooltipStyle = darkMode
    ? { backgroundColor: "#1f2937", border: "1px solid #374151", color: "#f9fafb" }
    : { backgroundColor: "#fff", border: "1px solid #e5e7eb", color: "#111827" };

  const cardClass = "bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5";

  return (
    <div className="flex flex-col gap-5">

      <div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Insights</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Understand your spending patterns</p>
      </div>

      {/* Top stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className={cardClass}>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Top Spending Category</p>
          <p className="text-lg font-bold text-gray-800 dark:text-white">{topCategory ? topCategory[0] : "—"}</p>
          <p className="text-sm text-red-500 dark:text-red-400 mt-1">₹{topCategory ? topCategory[1].toLocaleString() : 0} spent</p>
        </div>

        <div className={cardClass}>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Best Savings Month</p>
          <p className="text-lg font-bold text-gray-800 dark:text-white">{bestSavingsMonth ? bestSavingsMonth.month : "—"}</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">₹{bestSavingsMonth ? bestSavingsMonth.Saved.toLocaleString() : 0} saved</p>
        </div>

        <div className={cardClass}>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Highest Expense Month</p>
          <p className="text-lg font-bold text-gray-800 dark:text-white">{highestExpenseMonth ? highestExpenseMonth.month : "—"}</p>
          <p className="text-sm text-red-500 dark:text-red-400 mt-1">₹{highestExpenseMonth ? highestExpenseMonth.Expenses.toLocaleString() : 0} spent</p>
        </div>

        <div className={cardClass}>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg Monthly Expense</p>
          <p className="text-lg font-bold text-gray-800 dark:text-white">₹{avgMonthlyExpense.toLocaleString()}</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">per month</p>
        </div>

      </div>

      {/* Savings Rate */}
      <div className={cardClass}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Overall Savings Rate</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">How much of your income you're saving</p>
          </div>
          <span className={`text-2xl font-bold ${savingsRate >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
            {savingsRate.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${savingsRate >= 0 ? "bg-green-500" : "bg-red-500"}`}
            style={{ width: `${Math.min(Math.abs(savingsRate), 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Month-over-Month comparison */}
      {momChange !== null && (
        <div className={cardClass}>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Month-over-Month Expenses</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
            {lastTwo[1].month} vs {lastTwo[0].month}
          </p>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">{lastTwo[0].month}</p>
              <p className="text-lg font-bold text-gray-800 dark:text-white">₹{lastTwo[0].Expenses.toLocaleString()}</p>
            </div>
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
              parseFloat(momChange) <= 0
                ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                : "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300"
            }`}>
              {parseFloat(momChange) <= 0 ? "↓" : "↑"} {Math.abs(momChange)}%
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">{lastTwo[1].month}</p>
              <p className="text-lg font-bold text-gray-800 dark:text-white">₹{lastTwo[1].Expenses.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Income vs Expenses Bar Chart */}
      <div className={`${cardClass}`}>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Monthly Income vs Expenses</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData} barGap={4} margin={{ left: -10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: axisColor }} />
            <YAxis tick={{ fontSize: 11, fill: axisColor }} width={55} />
            <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: "12px", color: axisColor }} />
            <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Savings trend line chart */}
      <div className={cardClass}>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Monthly Savings Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthlyData} margin={{ left: -10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: axisColor }} />
            <YAxis tick={{ fontSize: 11, fill: axisColor }} width={55} />
            <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="Saved" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: "#3b82f6" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown */}
      <div className={cardClass}>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Spending Breakdown</h3>
        {categoryEntries.length === 0 ? (
          <p className="text-gray-400 text-sm">No expense data</p>
        ) : (
          <div className="flex flex-col gap-3">
            {categoryEntries.map(([cat, amount]) => {
              const percent = ((amount / totalExpenses) * 100).toFixed(1);
              return (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-300">{cat}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">₹{amount.toLocaleString()} ({percent}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

export default Insights;
