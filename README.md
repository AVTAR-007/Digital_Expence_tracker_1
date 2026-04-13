# Expense Tracker - Backend

## Requirements
- Java 17+
- Maven 3.6+

## Run
```bash
mvn spring-boot:run
```
Runs on: http://localhost:8080
H2 Console: http://localhost:8080/h2-console

## API Endpoints
POST /api/auth/register
POST /api/auth/login
GET  /api/expenses
POST /api/expenses
PUT  /api/expenses/{id}
DELETE /api/expenses/{id}
GET  /api/expenses/summary
