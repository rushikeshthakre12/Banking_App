package com.banking.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * OOP Concept: Inheritance + Polymorphism (Subclass 1)
 * - Inherits accountNumber, balance, deposit() from Account.
 * - Overrides withdraw() → enforces minimum balance rule.
 * - Overrides calculateInterest() → simple annual interest formula.
 */
@Getter
@Setter
@Entity
@Table(name = "savings_accounts")
public class SavingsAccount extends Account {

    private double interestRate = 4.0;       // 4% per annum
    private double minimumBalance = 1000.0;

    public SavingsAccount() {
        setAccountType("SAVINGS");
    }

    /**
     * Polymorphism: cannot withdraw below minimumBalance.
     */
    @Override
    public void withdraw(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Withdrawal amount must be positive");
        }
        if (getBalance() - amount < minimumBalance) {
            throw new RuntimeException(
                "Cannot withdraw ₹" + amount +
                ". Minimum balance of ₹" + minimumBalance + " must be maintained."
            );
        }
        setBalance(getBalance() - amount);
    }

    /**
     * Polymorphism: Simple Interest = (P × R) / 100
     */
    @Override
    public double calculateInterest() {
        return Math.round((getBalance() * interestRate / 100) * 100.0) / 100.0;
    }
}
