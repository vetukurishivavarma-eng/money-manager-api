package com.moneymanager.dto;

import java.time.LocalDate;

public class TransactionDTO {
    private Long id;
    private Double amount;
    private String description;
    private String type;
    private LocalDate date;
    private Long userId;

    public TransactionDTO() {}

    public TransactionDTO(Long id, Double amount, String description, String type, LocalDate date, Long userId) {
        this.id = id;
        this.amount = amount;
        this.description = description;
        this.type = type;
        this.date = date;
        this.userId = userId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}