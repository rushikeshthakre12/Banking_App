package com.banking.service;

import com.banking.dto.AccountDTO;
import com.banking.exception.InsufficientFundsException;
import com.banking.model.*;
import com.banking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AccountService {

    @Autowired private AccountRepository   accountRepo;
    @Autowired private CustomerRepository  customerRepo;
    @Autowired private TransactionRepository txRepo;

    // ── Create Account (Factory-style using AccountDTO) ──────────────────────
    @Transactional
    public Account createAccount(AccountDTO dto) {
        Customer customer = customerRepo.findById(dto.getCustomerId())
            .orElseThrow(() -> new RuntimeException("Customer not found with id: " + dto.getCustomerId()));

        Account account;

        // OOP Polymorphism: create the right subclass based on accountType
        switch (dto.getAccountType().toUpperCase()) {
            case "SAVINGS" -> {
                SavingsAccount sa = new SavingsAccount();
                if (dto.getInterestRate()  != null) sa.setInterestRate(dto.getInterestRate());
                if (dto.getMinimumBalance() != null) sa.setMinimumBalance(dto.getMinimumBalance());
                account = sa;
            }
            case "CURRENT" -> {
                CurrentAccount ca = new CurrentAccount();
                if (dto.getOverdraftLimit() != null) ca.setOverdraftLimit(dto.getOverdraftLimit());
                account = ca;
            }
            case "LOAN" -> {
                LoanAccount la = new LoanAccount();
                if (dto.getLoanAmount()    != null) la.setLoanAmount(dto.getLoanAmount());
                if (dto.getTenureMonths()  != null) la.setTenureMonths(dto.getTenureMonths());
                if (dto.getInterestRate()  != null) la.setInterestRate(dto.getInterestRate());
                if (dto.getLoanType()      != null) la.setLoanType(dto.getLoanType());
                account = la;
            }
            default -> throw new IllegalArgumentException("Unknown account type: " + dto.getAccountType());
        }

        account.setAccountNumber("ACC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        account.setCustomer(customer);

        // Initial deposit
        if (dto.getInitialDeposit() > 0) {
            account.deposit(dto.getInitialDeposit());
        }

        return accountRepo.save(account);
    }

    public Account getByAccountNumber(String accNo) {
        return accountRepo.findByAccountNumber(accNo)
            .orElseThrow(() -> new RuntimeException("Account not found: " + accNo));
    }

    public List<Account> getAllAccounts() {
        return accountRepo.findAll();
    }

    public List<Account> getAccountsByCustomer(Long customerId) {
        return accountRepo.findByCustomerId(customerId);
    }

    // ── Deposit ───────────────────────────────────────────────────────────────
    @Transactional
    public Account deposit(String accNo, double amount, String description) {
        Account account = getByAccountNumber(accNo);
        account.deposit(amount);   // Polymorphic call
        logTransaction(account, "CREDIT", amount, description);
        return accountRepo.save(account);
    }

    // ── Withdraw ──────────────────────────────────────────────────────────────
    @Transactional
    public Account withdraw(String accNo, double amount, String description) {
        Account account = getByAccountNumber(accNo);
        try {
            account.withdraw(amount);   // Polymorphic call — behavior differs per subclass!
        } catch (RuntimeException e) {
            throw new InsufficientFundsException(e.getMessage());
        }
        logTransaction(account, "DEBIT", amount, description);
        return accountRepo.save(account);
    }

    // ── Interest / EMI ────────────────────────────────────────────────────────
    public double getInterestOrEMI(String accNo) {
        Account account = getByAccountNumber(accNo);
        return account.calculateInterest();   // Polymorphic call
    }

    // ── Transfer ──────────────────────────────────────────────────────────────
    @Transactional
    public void transfer(String fromAccNo, String toAccNo, double amount) {
        withdraw(fromAccNo, amount, "Transfer to " + toAccNo);
        deposit(toAccNo, amount, "Transfer from " + fromAccNo);
    }

    // ── Private helpers ───────────────────────────────────────────────────────
    private void logTransaction(Account account, String type, double amount, String description) {
        Transaction tx = new Transaction();
        tx.setAccountNumber(account.getAccountNumber());
        tx.setType(type);
        tx.setAmount(amount);
        tx.setBalanceAfter(account.getBalance());
        tx.setDescription(description != null ? description : type + " of ₹" + amount);
        txRepo.save(tx);
    }
}
