import React, { useState } from "react";
import { useApp } from "../context/AppContext";

function Navbar({ activePage, setActivePage }) {
  const { role, setRole } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const tabs = ["Dashboard", "Transactions", "Insights"];

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-6xl mx-auto">

        {/* Top row: logo + hamburger (mobile) / full nav (desktop) */}
        <div className="flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">F</span>
            </div>
            <span className="text-lg font-semibold text-gray-800">FinanceApp</span>
          </div>

          {/* Desktop: tabs + role */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActivePage(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activePage === tab
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Role:</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="viewer">Viewer</option>
                <option value="admin">Admin</option>
              </select>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                role === "admin" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
              }`}>
                {role === "admin" ? "Admin" : "Viewer"}
              </span>
            </div>
          </div>

          {/* Mobile: hamburger button */}
          <button
            className="md:hidden text-gray-600 hover:text-gray-800 p-1"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden mt-3 flex flex-col gap-2 pb-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActivePage(tab); setMenuOpen(false); }}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activePage === tab
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}

            <div className="flex items-center gap-2 px-1 pt-1 border-t border-gray-100 mt-1">
              <span className="text-sm text-gray-500">Role:</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="viewer">Viewer</option>
                <option value="admin">Admin</option>
              </select>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                role === "admin" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
              }`}>
                {role === "admin" ? "Admin" : "Viewer"}
              </span>
            </div>
          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;
