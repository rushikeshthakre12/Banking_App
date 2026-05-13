package com.banking.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String accountNumber;

    @Column(nullable = false)
    private String type;           // CREDIT | DEBIT

    @Column(nullable = false)
    private double amount;

    private double balanceAfter;
    private String description;

    private LocalDateTime timestamp = LocalDateTime.now();
}
