import React from "react";
import { useApp } from "../context/AppContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function Insights() {
  const { transactions } = useApp();

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
        <p className="text-gray-400 text-sm">No data to show insights</p>
      </div>
    );
  }

  // Highest spending category
  const categoryTotals = {};
  transactions
    .filter((tx) => tx.type === "expense")
    .forEach((tx) => {
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
    });

  const categoryEntries = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const topCategory = categoryEntries[0];

  // Monthly income vs expense comparison
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

  // Total income and expenses
  const totalIncome = transactions.filter((tx) => tx.type === "income").reduce((s, tx) => s + tx.amount, 0);
  const totalExpenses = transactions.filter((tx) => tx.type === "expense").reduce((s, tx) => s + tx.amount, 0);
  const savingsRate = totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) : 0;

  // Most recent month savings
  const lastMonth = monthlyData[monthlyData.length - 1];

  return (
    <div className="flex flex-col gap-4">

      <h2 className="text-base font-semibold text-gray-800">Insights</h2>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Top Spending Category</p>
          <p className="text-xl font-bold text-gray-800">{topCategory ? topCategory[0] : "—"}</p>
          <p className="text-sm text-red-500 mt-1">
            ${topCategory ? topCategory[1].toLocaleString() : 0} spent
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Overall Savings Rate</p>
          <p className="text-xl font-bold text-gray-800">{savingsRate}%</p>
          <p className="text-sm text-gray-400 mt-1">of total income saved</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 mb-1">Last Month Saved</p>
          <p className={`text-xl font-bold ${lastMonth && lastMonth.Saved >= 0 ? "text-green-600" : "text-red-500"}`}>
            ${lastMonth ? lastMonth.Saved.toLocaleString() : 0}
          </p>
          <p className="text-sm text-gray-400 mt-1">{lastMonth ? lastMonth.month : "—"}</p>
        </div>

      </div>

      {/* Monthly Comparison Bar Chart */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Monthly Income vs Expenses</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthlyData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(val) => `$${val.toLocaleString()}`} />
            <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Spending Breakdown</h3>
        {categoryEntries.length === 0 ? (
          <p className="text-gray-400 text-sm">No expense data</p>
        ) : (
          <div className="flex flex-col gap-3">
            {categoryEntries.map(([cat, amount]) => {
              const percent = ((amount / totalExpenses) * 100).toFixed(1);
              return (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{cat}</span>
                    <span className="text-gray-500">${amount.toLocaleString()} ({percent}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
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
