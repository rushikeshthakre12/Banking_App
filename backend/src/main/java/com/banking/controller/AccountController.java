package com.banking.controller;

import com.banking.dto.AccountDTO;
import com.banking.dto.TransactionRequestDTO;
import com.banking.model.Account;
import com.banking.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:3000")
public class AccountController {

    @Autowired private AccountService accountService;

    @PostMapping
    public ResponseEntity<Account> create(@RequestBody AccountDTO dto) {
        return ResponseEntity.ok(accountService.createAccount(dto));
    }

    @GetMapping
    public ResponseEntity<List<Account>> getAll() {
        return ResponseEntity.ok(accountService.getAllAccounts());
    }

    @GetMapping("/{accountNumber}")
    public ResponseEntity<Account> getOne(@PathVariable String accountNumber) {
        return ResponseEntity.ok(accountService.getByAccountNumber(accountNumber));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Account>> getByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(accountService.getAccountsByCustomer(customerId));
    }

    @PostMapping("/{accountNumber}/deposit")
    public ResponseEntity<Account> deposit(@PathVariable String accountNumber,
                                           @RequestBody TransactionRequestDTO req) {
        return ResponseEntity.ok(accountService.deposit(accountNumber, req.getAmount(), req.getDescription()));
    }

    @PostMapping("/{accountNumber}/withdraw")
    public ResponseEntity<Account> withdraw(@PathVariable String accountNumber,
                                            @RequestBody TransactionRequestDTO req) {
        return ResponseEntity.ok(accountService.withdraw(accountNumber, req.getAmount(), req.getDescription()));
    }

    @PostMapping("/transfer")
    public ResponseEntity<Map<String, String>> transfer(@RequestBody Map<String, Object> body) {
        String from   = (String) body.get("fromAccountNumber");
        String to     = (String) body.get("toAccountNumber");
        double amount = Double.parseDouble(body.get("amount").toString());
        accountService.transfer(from, to, amount);
        return ResponseEntity.ok(Map.of("message", "Transfer of ₹" + amount + " successful"));
    }

    @GetMapping("/{accountNumber}/interest")
    public ResponseEntity<Map<String, Double>> getInterest(@PathVariable String accountNumber) {
        double value = accountService.getInterestOrEMI(accountNumber);
        return ResponseEntity.ok(Map.of("interestOrEMI", value));
    }
}
