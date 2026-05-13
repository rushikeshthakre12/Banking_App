package com.banking.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class TransactionRequestDTO {
    private double amount;
    private String description;
}
