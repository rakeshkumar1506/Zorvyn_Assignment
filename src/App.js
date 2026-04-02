import React, { useState } from "react";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  function renderPage() {
    if (activePage === "Dashboard") return <Dashboard />;
    if (activePage === "Transactions") return <Transactions />;
    if (activePage === "Insights") return <Insights />;
  }

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar activePage={activePage} setActivePage={setActivePage} />
        <main className="max-w-6xl mx-auto px-4 py-6">
          {renderPage()}
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
