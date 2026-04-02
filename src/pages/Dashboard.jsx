import React from "react";
import { useApp } from "../context/AppContext";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const PIE_COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

function Dashboard() {
  const { transactions, darkMode } = useApp();

  const totalIncome = transactions.filter((tx) => tx.type === "income").reduce((s, tx) => s + tx.amount, 0);
  const totalExpenses = transactions.filter((tx) => tx.type === "expense").reduce((s, tx) => s + tx.amount, 0);
  const balance = totalIncome - totalExpenses;

  const summaryCards = [
    { label: "Total Balance", value: balance, color: balance >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-500", bg: "bg-blue-50 dark:bg-blue-950", icon: "💰" },
    { label: "Total Income", value: totalIncome, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950", icon: "📈" },
    { label: "Total Expenses", value: totalExpenses, color: "text-red-500 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950", icon: "📉" },
    { label: "Transactions", value: transactions.length, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950", icon: "🧾", isCount: true },
  ];

  // Monthly data for area + bar chart
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
    }));

  // Pie chart data
  const categoryMap = {};
  transactions.filter((tx) => tx.type === "expense").forEach((tx) => {
    categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
  });
  const pieData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  // Recent 5
  const recent = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const axisColor = darkMode ? "#9ca3af" : "#6b7280";
  const gridColor = darkMode ? "#374151" : "#f0f0f0";
  const tooltipStyle = darkMode
    ? { backgroundColor: "#1f2937", border: "1px solid #374151", color: "#f9fafb" }
    : { backgroundColor: "#fff", border: "1px solid #e5e7eb", color: "#111827" };

  return (
    <div className="flex flex-col gap-5">

      <div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Your financial overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className={`${card.bg} rounded-xl p-4 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow cursor-default`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">{card.label}</span>
              <span className="text-lg">{card.icon}</span>
            </div>
            <p className={`text-xl font-bold ${card.color}`}>
              {card.isCount ? card.value : `₹${card.value.toLocaleString()}`}
            </p>
          </div>
        ))}
      </div>

      {/* Area Chart + Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-5 border border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Income vs Expenses Trend</h3>
          {monthlyData.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-10">No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyData} margin={{ left: -10, right: 10 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: axisColor }} />
                <YAxis tick={{ fontSize: 11, fill: axisColor }} width={55} />
                <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: "12px", color: axisColor }} />
                <Area type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2} fill="url(#incomeGrad)" />
                <Area type="monotone" dataKey="Expenses" stroke="#ef4444" strokeWidth={2} fill="url(#expenseGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-5 border border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Spending by Category</h3>
          {pieData.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-10">No expense data</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="45%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: "11px", color: axisColor }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>

      {/* Bar Chart */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-5 border border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Monthly Comparison</h3>
        {monthlyData.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-10">No data</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
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
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Recent Transactions</h3>
        {recent.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">No transactions yet</p>
        ) : (
          <div className="flex flex-col gap-1">
            {recent.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-gray-800 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                    tx.type === "income" ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400" : "bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400"
                  }`}>
                    {tx.type === "income" ? "↑" : "↓"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{tx.description}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{tx.category} · {tx.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${tx.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                  {tx.type === "income" ? "+" : "-"}₹{tx.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default Dashboard;
