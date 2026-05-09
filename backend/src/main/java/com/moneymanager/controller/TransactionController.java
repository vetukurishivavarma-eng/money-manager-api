package com.moneymanager.controller;

import com.moneymanager.dto.TransactionDTO;
import com.moneymanager.entity.Transaction;
import com.moneymanager.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    private Long getCurrentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof Long) {
            return (Long) principal;
        }
        return null;
    }

    private TransactionDTO toDTO(Transaction transaction) {
        return new TransactionDTO(
            transaction.getId(),
            transaction.getAmount(),
            transaction.getDescription(),
            transaction.getType(),
            transaction.getDate(),
            transaction.getUser() != null ? transaction.getUser().getId() : null
        );
    }

    @GetMapping("/transactions")
    public List<TransactionDTO> getAllTransactions() {
        Long userId = getCurrentUserId();
        if (userId == null) {
            return Collections.emptyList();
        }
        return transactionService.getAllTransactions(userId).stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @PostMapping("/transactions")
    public TransactionDTO addTransaction(@RequestBody TransactionDTO dto) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            throw new RuntimeException("User not authenticated");
        }
        Transaction transaction = new Transaction();
        transaction.setAmount(dto.getAmount());
        transaction.setDescription(dto.getDescription());
        transaction.setType(dto.getType());
        transaction.setDate(dto.getDate());
        Transaction saved = transactionService.addTransaction(transaction, userId);
        return toDTO(saved);
    }

    @DeleteMapping("/transactions/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        transactionService.deleteTransaction(id, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/summary")
    public Map<String, Double> getSummary() {
        Long userId = getCurrentUserId();
        if (userId == null) {
            Map<String, Double> emptySummary = new HashMap<>();
            emptySummary.put("totalIncome", 0.0);
            emptySummary.put("totalExpense", 0.0);
            emptySummary.put("balance", 0.0);
            return emptySummary;
        }
        return transactionService.getSummary(userId);
    }
}