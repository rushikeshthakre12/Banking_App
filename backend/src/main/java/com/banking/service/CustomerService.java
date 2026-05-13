package com.banking.service;

import com.banking.model.Customer;
import com.banking.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    @Autowired private CustomerRepository customerRepo;

    public Customer create(Customer customer) {
        if (customerRepo.existsByEmail(customer.getEmail()))
            throw new RuntimeException("Email already registered: " + customer.getEmail());
        return customerRepo.save(customer);
    }

    public Customer getById(Long id) {
        return customerRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Customer not found: " + id));
    }

    public List<Customer> getAll() {
        return customerRepo.findAll();
    }

    public Customer update(Long id, Customer updated) {
        Customer existing = getById(id);
        existing.setName(updated.getName());
        existing.setPhone(updated.getPhone());
        existing.setAddress(updated.getAddress());
        return customerRepo.save(existing);
    }

    public void delete(Long id) {
        customerRepo.deleteById(id);
    }
}
