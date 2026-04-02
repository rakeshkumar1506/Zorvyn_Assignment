import React from "react";
import { useApp } from "../context/AppContext";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: "Transactions",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    label: "Insights",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

function Sidebar({ activePage, setActivePage, sidebarOpen, setSidebarOpen }) {
  const { role, setRole, darkMode, setDarkMode } = useApp();

  return (
    <aside className={`
      fixed lg:sticky lg:top-0 lg:h-screen inset-y-0 left-0 z-30
      w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
      flex flex-col flex-shrink-0
      transform transition-transform duration-200 ease-in-out
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
    `}>

      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">F</span>
          </div>
          <span className="text-base font-semibold text-gray-800 dark:text-white">FinanceApp</span>
        </div>
        <button
          className="lg:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          onClick={() => setSidebarOpen(false)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            onClick={() => setActivePage(item.label)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
              activePage === item.label
                ? "bg-blue-600 text-white"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-white"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom: role + dark mode */}
      <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3">

        {/* Role switcher */}
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">Switch Role</p>
          <div className="flex gap-2">
            {["viewer", "admin"].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                  role === r
                    ? r === "admin"
                      ? "bg-green-600 text-white"
                      : "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <p className="text-xs mt-1.5 text-gray-400 dark:text-gray-500">
            {role === "admin" ? "✏️ Can add, edit, delete" : "👁️ Read only"}
          </p>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </span>
          <div className={`w-9 h-5 rounded-full transition-colors relative ${darkMode ? "bg-blue-600" : "bg-gray-300"}`}>
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${darkMode ? "translate-x-4" : "translate-x-0.5"}`} />
          </div>
        </button>

      </div>
    </aside>
  );
}

export default Sidebar;
