import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { BankProvider } from './context/BankContext';
import Dashboard    from './pages/Dashboard';
import CustomersPage from './pages/CustomersPage';
import AccountsPage  from './pages/AccountsPage';
import TransactionsPage from './pages/TransactionsPage';
import './App.css';

function Navbar() {
  const links = [
    { to: '/',             label: '🏠 Dashboard'    },
    { to: '/customers',    label: '👤 Customers'     },
    { to: '/accounts',     label: '🏦 Accounts'      },
    { to: '/transactions', label: '💳 Transactions'  },
  ];
  return (
    <nav className="navbar">
      <div className="brand">🏛️ BankApp</div>
      <div className="nav-links">
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end className={({ isActive }) => isActive ? 'active' : ''}>
            {l.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BankProvider>
      <BrowserRouter>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/"             element={<Dashboard />} />
            <Route path="/customers"    element={<CustomersPage />} />
            <Route path="/accounts"     element={<AccountsPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </BankProvider>
  );
}
