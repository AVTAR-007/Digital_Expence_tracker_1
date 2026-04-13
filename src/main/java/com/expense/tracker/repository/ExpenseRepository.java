package com.expense.tracker.repository;

import com.expense.tracker.model.Expense;
import com.expense.tracker.model.Expense.ExpenseType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserIdOrderByDateDesc(Long userId);
    List<Expense> findByUserIdAndTypeOrderByDateDesc(Long userId, ExpenseType type);
    List<Expense> findByUserIdAndDateBetweenOrderByDateDesc(Long userId, LocalDate start, LocalDate end);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user.id = :userId AND e.type = :type")
    BigDecimal sumByUserIdAndType(@Param("userId") Long userId, @Param("type") ExpenseType type);

    @Query("SELECT e.category, SUM(e.amount) FROM Expense e WHERE e.user.id = :userId AND e.type = 'EXPENSE' GROUP BY e.category")
    List<Object[]> sumByCategoryForUser(@Param("userId") Long userId);

    @Query("SELECT FUNCTION('YEAR', e.date), FUNCTION('MONTH', e.date), SUM(e.amount) FROM Expense e WHERE e.user.id = :userId AND e.type = :type GROUP BY FUNCTION('YEAR', e.date), FUNCTION('MONTH', e.date) ORDER BY FUNCTION('YEAR', e.date), FUNCTION('MONTH', e.date)")
    List<Object[]> monthlyTrendByUserAndType(@Param("userId") Long userId, @Param("type") ExpenseType type);
}
