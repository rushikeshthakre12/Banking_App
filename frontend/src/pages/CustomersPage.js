import React, { useEffect, useState } from 'react';
import { useBank } from '../context/BankContext';

const EMPTY = { name: '', email: '', phone: '', address: '', panNumber: '' };

export default function CustomersPage() {
  const { customers, fetchCustomers, createCustomer, loading, error, setError } = useBank();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [success, setSuccess] = useState('');

  useEffect(() => { fetchCustomers(); }, []);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setSuccess('');
    try {
      await createCustomer(form);
      setSuccess('Customer created successfully!');
      setForm(EMPTY);
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div>
      <div className="top-bar">
        <div className="page-title" style={{ margin: 0 }}>Customers</div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Customer</button>
      </div>

      {error   && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">{success}</div>}

      <div className="card">
        {customers.length === 0 ? (
          <div className="empty-state">No customers yet. Add your first customer!</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>PAN</th><th>Joined</th></tr>
              </thead>
              <tbody>
                {customers.map((c, i) => (
                  <tr key={c.id}>
                    <td>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                    <td><code>{c.panNumber || '—'}</code></td>
                    <td>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">New Customer</div>
            <form onSubmit={submit}>
              {[
                { label: 'Full Name',   name: 'name',      type: 'text',  required: true  },
                { label: 'Email',       name: 'email',     type: 'email', required: true  },
                { label: 'Phone',       name: 'phone',     type: 'tel',   required: true  },
                { label: 'Address',     name: 'address',   type: 'text',  required: false },
                { label: 'PAN Number',  name: 'panNumber', type: 'text',  required: false },
              ].map(f => (
                <div className="form-group" key={f.name}>
                  <label>{f.label}</label>
                  <input name={f.name} type={f.type} value={form[f.name]} onChange={handle} required={f.required} placeholder={f.label} />
                </div>
              ))}
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving…' : 'Create Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
