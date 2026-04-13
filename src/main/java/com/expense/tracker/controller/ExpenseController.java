package com.expense.tracker.controller;

import com.expense.tracker.dto.*;
import com.expense.tracker.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> create(@AuthenticationPrincipal UserDetails user,
                                                   @Valid @RequestBody ExpenseRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(expenseService.create(user.getUsername(), req));
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getAll(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(expenseService.getAll(user.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseResponse> getById(@AuthenticationPrincipal UserDetails user,
                                                    @PathVariable Long id) {
        return ResponseEntity.ok(expenseService.getById(user.getUsername(), id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> update(@AuthenticationPrincipal UserDetails user,
                                                   @PathVariable Long id,
                                                   @Valid @RequestBody ExpenseRequest req) {
        return ResponseEntity.ok(expenseService.update(user.getUsername(), id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal UserDetails user,
                                        @PathVariable Long id) {
        expenseService.delete(user.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/summary")
    public ResponseEntity<SummaryResponse> getSummary(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(expenseService.getSummary(user.getUsername()));
    }
}
