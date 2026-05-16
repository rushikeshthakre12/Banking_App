# 🏛️ Banking Management System
### Java Spring Boot + React | OOP — Inheritance & Polymorphism

![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.0-green?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql)

🔗 **Repo:** [Banking App on GitHub](https://github.com/rushikeshthakre12/Banking_App)

---

## 📌 About

Full-stack Banking System demonstrating core **OOP concepts**:

| Concept | Where Used |
|---|---|
| Abstraction | `Account.java` — abstract class |
| Inheritance | `SavingsAccount`, `CurrentAccount`, `LoanAccount` extend `Account` |
| Polymorphism | `withdraw()` & `calculateInterest()` differ per account type |
| Encapsulation | `balance` is private — accessed via getters/setters |
| Interface | `Transactable.java` — contract for all accounts |

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Backend | Java 17, Spring Boot 3.2 |
| Database | MySQL 8 + Spring Data JPA |
| Frontend | React 18, Axios, Recharts |

---

## ⚙️ Setup

### 1. MySQL
```sql
CREATE DATABASE banking_db;
```

### 2. Update Password
```properties
# backend/src/main/resources/application.properties
spring.datasource.password=YOUR_PASSWORD
```

### 3. Run Backend
```
VS Code → 🍃 Spring Boot Dashboard → ▶ BankingApplication
```

### 4. Run Frontend
```bash
cd frontend
npm install
npm start
```

App runs at → `http://localhost:3000`

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/customers` | Create customer |
| POST | `/api/accounts` | Open account |
| POST | `/api/accounts/{accNo}/deposit` | Deposit |
| POST | `/api/accounts/{accNo}/withdraw` | Withdraw |
| POST | `/api/accounts/transfer` | Transfer |
| GET | `/api/transactions/{accNo}` | Transactions |

---

## 👨‍💻 Developer

**Rushikesh** 
