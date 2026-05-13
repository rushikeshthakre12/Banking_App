package com.banking.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AccountDTO {
    private String accountType;   // SAVINGS | CURRENT | LOAN
    private double initialDeposit;
    private Long customerId;

    // SavingsAccount fields
    private Double interestRate;
    private Double minimumBalance;

    // CurrentAccount fields
    private Double overdraftLimit;

    // LoanAccount fields
    private Double loanAmount;
    private Integer tenureMonths;
    private String loanType;
}
