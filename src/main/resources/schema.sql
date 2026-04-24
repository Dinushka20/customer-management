-- ============================================================
-- Customer Management System - DDL (MariaDB)
-- ============================================================

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS family_member;
DROP TABLE IF EXISTS address;
DROP TABLE IF EXISTS mobile_number;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS city;
DROP TABLE IF EXISTS country;

-- ------------------------------------------------------------
-- Master: country
-- ------------------------------------------------------------
CREATE TABLE country (
                         id      BIGINT AUTO_INCREMENT PRIMARY KEY,
                         name    VARCHAR(100) NOT NULL UNIQUE
);

-- ------------------------------------------------------------
-- Master: city  (belongs to a country)
-- ------------------------------------------------------------
CREATE TABLE city (
                      id          BIGINT AUTO_INCREMENT PRIMARY KEY,
                      name        VARCHAR(100) NOT NULL,
                      country_id  BIGINT NOT NULL,
                      CONSTRAINT fk_city_country FOREIGN KEY (country_id) REFERENCES country(id),
                      UNIQUE KEY uq_city_country (name, country_id)
);

-- ------------------------------------------------------------
-- Core: customer
-- ------------------------------------------------------------
CREATE TABLE customer (
                          id              BIGINT AUTO_INCREMENT PRIMARY KEY,
                          name            VARCHAR(150) NOT NULL,
                          date_of_birth   DATE         NOT NULL,
                          nic_number      VARCHAR(20)  NOT NULL UNIQUE,
                          created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Mobile numbers  (multiple per customer)
-- ------------------------------------------------------------
CREATE TABLE mobile_number (
                               id          BIGINT AUTO_INCREMENT PRIMARY KEY,
                               customer_id BIGINT       NOT NULL,
                               number      VARCHAR(20)  NOT NULL,
                               CONSTRAINT fk_mobile_customer FOREIGN KEY (customer_id)
                                   REFERENCES customer(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Addresses  (multiple per customer)
-- ------------------------------------------------------------
CREATE TABLE address (
                         id              BIGINT AUTO_INCREMENT PRIMARY KEY,
                         customer_id     BIGINT       NOT NULL,
                         address_line1   VARCHAR(255) NOT NULL,
                         address_line2   VARCHAR(255),
                         city_id         BIGINT       NOT NULL,
                         country_id      BIGINT       NOT NULL,
                         CONSTRAINT fk_address_customer FOREIGN KEY (customer_id)
                             REFERENCES customer(id) ON DELETE CASCADE,
                         CONSTRAINT fk_address_city    FOREIGN KEY (city_id)
                             REFERENCES city(id),
                         CONSTRAINT fk_address_country FOREIGN KEY (country_id)
                             REFERENCES country(id)
);

-- ------------------------------------------------------------
-- Family members  (many-to-many self-referencing on customer)
-- family_member_id must also be a valid customer
-- ------------------------------------------------------------
CREATE TABLE family_member (
                               id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
                               customer_id         BIGINT NOT NULL,
                               family_member_id    BIGINT NOT NULL,
                               CONSTRAINT fk_fm_customer      FOREIGN KEY (customer_id)
                                   REFERENCES customer(id) ON DELETE CASCADE,
                               CONSTRAINT fk_fm_member        FOREIGN KEY (family_member_id)
                                   REFERENCES customer(id) ON DELETE CASCADE,
                               CONSTRAINT uq_fm_pair          UNIQUE (customer_id, family_member_id),
    -- prevent self-referencing
                               CONSTRAINT chk_fm_not_self     CHECK (customer_id <> family_member_id)
);

-- ------------------------------------------------------------
-- Indexes for common query patterns
-- ------------------------------------------------------------
CREATE INDEX idx_customer_nic       ON customer(nic_number);
CREATE INDEX idx_customer_name      ON customer(name);
CREATE INDEX idx_mobile_customer    ON mobile_number(customer_id);
CREATE INDEX idx_address_customer   ON address(customer_id);
CREATE INDEX idx_fm_customer        ON family_member(customer_id);