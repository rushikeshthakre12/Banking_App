import React, { useEffect, useState } from 'react';
import { useBank } from '../context/BankContext';
import { accountAPI } from '../services/api';

const EMPTY_ACC = { accountType: 'SAVINGS', customerId: '', initialDeposit: 0, interestRate: 4, minimumBalance: 1000, overdraftLimit: 50000, loanAmount: 0, tenureMonths: 12, loanType: 'PERSONAL' };
const EMPTY_TX  = { amount: '', description: '' };

export default function AccountsPage() {
  const { accounts, customers, fetchAccounts, fetchCustomers, createAccount, doDeposit, doWithdraw, doTransfer, loading, error, setError } = useBank();
  const [modal,   setModal]   = useState(null); // 'create' | 'deposit' | 'withdraw' | 'transfer'
  const [selAcc,  setSelAcc]  = useState(null);
  const [form,    setForm]    = useState(EMPTY_ACC);
  const [txForm,  setTxForm]  = useState(EMPTY_TX);
  const [toAcc,   setToAcc]   = useState('');
  const [success, setSuccess] = useState('');
  const [interest,setInterest]= useState({});

  useEffect(() => { fetchAccounts(); fetchCustomers(); }, []);

  const handle    = e => setForm(f   => ({ ...f,  [e.target.name]: e.target.value }));
  const handleTx  = e => setTxForm(f => ({ ...f,  [e.target.name]: e.target.value }));
  const closeModal = () => { setModal(null); setSelAcc(null); setTxForm(EMPTY_TX); setError(null); };
  const ok = msg => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };

  const submit = async e => {
    e.preventDefault();
    try {
      await createAccount({ ...form, customerId: Number(form.customerId), initialDeposit: Number(form.initialDeposit) });
      ok('Account created!'); closeModal();
    } catch (err) { setError(err.response?.data?.error || err.message); }
  };

  const submitDeposit = async e => {
    e.preventDefault();
    try { await doDeposit(selAcc.accountNumber, Number(txForm.amount), txForm.description); ok('Deposit successful!'); closeModal(); }
    catch (err) { setError(err.response?.data?.error || err.message); }
  };

  const submitWithdraw = async e => {
    e.preventDefault();
    try { await doWithdraw(selAcc.accountNumber, Number(txForm.amount), txForm.description); ok('Withdrawal successful!'); closeModal(); }
    catch (err) { setError(err.response?.data?.error || err.message); }
  };

  const submitTransfer = async e => {
    e.preventDefault();
    try { await doTransfer(selAcc.accountNumber, toAcc, Number(txForm.amount)); ok('Transfer successful!'); closeModal(); }
    catch (err) { setError(err.response?.data?.error || err.message); }
  };

  const loadInterest = async (accNo) => {
    const { data } = await accountAPI.getInterest(accNo);
    setInterest(prev => ({ ...prev, [accNo]: data.interestOrEMI }));
  };

  const typeLabel = t => ({ SAVINGS: 'Savings', CURRENT: 'Current', LOAN: 'Loan' }[t] || t);
  const typeBadge = t => ({ SAVINGS: 'badge-savings', CURRENT: 'badge-current', LOAN: 'badge-loan' }[t] || '');

  return (
    <div>
      <div className="top-bar">
        <div className="page-title" style={{ margin: 0 }}>Accounts</div>
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY_ACC); setModal('create'); }}>+ New Account</button>
      </div>

      {error   && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">{success}</div>}

      <div className="card">
        {accounts.length === 0 ? (
          <div className="empty-state">No accounts yet.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Account No.</th><th>Type</th><th>Balance</th><th>Customer</th><th>Interest / EMI</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {accounts.map(a => (
                  <tr key={a.id}>
                    <td><code style={{ fontWeight: 600 }}>{a.accountNumber}</code></td>
                    <td><span className={`badge ${typeBadge(a.accountType)}`}>{typeLabel(a.accountType)}</span></td>
                    <td style={{ fontWeight: 700, color: a.balance < 0 ? '#c53030' : '#1e3a5f' }}>
                      ₹{a.balance.toLocaleString('en-IN')}
                    </td>
                    <td>{customers.find(c => c.id === a.customer?.id)?.name || '—'}</td>
                    <td>
                      {interest[a.accountNumber] !== undefined
                        ? `₹${interest[a.accountNumber].toLocaleString('en-IN')}`
                        : <button className="btn btn-sm btn-secondary" onClick={() => loadInterest(a.accountNumber)}>Calculate</button>
                      }
                    </td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-sm btn-success" onClick={() => { setSelAcc(a); setModal('deposit'); }}>Deposit</button>
                        {a.accountType !== 'LOAN' && (
                          <button className="btn btn-sm btn-danger" onClick={() => { setSelAcc(a); setModal('withdraw'); }}>Withdraw</button>
                        )}
                        <button className="btn btn-sm btn-secondary" onClick={() => { setSelAcc(a); setModal('transfer'); }}>Transfer</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Account Modal */}
      {modal === 'create' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Open New Account</div>
            <form onSubmit={submit}>
              <div className="form-group">
                <label>Account Type</label>
                <select name="accountType" value={form.accountType} onChange={handle}>
                  <option value="SAVINGS">Savings Account</option>
                  <option value="CURRENT">Current Account</option>
                  <option value="LOAN">Loan Account</option>
                </select>
              </div>
              <div className="form-group">
                <label>Customer</label>
                <select name="customerId" value={form.customerId} onChange={handle} required>
                  <option value="">— Select customer —</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Initial Deposit (₹)</label>
                <input type="number" name="initialDeposit" value={form.initialDeposit} onChange={handle} min="0" />
              </div>
              {form.accountType === 'SAVINGS' && <>
                <div className="form-group"><label>Interest Rate (%)</label><input type="number" name="interestRate" value={form.interestRate} onChange={handle} step="0.1" /></div>
                <div className="form-group"><label>Minimum Balance (₹)</label><input type="number" name="minimumBalance" value={form.minimumBalance} onChange={handle} /></div>
              </>}
              {form.accountType === 'CURRENT' && (
                <div className="form-group"><label>Overdraft Limit (₹)</label><input type="number" name="overdraftLimit" value={form.overdraftLimit} onChange={handle} /></div>
              )}
              {form.accountType === 'LOAN' && <>
                <div className="form-group"><label>Loan Amount (₹)</label><input type="number" name="loanAmount" value={form.loanAmount} onChange={handle} /></div>
                <div className="form-group"><label>Tenure (months)</label><input type="number" name="tenureMonths" value={form.tenureMonths} onChange={handle} /></div>
                <div className="form-group">
                  <label>Loan Type</label>
                  <select name="loanType" value={form.loanType} onChange={handle}>
                    {['HOME', 'CAR', 'PERSONAL', 'EDUCATION'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </>}
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Opening…' : 'Open Account'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {modal === 'deposit' && selAcc && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Deposit — {selAcc.accountNumber}</div>
            <form onSubmit={submitDeposit}>
              <div className="form-group"><label>Amount (₹)</label><input type="number" name="amount" value={txForm.amount} onChange={handleTx} min="1" required /></div>
              <div className="form-group"><label>Description</label><input type="text" name="description" value={txForm.description} onChange={handleTx} placeholder="e.g. Salary credit" /></div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-success" disabled={loading}>{loading ? '…' : 'Deposit'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {modal === 'withdraw' && selAcc && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Withdraw — {selAcc.accountNumber}</div>
            <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '1rem' }}>Current balance: ₹{selAcc.balance.toLocaleString('en-IN')}</p>
            <form onSubmit={submitWithdraw}>
              <div className="form-group"><label>Amount (₹)</label><input type="number" name="amount" value={txForm.amount} onChange={handleTx} min="1" required /></div>
              <div className="form-group"><label>Description</label><input type="text" name="description" value={txForm.description} onChange={handleTx} placeholder="e.g. ATM withdrawal" /></div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-danger" disabled={loading}>{loading ? '…' : 'Withdraw'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {modal === 'transfer' && selAcc && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Transfer — {selAcc.accountNumber}</div>
            <form onSubmit={submitTransfer}>
              <div className="form-group"><label>To Account Number</label><input type="text" value={toAcc} onChange={e => setToAcc(e.target.value)} placeholder="ACC-XXXXXXXX" required /></div>
              <div className="form-group"><label>Amount (₹)</label><input type="number" name="amount" value={txForm.amount} onChange={handleTx} min="1" required /></div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? '…' : 'Transfer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
