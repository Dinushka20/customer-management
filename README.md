# Customer Management System (CMS)

A full-stack Customer Management System built using **Spring Boot (Java 8)** and **React**.  
This project demonstrates robust CRUD operations, relational data handling, and optimized bulk data processing via Excel.

---

## ✅ Assignment Requirements Coverage

- [x] Create Customer
- [x] Update Customer
- [x] View Customer Details (ID, NIC, DOB)
- [x] List Customers (Paginated Table View)
- [x] Multiple Mobile Numbers per customer
- [x] Multiple Addresses per customer
- [x] Family Member Linking (Self-referencing relationship)
- [x] Bulk Upload via Excel (Large file support)

---

## ✨ Features

- **Responsive Dashboard**: Manage customer profiles with a clean, modern UI.
- **Advanced Relationships**: Link family members and manage multiple contact points.
- **Bulk Ingestion**: Upload Excel files with thousands of records efficiently.
- **Server-Side Processing**: Fast searching and pagination handled by the backend.
- **Modern UI/UX**: Built with Vanilla CSS for a lightweight and premium feel.

---

## ⚙️ Technical Overview

### Backend
- **Framework**: Spring Boot 2.7 (Java 8)
- **Database**: MariaDB (Relational storage)
- **Data Access**: Spring Data JPA with Hibernate batching for performance.
- **Excel Logic**: Uses **Apache POI (SAX API)** to process large files without high memory usage.

### Frontend
- **Library**: React (with Vite) for fast development and execution.
- **Icons**: Lucide React for professional iconography.
- **Styling**: Pure Vanilla CSS (CSS Variables) for high performance.

### Testing
- **Backend**: JUnit 5 for service and constraint logic.
- **Frontend**: Playwright for end-to-end (E2E) browser automation.

---

## 🚀 Getting Started

### 1. Database Setup
Ensure MariaDB is running and create the database:
```sql
CREATE DATABASE customer_db;
```
*The system will automatically create tables and insert master data (Cities/Countries) on startup.*

### 2. Run Backend
```bash
cd backend
./mvnw clean spring-boot:run
```
*Server runs on: `http://localhost:8080`*

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
*Dashboard runs on: `http://localhost:3000`*

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/customers` | Get all customers (with SEARCH/Paging) |
| **GET** | `/api/customers/{id}` | Get specific customer details |
| **POST** | `/api/customers` | Create a new customer |
| **PUT** | `/api/customers/{id}` | Update existing customer |
| **DELETE** | `/api/customers/{id}` | Delete customer (with cascading) |
| **POST** | `/api/upload` | Process bulk upload (Excel files) |

---

## 💡 Assumptions & Decisions

- **Uniqueness**: The NIC Number is treated as a unique identifier for every customer.
- **Upsert Logic**: During bulk upload, if an NIC already exists, the record is updated; otherwise, a new one is created.
- **Master Data**: City and Country lists are pre-populated via `data.sql`.
- **Validation**: Basic form validation is performed on both the client and server side.

---

## 🧪 Testing

**Backend (JUnit):**
```bash
cd backend && ./mvnw test
```

**Frontend (Playwright):**
```bash
cd frontend && npm run test:e2e
```


