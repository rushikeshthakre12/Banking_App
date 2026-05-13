package com.banking.model;

import com.banking.interfaces.Transactable;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * OOP Concept: Abstract Class + Encapsulation
 * - Cannot be instantiated directly.
 * - Provides common fields and a concrete deposit() method to all subclasses.
 * - balance is private (encapsulated); subclasses use protected setBalance().
 * - Implements Transactable interface, leaving withdraw() and calculateInterest()
 *   abstract so each subclass defines its own behavior (Polymorphism).
 */
@Getter
@Setter
@Entity
@Table(name = "accounts")
@Inheritance(strategy = InheritanceType.JOINED)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "accountType")
@JsonSubTypes({
    @JsonSubTypes.Type(value = SavingsAccount.class,  name = "SAVINGS"),
    @JsonSubTypes.Type(value = CurrentAccount.class,  name = "CURRENT"),
    @JsonSubTypes.Type(value = LoanAccount.class,     name = "LOAN")
})
public abstract class Account implements Transactable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String accountNumber;

    // Encapsulation: balance is private, accessed only via getBalance/setBalance
    @Column(nullable = false)
    private double balance;

    @Column(nullable = false)
    private String accountType;

    @Column(nullable = false)
    private String status = "ACTIVE"; // ACTIVE | INACTIVE | CLOSED

    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    @JsonIgnore
    private Customer customer;

    // ──────────────────────────────────────────────
    // Concrete method shared by ALL subclasses (Inheritance)
    // ──────────────────────────────────────────────
    @Override
    public void deposit(double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Deposit amount must be positive");
        }
        this.balance += amount;
    }

    @Override
    public double getBalance() {
        return this.balance;
    }

    // Protected so only subclasses can set balance directly
    protected void setBalance(double balance) {
        this.balance = balance;
    }

    // ──────────────────────────────────────────────
    // Abstract methods — each subclass MUST override (Polymorphism)
    // ──────────────────────────────────────────────
    @Override
    public abstract void withdraw(double amount);

    @Override
    public abstract double calculateInterest();
}
