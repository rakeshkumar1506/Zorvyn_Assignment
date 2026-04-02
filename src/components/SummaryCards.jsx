import React from "react";
import { useApp } from "../context/AppContext";

function SummaryCards() {
  const { transactions } = useApp();

  const totalIncome = transactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpenses = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const balance = totalIncome - totalExpenses;

  const cards = [
    {
      label: "Total Balance",
      value: balance,
      color: balance >= 0 ? "text-blue-600" : "text-red-500",
      bg: "bg-blue-50",
      icon: "💰",
    },
    {
      label: "Total Income",
      value: totalIncome,
      color: "text-green-600",
      bg: "bg-green-50",
      icon: "📈",
    },
    {
      label: "Total Expenses",
      value: totalExpenses,
      color: "text-red-500",
      bg: "bg-red-50",
      icon: "📉",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.label} className={`${card.bg} rounded-xl p-5 border border-gray-100`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">{card.label}</span>
            <span className="text-xl">{card.icon}</span>
          </div>
          <p className={`text-2xl font-bold ${card.color}`}>
            ${card.value.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;
