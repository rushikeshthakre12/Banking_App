import axios from 'axios';

const BASE = 'http://localhost:8080/api';
const api  = axios.create({ baseURL: BASE });

// ── Customers ────────────────────────────────────────────────────────────────
export const customerAPI = {
  getAll:    ()         => api.get('/customers'),
  getById:   (id)       => api.get(`/customers/${id}`),
  create:    (data)     => api.post('/customers', data),
  update:    (id, data) => api.put(`/customers/${id}`, data),
  delete:    (id)       => api.delete(`/customers/${id}`),
};

// ── Accounts ─────────────────────────────────────────────────────────────────
export const accountAPI = {
  getAll:          ()        => api.get('/accounts'),
  getByNumber:     (accNo)   => api.get(`/accounts/${accNo}`),
  getByCustomer:   (cid)     => api.get(`/accounts/customer/${cid}`),
  create:          (data)    => api.post('/accounts', data),
  deposit:         (accNo, amount, description) =>
    api.post(`/accounts/${accNo}/deposit`,  { amount, description }),
  withdraw:        (accNo, amount, description) =>
    api.post(`/accounts/${accNo}/withdraw`, { amount, description }),
  transfer:        (from, to, amount) =>
    api.post('/accounts/transfer', { fromAccountNumber: from, toAccountNumber: to, amount }),
  getInterest:     (accNo)   => api.get(`/accounts/${accNo}/interest`),
};

// ── Transactions ─────────────────────────────────────────────────────────────
export const transactionAPI = {
  getAll:     ()       => api.get('/transactions'),
  getByAccount: (accNo) => api.get(`/transactions/${accNo}`),
  getRecent:  (accNo)  => api.get(`/transactions/${accNo}/recent`),
};

export default api;
