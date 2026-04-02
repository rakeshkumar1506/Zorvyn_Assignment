import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { useApp } from "../context/AppContext";

const PIE_COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6"];

function Charts() {
  const { transactions, darkMode } = useApp();

  const monthlyMap = {};
  transactions.forEach((tx) => {
    const month = tx.date.slice(0, 7);
    if (!monthlyMap[month]) monthlyMap[month] = { income: 0, expenses: 0 };
    if (tx.type === "income") monthlyMap[month].income += tx.amount;
    else monthlyMap[month].expenses += tx.amount;
  });

  const lineData = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month: new Date(month + "-01").toLocaleString("default", { month: "short", year: "2-digit" }),
      Income: data.income,
      Expenses: data.expenses,
      Balance: data.income - data.expenses,
    }));

  const categoryMap = {};
  transactions
    .filter((tx) => tx.type === "expense")
    .forEach((tx) => {
      categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
    });

  const pieData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  const axisColor = darkMode ? "#9ca3af" : "#6b7280";
  const gridColor = darkMode ? "#374151" : "#f0f0f0";
  const tooltipStyle = darkMode
    ? { backgroundColor: "#1f2937", border: "1px solid #374151", color: "#f9fafb" }
    : { backgroundColor: "#fff", border: "1px solid #e5e7eb", color: "#111827" };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

      {/* Line Chart */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-5 border border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Monthly Balance Trend</h3>
        {lineData.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-10">No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineData} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: axisColor }} />
              <YAxis tick={{ fontSize: 11, fill: axisColor }} width={55} />
              <Tooltip
                formatter={(val) => `₹${val.toLocaleString()}`}
                contentStyle={tooltipStyle}
              />
              <Line type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Expenses" stroke="#ef4444" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Balance" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Legend wrapperStyle={{ fontSize: "12px", color: axisColor }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Pie Chart */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-5 border border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Spending by Category</h3>
        {pieData.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-10">No expense data</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="45%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val) => `₹${val.toLocaleString()}`}
                contentStyle={tooltipStyle}
              />
              <Legend wrapperStyle={{ fontSize: "11px", color: axisColor }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
}

export default Charts;
