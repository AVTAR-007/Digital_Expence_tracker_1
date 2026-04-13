package com.expense.tracker.service;

import com.expense.tracker.dto.*;
import com.expense.tracker.exception.*;
import com.expense.tracker.model.*;
import com.expense.tracker.model.Expense.ExpenseType;
import com.expense.tracker.repository.*;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseService(ExpenseRepository expenseRepository, UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public ExpenseResponse create(String email, ExpenseRequest req) {
        User user = getUser(email);
        Expense expense = Expense.builder()
                .title(req.getTitle())
                .amount(req.getAmount())
                .category(req.getCategory())
                .date(req.getDate())
                .description(req.getDescription())
                .type(req.getType())
                .user(user)
                .build();
        return toResponse(expenseRepository.save(expense));
    }

    public List<ExpenseResponse> getAll(String email) {
        User user = getUser(email);
        return expenseRepository.findByUserIdOrderByDateDesc(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ExpenseResponse getById(String email, Long id) {
        User user = getUser(email);
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
        if (!expense.getUser().getId().equals(user.getId()))
            throw new BadRequestException("Access denied");
        return toResponse(expense);
    }

    public ExpenseResponse update(String email, Long id, ExpenseRequest req) {
        User user = getUser(email);
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
        if (!expense.getUser().getId().equals(user.getId()))
            throw new BadRequestException("Access denied");
        expense.setTitle(req.getTitle());
        expense.setAmount(req.getAmount());
        expense.setCategory(req.getCategory());
        expense.setDate(req.getDate());
        expense.setDescription(req.getDescription());
        expense.setType(req.getType());
        return toResponse(expenseRepository.save(expense));
    }

    public void delete(String email, Long id) {
        User user = getUser(email);
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
        if (!expense.getUser().getId().equals(user.getId()))
            throw new BadRequestException("Access denied");
        expenseRepository.delete(expense);
    }

    public SummaryResponse getSummary(String email) {
        User user = getUser(email);
        Long userId = user.getId();

        BigDecimal totalIncome = Optional.ofNullable(
                expenseRepository.sumByUserIdAndType(userId, ExpenseType.INCOME)).orElse(BigDecimal.ZERO);
        BigDecimal totalExpense = Optional.ofNullable(
                expenseRepository.sumByUserIdAndType(userId, ExpenseType.EXPENSE)).orElse(BigDecimal.ZERO);

        Map<String, BigDecimal> byCategory = new HashMap<>();
        expenseRepository.sumByCategoryForUser(userId)
                .forEach(row -> byCategory.put((String) row[0], (BigDecimal) row[1]));

        Map<String, BigDecimal> monthlyTrend = new LinkedHashMap<>();
        expenseRepository.monthlyTrendByUserAndType(userId, ExpenseType.EXPENSE)
                .forEach(row -> {
                    String key = row[0] + "-" + String.format("%02d", row[1]);
                    monthlyTrend.put(key, (BigDecimal) row[2]);
                });

        return SummaryResponse.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .balance(totalIncome.subtract(totalExpense))
                .expenseByCategory(byCategory)
                .monthlyTrend(monthlyTrend)
                .build();
    }

    private ExpenseResponse toResponse(Expense e) {
        return ExpenseResponse.builder()
                .id(e.getId())
                .title(e.getTitle())
                .amount(e.getAmount())
                .category(e.getCategory())
                .date(e.getDate())
                .description(e.getDescription())
                .type(e.getType())
                .createdAt(e.getCreatedAt())
                .build();
    }
}
