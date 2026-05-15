import React, { createContext, useContext, useState, useCallback } from 'react';
import { accountAPI, customerAPI, transactionAPI } from '../services/api';

const BankContext = createContext(null);

export function BankProvider({ children }) {
  const [customers,    setCustomers]    = useState([]);
  const [accounts,     setAccounts]     = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState(null);

  const withLoading = async (fn) => {
    setLoading(true);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = useCallback(() =>
    withLoading(async () => {
      const { data } = await customerAPI.getAll();
      setCustomers(data);
    }), []);

  const fetchAccounts = useCallback(() =>
    withLoading(async () => {
      const { data } = await accountAPI.getAll();
      setAccounts(data);
    }), []);

  const fetchTransactions = useCallback(() =>
    withLoading(async () => {
      const { data } = await transactionAPI.getAll();
      setTransactions(data);
    }), []);

  const createCustomer = async (data) => {
    const { data: created } = await customerAPI.create(data);
    setCustomers(prev => [...prev, created]);
    return created;
  };

  const createAccount = async (data) => {
    const { data: created } = await accountAPI.create(data);
    setAccounts(prev => [...prev, created]);
    return created;
  };

  const doDeposit = async (accNo, amount, desc) => {
    const { data: updated } = await accountAPI.deposit(accNo, amount, desc);
    setAccounts(prev => prev.map(a => a.accountNumber === accNo ? updated : a));
    return updated;
  };

  const doWithdraw = async (accNo, amount, desc) => {
    const { data: updated } = await accountAPI.withdraw(accNo, amount, desc);
    setAccounts(prev => prev.map(a => a.accountNumber === accNo ? updated : a));
    return updated;
  };

  const doTransfer = async (from, to, amount) => {
    await accountAPI.transfer(from, to, amount);
    await fetchAccounts();
  };

  return (
    <BankContext.Provider value={{
      customers, accounts, transactions,
      loading, error, setError,
      fetchCustomers, fetchAccounts, fetchTransactions,
      createCustomer, createAccount,
      doDeposit, doWithdraw, doTransfer,
    }}>
      {children}
    </BankContext.Provider>
  );
}

export const useBank = () => useContext(BankContext);
