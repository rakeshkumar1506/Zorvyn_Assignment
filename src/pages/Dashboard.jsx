import React from "react";
import SummaryCards from "../components/SummaryCards";
import Charts from "../components/Charts";
import { useApp } from "../context/AppContext";

function Dashboard() {
  const { transactions } = useApp();

  // Recent 5 transactions
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-5">

      <SummaryCards />
      <Charts />

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Transactions</h3>

        {recent.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">No transactions yet</p>
        ) : (
          <div className="flex flex-col gap-2">
            {recent.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                    tx.type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"
                  }`}>
                    {tx.type === "income" ? "↑" : "↓"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{tx.description}</p>
                    <p className="text-xs text-gray-400">{tx.category} · {tx.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${
                  tx.type === "income" ? "text-green-600" : "text-red-500"
                }`}>
                  {tx.type === "income" ? "+" : "-"}${tx.amount.toLocaleString()}
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
