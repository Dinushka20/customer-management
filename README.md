# OmniDB | Customer Management System

A high-performance, full-stack Customer Management solution built with **Spring Boot (Java 8)** and **React JS**, featuring automated data processing, robust E2E testing, and a premium modern dashboard.

---

## ✨ Features

- **🌐 Modern Dashboard**: Professional light-themed UI with a sidebar layout, built using pure Vanilla CSS.
- **📁 Excel Bulk Upload**: Memory-efficient processing of up to 1,000,000 records using Apache POI (SAX API).
- **⚡ Performance Optimized**: Minimal database calls using Hibernate batch fetching to solve the N+1 problem.
- **🔗 Relational Mapping**: Handles complex customer relationships, multiple addresses, mobile numbers, and family member links.
- **🛡️ Data Integrity**: Safe SQL scaffolding with `IF NOT EXISTS` and `INSERT IGNORE` master data management.
- **🧪 Full-Stack Testing**: 
  - **Backend**: JUnit 5 integration tests with H2 in-memory DB.
  - **Frontend**: Playwright E2E automation for browser-level validation.

---

## 🚀 Getting Started

### Prerequisites
- **Java 8** (LTS)
- **Node.js** (v16+) & npm
- **MariaDB** (Host: `localhost`, Port: `3306`, DB: `customer_db`, User: `root`, Password: `root`)

### 1. Database Setup
Ensure MariaDB is running and initialize the database:
```sql
CREATE DATABASE customer_db;
```
*The DDL (`schema.sql`) and DML (`data.sql`) are automated and safe for re-execution.*

### 2. Backend Execution
```bash
cd backend
./mvnw clean spring-boot:run
```
- **Port**: `8080`
- **CORS**: Configured for `http://localhost:3000`

### 3. Frontend Execution
```bash
cd frontend
npm install
npm run dev
```
- **Port**: `3000`

---

## 🧪 Testing Suite

### Backend (JUnit)
Verify service-layer logic and constraints:
```bash
cd backend
./mvnw test
```

### Frontend (Playwright)
Verify UI flows and edge cases:
```bash
cd frontend
npm run test:e2e      # Headless mode
npm run test:headed   # Visual browser mode
```

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | Java 8, Spring Boot 2.7, Data JPA, MariaDB Connector |
| **Frontend** | React 19, Vite, Axios, Lucide Icons, Vanilla CSS |
| **Tests** | JUnit 5, H2 Database (Test), Playwright (E2E) |
| **Tools** | Maven, Apache POI 5.2 (Excel), Lombok |

---

## 📂 Project Architecture

- `backend/src/main/resources/schema.sql`: Core DDL definitions.
- `backend/src/main/resources/data.sql`: Master data (Cities/Countries).
- `frontend/src/services/api.js`: Centralized Axios configuration.
- `frontend/src/index.css`: Global design system tokens and variables.
- `frontend/tests/`: Automated E2E test scripts.

---
*Created for the Customer Management System Assignment.*
