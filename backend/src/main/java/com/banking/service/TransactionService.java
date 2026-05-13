package com.banking.service;

import com.banking.model.Transaction;
import com.banking.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    @Autowired private TransactionRepository txRepo;

    public List<Transaction> getByAccount(String accountNumber) {
        return txRepo.findByAccountNumberOrderByTimestampDesc(accountNumber);
    }

    public List<Transaction> getRecentByAccount(String accountNumber) {
        return txRepo.findTop10ByAccountNumberOrderByTimestampDesc(accountNumber);
    }

    public List<Transaction> getAll() {
        return txRepo.findAll();
    }
}
