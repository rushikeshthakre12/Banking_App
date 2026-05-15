import React, { useEffect } from 'react';
import { useBank } from '../context/BankContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Dashboard() {
  const { customers, accounts, transactions, fetchCustomers, fetchAccounts, fetchTransactions } = useBank();

  useEffect(() => {
    fetchCustomers();
    fetchAccounts();
    fetchTransactions();
  }, []);

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const savings  = accounts.filter(a => a.accountType === 'SAVINGS').length;
  const current  = accounts.filter(a => a.accountType === 'CURRENT').length;
  const loans    = accounts.filter(a => a.accountType === 'LOAN').length;

  const chartData = [
    { name: 'Savings',  count: savings,  color: '#276749' },
    { name: 'Current',  count: current,  color: '#2b6cb0' },
    { name: 'Loan',     count: loans,    color: '#c05621' },
  ];

  const recentTx = [...transactions]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 8);

  return (
    <div>
      <div className="page-title">Dashboard</div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="label">Total Customers</div>
          <div className="value">{customers.length}</div>
        </div>
        <div className="stat-card">
          <div className="label">Total Accounts</div>
          <div className="value">{accounts.length}</div>
        </div>
        <div className="stat-card">
          <div className="label">Total Balance</div>
          <div className="value">₹{totalBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
        </div>
        <div className="stat-card">
          <div className="label">Transactions</div>
          <div className="value">{transactions.length}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        <div className="card">
          <div className="card-title">Accounts by Type</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={40}>
              <XAxis dataKey="name" tick={{ fontSize: 13 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {chartData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-title">Account Summary</div>
          <table>
            <tbody>
              {[
                { label: 'Savings Accounts',  value: savings,  cls: 'badge-savings' },
                { label: 'Current Accounts',  value: current,  cls: 'badge-current' },
                { label: 'Loan Accounts',     value: loans,    cls: 'badge-loan'    },
              ].map(r => (
                <tr key={r.label}>
                  <td><span className={`badge ${r.cls}`}>{r.label}</span></td>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>{r.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Recent Transactions</div>
        {recentTx.length === 0 ? (
          <div className="empty-state">No transactions yet.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Account</th><th>Type</th><th>Amount</th><th>Balance After</th><th>Description</th><th>Date</th></tr>
              </thead>
              <tbody>
                {recentTx.map(tx => (
                  <tr key={tx.id}>
                    <td><code>{tx.accountNumber}</code></td>
                    <td><span className={`badge badge-${tx.type.toLowerCase()}`}>{tx.type}</span></td>
                    <td style={{ fontWeight: 600, color: tx.type === 'CREDIT' ? '#276749' : '#c53030' }}>
                      {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                    </td>
                    <td>₹{tx.balanceAfter.toLocaleString('en-IN')}</td>
                    <td>{tx.description}</td>
                    <td>{new Date(tx.timestamp).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
