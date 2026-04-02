# Finance Dashboard

A clean, interactive finance dashboard built with React + Tailwind CSS.

## Tech Stack

- **React 18** (Create React App) — component-based UI
- **Tailwind CSS** — utility-first styling
- **Recharts** — Line, Bar, and Pie charts
- **Context API** — global state management
- **localStorage** — data persistence across sessions

## Features

### Dashboard Overview
- Summary cards: Total Balance, Income, Expenses
- Line chart: Income vs Expenses trend (monthly)
- Pie chart: Spending by category
- Recent transactions list

### Transactions
- Full transaction list with date, description, category, type, amount
- Search by description
- Filter by type (income / expense) and category
- Sort by date or amount (asc / desc)

### Role-Based UI
- **Viewer** — read-only access, no add / edit / delete
- **Admin** — can add, edit, and delete transactions
- Switch roles via the dropdown in the navbar

### Insights
- Top spending category
- Overall savings rate
- Last month savings
- Monthly income vs expenses bar chart
- Full category breakdown with visual progress bars

### UX
- Responsive layout — table on desktop, cards on mobile
- Hamburger menu on mobile
- Empty state handling for no data / no filter results
- All data persisted in localStorage

## Getting Started

```bash
cd finance-dashboard
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── context/
│   └── AppContext.js         # Global state (transactions, role) + localStorage sync
├── data/
│   └── transactions.js       # Default mock transactions
├── components/
│   ├── Navbar.jsx            # Top nav with tab navigation + role switcher
│   ├── SummaryCards.jsx      # Balance, Income, Expenses cards
│   ├── Charts.jsx            # Line chart + Pie chart
│   └── TransactionModal.jsx  # Add / edit transaction modal (admin only)
├── pages/
│   ├── Dashboard.jsx         # Overview page
│   ├── Transactions.jsx      # Full transaction list with filters
│   └── Insights.jsx          # Spending insights and charts
├── App.js                    # Root component, page routing
├── index.js                  # React entry point
└── index.css                 # Tailwind directives + base styles
```

## Notes

- No backend — all data is mock / static
- Role switching is frontend-only for demonstration purposes
- Transactions added by admin are persisted via localStorage across sessions
