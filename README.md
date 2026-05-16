# 🏛️ Banking Management System
### Java Spring Boot + React | OOP Concepts: Inheritance & Polymorphism

![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.0-green?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql)
![Maven](https://img.shields.io/badge/Maven-3.8+-red?style=for-the-badge&logo=apachemaven)

---

## 📌 About the Project

A full-stack **Banking Management System** built with Java Spring Boot (backend) and React (frontend).  
This project demonstrates core **Object-Oriented Programming (OOP)** concepts including:

- ✅ **Abstraction** — Abstract `Account` class
- ✅ **Inheritance** — `SavingsAccount`, `CurrentAccount`, `LoanAccount` extend `Account`
- ✅ **Polymorphism** — `withdraw()` and `calculateInterest()` behave differently per account type
- ✅ **Encapsulation** — `balance` is private, accessed via getters/setters
- ✅ **Interface** — `Transactable` interface implemented by all account types
- ✅ **Association** — `Customer` has-many `Accounts` via `@OneToMany`

---

## 🏗️ OOP Class Hierarchy

```
Transactable (Interface)
        │
        ▼
    Account (Abstract Class)
        │
        ├── SavingsAccount   → Min balance rule, 4% interest
        ├── CurrentAccount   → Overdraft limit allowed
        └── LoanAccount      → EMI calculation, repayment
```

---

## 🖥️ Features

### Backend
- Create Customers & Open Accounts (Savings / Current / Loan)
- Deposit, Withdraw, Transfer between accounts
- Auto Interest & EMI calculation (Polymorphism in action)
- Full Transaction History
- Global Exception Handling
- CORS configured for React frontend

### Frontend
- 🏠 **Dashboard** — Stats + Bar Chart (Recharts)
- 👤 **Customers** — Add & view all customers
- 🏦 **Accounts** — Open accounts, deposit, withdraw, transfer
- 💳 **Transactions** — Filter by CREDIT/DEBIT, search by account

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.2.0 |
| ORM | Spring Data JPA + Hibernate |
| Database | MySQL 8 |
| Frontend | React 18, React Router v6 |
| Charts | Recharts |
| HTTP Client | Axios |
| Build Tool | Maven |

---

## 📁 Project Structure

```
banking-app/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/banking/
│       ├── BankingApplication.java
│       ├── CorsConfig.java
│       ├── interfaces/
│       │   └── Transactable.java
│       ├── model/
│       │   ├── Account.java          ← Abstract Base Class
│       │   ├── SavingsAccount.java   ← Subclass 1
│       │   ├── CurrentAccount.java   ← Subclass 2
│       │   ├── LoanAccount.java      ← Subclass 3
│       │   ├── Customer.java
│       │   └── Transaction.java
│       ├── repository/
│       ├── service/
│       ├── controller/
│       ├── dto/
│       └── exception/
│
└── frontend/
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js
        ├── App.css
        ├── context/
        │   └── BankContext.js
        ├── services/
        │   └── api.js
        └── pages/
            ├── Dashboard.js
            ├── CustomersPage.js
            ├── AccountsPage.js
            └── TransactionsPage.js
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8+
- Node.js 18+
- VS Code (recommended)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/banking-management-system.git
cd banking-management-system
```

---

### 2️⃣ MySQL Database Setup

Open MySQL and run:
```sql
CREATE DATABASE banking_db;
```

---

### 3️⃣ Configure Database Password

Open `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/banking_db
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

---

### 4️⃣ Run Backend

**Option A — VS Code Spring Boot Dashboard:**
```
Left Sidebar → 🍃 Spring Boot icon → BankingApplication → ▶ Play
```

**Option B — Terminal:**
```bash
cd backend
mvn spring-boot:run
```

Backend runs at: `http://localhost:8080`

---

### 5️⃣ Run Frontend

Open new terminal:
```bash
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/customers` | Create customer |
| GET | `/api/customers` | Get all customers |
| POST | `/api/accounts` | Open new account |
| GET | `/api/accounts` | Get all accounts |
| POST | `/api/accounts/{accNo}/deposit` | Deposit money |
| POST | `/api/accounts/{accNo}/withdraw` | Withdraw money |
| POST | `/api/accounts/transfer` | Transfer between accounts |
| GET | `/api/accounts/{accNo}/interest` | Get interest / EMI |
| GET | `/api/transactions/{accNo}` | Get transactions |

---

## 📊 OOP Concepts in Code

### Polymorphism Example
```java
// Same method call — different behavior per subclass!
account.withdraw(5000);         // SavingsAccount → checks minimum balance
account.withdraw(5000);         // CurrentAccount → allows overdraft
account.withdraw(5000);         // LoanAccount    → throws exception

account.calculateInterest();    // SavingsAccount → Simple interest 4%
account.calculateInterest();    // CurrentAccount → Returns 0
account.calculateInterest();    // LoanAccount    → EMI formula
```

### Inheritance Example
```java
// All subclasses inherit deposit() from Account
account.deposit(10000);   // Works for ALL account types!
```

---

## 👨‍💻 Developed By

**Adroit**  
MCA Student — AI & ML  
Ramdeobaba University, Nagpur

---

## 📄 License

This project is for educational purposes — MCA Academic Project.
