import React, { useEffect, useState } from 'react';
import { useBank } from '../context/BankContext';

export default function TransactionsPage() {
  const { transactions, accounts, fetchTransactions, fetchAccounts } = useBank();
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchTransactions(); fetchAccounts(); }, []);

  const filtered = transactions
    .filter(t => filter === 'ALL' || t.type === filter)
    .filter(t => t.accountNumber.toLowerCase().includes(search.toLowerCase()) ||
                 (t.description || '').toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const totalCredit = transactions.filter(t => t.type === 'CREDIT').reduce((s, t) => s + t.amount, 0);
  const totalDebit  = transactions.filter(t => t.type === 'DEBIT' ).reduce((s, t) => s + t.amount, 0);

  return (
    <div>
      <div className="page-title">Transactions</div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="label">Total Transactions</div>
          <div className="value">{transactions.length}</div>
        </div>
        <div className="stat-card">
          <div className="label">Total Credits</div>
          <div className="value" style={{ color: '#276749' }}>₹{totalCredit.toLocaleString('en-IN')}</div>
        </div>
        <div className="stat-card">
          <div className="label">Total Debits</div>
          <div className="value" style={{ color: '#c53030' }}>₹{totalDebit.toLocaleString('en-IN')}</div>
        </div>
        <div className="stat-card">
          <div className="label">Net Flow</div>
          <div className="value" style={{ color: totalCredit - totalDebit >= 0 ? '#276749' : '#c53030' }}>
            ₹{(totalCredit - totalDebit).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search by account / description…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, padding: '0.5rem 0.85rem', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: '0.875rem', outline: 'none' }}
          />
          {['ALL', 'CREDIT', 'DEBIT'].map(f => (
            <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">No transactions found.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>#</th><th>Account</th><th>Type</th><th>Amount</th><th>Balance After</th><th>Description</th><th>Date & Time</th></tr>
              </thead>
              <tbody>
                {filtered.map((tx, i) => (
                  <tr key={tx.id}>
                    <td style={{ color: '#a0aec0' }}>{i + 1}</td>
                    <td><code>{tx.accountNumber}</code></td>
                    <td><span className={`badge badge-${tx.type.toLowerCase()}`}>{tx.type}</span></td>
                    <td style={{ fontWeight: 700, color: tx.type === 'CREDIT' ? '#276749' : '#c53030' }}>
                      {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                    </td>
                    <td>₹{tx.balanceAfter.toLocaleString('en-IN')}</td>
                    <td style={{ color: '#718096' }}>{tx.description || '—'}</td>
                    <td style={{ fontSize: '0.8rem', color: '#a0aec0' }}>
                      {new Date(tx.timestamp).toLocaleString('en-IN')}
                    </td>
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
