package com.expense.tracker.dto;

import com.expense.tracker.model.Expense.ExpenseType;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ExpenseResponse {
    private Long id;
    private String title;
    private BigDecimal amount;
    private String category;
    private LocalDate date;
    private String description;
    private ExpenseType type;
    private LocalDateTime createdAt;
}
