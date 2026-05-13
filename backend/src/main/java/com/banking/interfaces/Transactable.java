package com.banking.interfaces;

/**
 * OOP Concept: Interface (Polymorphic Contract)
 * All account types must implement these core banking operations.
 * This is the foundation of runtime polymorphism in this project.
 */
public interface Transactable {
    void deposit(double amount);
    void withdraw(double amount);
    double calculateInterest();
    double getBalance();
}
