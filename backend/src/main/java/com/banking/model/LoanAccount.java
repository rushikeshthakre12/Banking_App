package com.banking.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * OOP Concept: Inheritance + Polymorphism (Subclass 3)
 * - Inherits from Account.
 * - Overrides deposit()  → treated as EMI repayment (reduces loan balance).
 * - Overrides withdraw() → not allowed on a loan account.
 * - Overrides calculateInterest() → EMI formula.
 */
@Getter
@Setter
@Entity
@Table(name = "loan_accounts")
public class LoanAccount extends Account {

    private double loanAmount;
    private double interestRate = 8.5;   // 8.5% per annum
    private int    tenureMonths;
    private String loanType;             // HOME | CAR | PERSONAL | EDUCATION

    public LoanAccount() {
        setAccountType("LOAN");
    }

    /**
     * Polymorphism: deposit = EMI payment → reduces outstanding balance.
     */
    @Override
    public void deposit(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Repayment amount must be positive");
        }
        setBalance(getBalance() - amount);
    }

    /**
     * Polymorphism: withdrawals are not allowed on loan accounts.
     */
    @Override
    public void withdraw(double amount) {
        throw new UnsupportedOperationException(
            "Withdrawals are not permitted on loan accounts. Use deposit() to repay."
        );
    }

    /**
     * Polymorphism: EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]
     * where R = monthly rate, N = tenure in months.
     */
    @Override
    public double calculateInterest() {
        if (tenureMonths <= 0 || loanAmount <= 0) return 0.0;
        double r = interestRate / (12 * 100);
        double emi = (loanAmount * r * Math.pow(1 + r, tenureMonths))
                   / (Math.pow(1 + r, tenureMonths) - 1);
        return Math.round(emi * 100.0) / 100.0;
    }
}
