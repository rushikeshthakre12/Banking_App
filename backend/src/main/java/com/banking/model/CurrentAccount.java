package com.banking.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * OOP Concept: Inheritance + Polymorphism (Subclass 2)
 * - Inherits from Account.
 * - Overrides withdraw() → allows overdraft up to the limit.
 * - Overrides calculateInterest() → no interest for current accounts.
 */
@Getter
@Setter
@Entity
@Table(name = "current_accounts")
public class CurrentAccount extends Account {

    private double overdraftLimit = 50000.0;

    public CurrentAccount() {
        setAccountType("CURRENT");
    }

    /**
     * Polymorphism: overdraft is allowed up to overdraftLimit.
     * Balance can go negative within limit.
     */
    @Override
    public void withdraw(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Withdrawal amount must be positive");
        }
        if (getBalance() - amount < -overdraftLimit) {
            throw new RuntimeException(
                "Overdraft limit of ₹" + overdraftLimit + " exceeded. " +
                "Available balance (including overdraft): ₹" + (getBalance() + overdraftLimit)
            );
        }
        setBalance(getBalance() - amount);
    }

    /**
     * Polymorphism: Current accounts do not earn interest.
     */
    @Override
    public double calculateInterest() {
        return 0.0;
    }
}
