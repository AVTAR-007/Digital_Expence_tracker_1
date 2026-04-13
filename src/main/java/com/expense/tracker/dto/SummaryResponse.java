package com.expense.tracker.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SummaryResponse {
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal balance;
    private Map<String, BigDecimal> expenseByCategory;
    private Map<String, BigDecimal> monthlyTrend;
}
