-- ============================================================
-- Customer Management System - DML (Seed / Sample Data)
-- ============================================================

-- ------------------------------------------------------------
-- Countries (master data)
-- ------------------------------------------------------------
INSERT INTO country (name) VALUES
                               ('Sri Lanka'),
                               ('India'),
                               ('United Kingdom'),
                               ('United States'),
                               ('Australia'),
                               ('Canada'),
                               ('Germany'),
                               ('Singapore');

-- ------------------------------------------------------------
-- Cities (master data)
-- ------------------------------------------------------------
INSERT INTO city (name, country_id) VALUES
                                        -- Sri Lanka (id=1)
                                        ('Colombo',       1),
                                        ('Kandy',         1),
                                        ('Galle',         1),
                                        ('Negombo',       1),
                                        ('Kalutara',      1),
                                        ('Matara',        1),
                                        ('Jaffna',        1),
                                        ('Kurunegala',    1),

                                        -- India (id=2)
                                        ('Mumbai',        2),
                                        ('Delhi',         2),
                                        ('Bangalore',     2),
                                        ('Chennai',       2),

                                        -- United Kingdom (id=3)
                                        ('London',        3),
                                        ('Manchester',    3),
                                        ('Birmingham',    3),

                                        -- United States (id=4)
                                        ('New York',      4),
                                        ('Los Angeles',   4),
                                        ('Chicago',       4),

                                        -- Australia (id=5)
                                        ('Sydney',        5),
                                        ('Melbourne',     5),

                                        -- Canada (id=6)
                                        ('Toronto',       6),
                                        ('Vancouver',     6),

                                        -- Germany (id=7)
                                        ('Berlin',        7),
                                        ('Munich',        7),

                                        -- Singapore (id=8)
                                        ('Singapore',     8);

-- ------------------------------------------------------------
-- Sample customers
-- ------------------------------------------------------------
INSERT INTO customer (id, name, date_of_birth, nic_number) VALUES
                                                               (1, 'Dinushka Perera',   '1998-04-15', '982060123V'),
                                                               (2, 'Amal Silva',        '1990-07-22', '901234567V'),
                                                               (3, 'Nimal Fernando',    '1985-12-01', '855342218V'),
                                                               (4, 'Kamani Jayawardena','2000-03-10', '200370100V'),
                                                               (5, 'Ruwan Bandara',     '1995-09-30', '953740089V');

-- Mobile numbers
INSERT INTO mobile_number (customer_id, number) VALUES
                                                    (1, '+94771234567'),
                                                    (1, '+94112345678'),
                                                    (2, '+94789876543'),
                                                    (3, '+94701112233'),
                                                    (4, '+94761234567'),
                                                    (5, '+94752223344'),
                                                    (5, '+94112233445');

-- Addresses  (city_id / country_id reference the inserts above)
INSERT INTO address (customer_id, address_line1, address_line2, city_id, country_id) VALUES
                                                                                         (1, '12 Temple Road',    'Dehiwala',    1, 1),   -- Colombo, Sri Lanka
                                                                                         (2, '45 Kandy Road',     NULL,          2, 1),   -- Kandy, Sri Lanka
                                                                                         (3, '78 Galle Face',     'Colpetty',    1, 1),   -- Colombo, Sri Lanka
                                                                                         (4, '22 Hill Street',    'Peradeniya',  2, 1),   -- Kandy, Sri Lanka
                                                                                         (5, '5 Marine Drive',    NULL,          5, 1);   -- Kalutara, Sri Lanka

-- Family member links (customer 1 and 2 are family; 3 and 4 are family)
INSERT INTO family_member (customer_id, family_member_id) VALUES
                                                              (1, 2),
                                                              (2, 1),
                                                              (3, 4),
                                                              (4, 3);