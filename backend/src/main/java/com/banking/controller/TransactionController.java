package com.banking.controller;

import com.banking.model.Transaction;
import com.banking.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {

    @Autowired private TransactionService txService;

    @GetMapping
    public ResponseEntity<List<Transaction>> getAll() {
        return ResponseEntity.ok(txService.getAll());
    }

    @GetMapping("/{accountNumber}")
    public ResponseEntity<List<Transaction>> getByAccount(@PathVariable String accountNumber) {
        return ResponseEntity.ok(txService.getByAccount(accountNumber));
    }

    @GetMapping("/{accountNumber}/recent")
    public ResponseEntity<List<Transaction>> getRecent(@PathVariable String accountNumber) {
        return ResponseEntity.ok(txService.getRecentByAccount(accountNumber));
    }
}
