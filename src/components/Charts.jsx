import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { useApp } from "../context/AppContext";

const PIE_COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6"];

function Charts() {
  const { transactions } = useApp();

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

      {/* Line Chart */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Monthly Balance Trend</h3>
        {lineData.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-10">No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineData} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={55} />
              <Tooltip formatter={(val) => `$${val.toLocaleString()}`} />
              <Line type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Expenses" stroke="#ef4444" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Balance" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Spending by Category</h3>
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
              <Tooltip formatter={(val) => `$${val.toLocaleString()}`} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
}

export default Charts;
