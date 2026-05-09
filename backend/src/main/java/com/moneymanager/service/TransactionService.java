package com.moneymanager.service;

import com.moneymanager.entity.Transaction;
import com.moneymanager.entity.User;
import com.moneymanager.repository.TransactionRepository;
import com.moneymanager.repository.UserRepository;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionService(TransactionRepository transactionRepository, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    public List<Transaction> getAllTransactions(Long userId) {
        return transactionRepository.findByUserIdOrderByDateDesc(userId);
    }

    public Transaction addTransaction(Transaction transaction, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        transaction.setUser(user);
        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(Long id, Long userId) {
        transactionRepository.deleteByIdAndUserId(id, userId);
    }

    public Map<String, Double> getSummary(Long userId) {
        List<Transaction> transactions = transactionRepository.findByUserId(userId);
        double totalIncome = transactions.stream()
                .filter(t -> "INCOME".equals(t.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();
        double totalExpense = transactions.stream()
                .filter(t -> "EXPENSE".equals(t.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();
        double balance = totalIncome - totalExpense;
        Map<String, Double> result = new HashMap<>();
        result.put("totalIncome", totalIncome);
        result.put("totalExpense", totalExpense);
        result.put("balance", balance);
        return result;
    }

    @PostConstruct
    public void initDefaultUser() {
        if (userRepository.count() == 0) {
            User defaultUser = new User("admin@moneymanager.local", "Default Admin", "EMAIL");
            defaultUser.setPasswordHash("$2a$10$N9qo8uLOickgx2ZMRZoMye1I9gC/OqFgVBPHV8n3.3K5Z3Z3Z3Z3Z");
            defaultUser = userRepository.save(defaultUser);

            Transaction t1 = new Transaction(5000.0, "Salary", "INCOME", LocalDate.now());
            t1.setUser(defaultUser);
            transactionRepository.save(t1);

            Transaction t2 = new Transaction(1500.0, "Freelance Work", "INCOME", LocalDate.now().minusDays(2));
            t2.setUser(defaultUser);
            transactionRepository.save(t2);

            Transaction t3 = new Transaction(300.0, "Grocery Shopping", "EXPENSE", LocalDate.now().minusDays(1));
            t3.setUser(defaultUser);
            transactionRepository.save(t3);

            Transaction t4 = new Transaction(50.0, "Transportation", "EXPENSE", LocalDate.now().minusDays(3));
            t4.setUser(defaultUser);
            transactionRepository.save(t4);

            Transaction t5 = new Transaction(200.0, "Utilities Bill", "EXPENSE", LocalDate.now().minusDays(5));
            t5.setUser(defaultUser);
            transactionRepository.save(t5);
        }
    }
}