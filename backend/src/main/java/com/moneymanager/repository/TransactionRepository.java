package com.moneymanager.repository;

import com.moneymanager.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserIdOrderByDateDesc(Long userId);
    List<Transaction> findByUserId(Long userId);
    void deleteByIdAndUserId(Long id, Long userId);
}