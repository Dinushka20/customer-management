# Customer Management System Backend

This is a Spring Boot application for managing customers.

## Technologies
- Java 8
- MariaDB
- Spring Boot
- JPA / Hibernate
- Apache POI (SAX Event API for memory-efficient Excel bulk uploads)
- Maven

## Database Setup & DDL/DML

1. **Install MariaDB**:
   Ensure MariaDB is installed and running on `localhost:3306`.
2. **Setup Schema Database**:
   Create a database named `customer_db`.
3. **Credentials**:
   By default, the application connects using username `root` and password `12345678`. Update `src/main/resources/application.properties` if needed.
4. **Initialization**:
   The application uses `spring.sql.init.mode=always` to automatically run:
   - **DDL:** Located at `src/main/resources/schema.sql` (Creates all tables and constraints)
   - **DML:** Located at `src/main/resources/data.sql` (Populates master data for Cities and Countries, and sample customers)

## How to Run

1. Open a terminal in the `backend` directory.
2. Build and run the app with maven wrapper:
   ```bash
   ./mvnw clean spring-boot:run
   ```

## Excel Bulk Upload
The bulk upload endpoint handles up to 1,000,000 records dynamically using Apache POI SAX parsing, which effectively avoids excessive memory usage and timeout issues.

## DB Call Optimizations
To adhere to having minimal DB calls, `spring.jpa.properties.hibernate.default_batch_fetch_size` has been configured to automatically fetch relationship sets (like `Address`, `MobileNumber`, `FamilyMember`) to bypass the typical JPA N+1 problem.
