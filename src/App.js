import React, { useState } from "react";
import { AppProvider } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function renderPage() {
    if (activePage === "Dashboard") return <Dashboard />;
    if (activePage === "Transactions") return <Transactions />;
    if (activePage === "Insights") return <Insights />;
  }

  return (
    <AppProvider>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">

        {/* Sidebar */}
        <Sidebar
          activePage={activePage}
          setActivePage={(page) => { setActivePage(page); setSidebarOpen(false); }}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:overflow-y-auto lg:h-screen">

          {/* Mobile topbar */}
          <header className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">F</span>
              </div>
              <span className="font-semibold text-gray-800 dark:text-white">FinanceApp</span>
            </div>
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 dark:text-gray-300 p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </header>

          <main className="flex-1 p-4 sm:p-6 overflow-auto">
            <div className="max-w-6xl mx-auto animate-fadeIn">
              {renderPage()}
            </div>
          </main>

        </div>
      </div>
    </AppProvider>
  );
}

export default App;
