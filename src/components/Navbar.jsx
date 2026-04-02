import React, { useState } from "react";
import { useApp } from "../context/AppContext";

function Navbar({ activePage, setActivePage }) {
  const { role, setRole, darkMode, setDarkMode } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const tabs = ["Dashboard", "Transactions", "Insights"];

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="max-w-6xl mx-auto">

        {/* Top row */}
        <div className="flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">F</span>
            </div>
            <span className="text-lg font-semibold text-gray-800 dark:text-white">FinanceApp</span>
          </div>

          {/* Desktop: tabs + role + theme toggle */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActivePage(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activePage === tab
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Role:</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="viewer">Viewer</option>
                <option value="admin">Admin</option>
              </select>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                role === "admin" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              }`}>
                {role === "admin" ? "Admin" : "Viewer"}
              </span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 1.78a1 1 0 011.42 1.42l-.71.7a1 1 0 11-1.41-1.41l.7-.71zM18 9a1 1 0 110 2h-1a1 1 0 110-2h1zM4.22 15.78a1 1 0 001.42-1.42l-.71-.7a1 1 0 00-1.41 1.41l.7.71zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-5.78-.22a1 1 0 001.42 1.42l.7-.71a1 1 0 00-1.41-1.41l-.71.7zM4 10a1 1 0 110-2H3a1 1 0 100 2h1zm11.78 4.22a1 1 0 00-1.42 1.42l.71.7a1 1 0 001.41-1.41l-.7-.71zM10 6a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {darkMode ? (
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 1.78a1 1 0 011.42 1.42l-.71.7a1 1 0 11-1.41-1.41l.7-.71zM18 9a1 1 0 110 2h-1a1 1 0 110-2h1zM4.22 15.78a1 1 0 001.42-1.42l-.71-.7a1 1 0 00-1.41 1.41l.7.71zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-5.78-.22a1 1 0 001.42 1.42l.7-.71a1 1 0 00-1.41-1.41l-.71.7zM4 10a1 1 0 110-2H3a1 1 0 100 2h1zm11.78 4.22a1 1 0 00-1.42 1.42l.71.7a1 1 0 001.41-1.41l-.7-.71zM10 6a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            <button
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 p-1"
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
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden mt-3 flex flex-col gap-2 pb-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActivePage(tab); setMenuOpen(false); }}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activePage === tab
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {tab}
              </button>
            ))}

            <div className="flex items-center gap-2 px-1 pt-1 border-t border-gray-100 dark:border-gray-700 mt-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">Role:</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="viewer">Viewer</option>
                <option value="admin">Admin</option>
              </select>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                role === "admin" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
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
