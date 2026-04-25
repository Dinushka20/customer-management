-- ============================================================
-- Customer Management System - DML (Seed / Master Data)
-- ============================================================

-- ------------------------------------------------------------
-- Countries (master data)
-- ------------------------------------------------------------
INSERT IGNORE INTO country (id, name) VALUES
                                (1, 'Sri Lanka'),
                                (2, 'India'),
                                (3, 'United Kingdom'),
                                (4, 'United States'),
                                (5, 'Australia'),
                                (6, 'Canada'),
                                (7, 'Germany'),
                                (8, 'Singapore');

-- ------------------------------------------------------------
-- Cities (master data)
-- ------------------------------------------------------------
INSERT IGNORE INTO city (id, name, country_id) VALUES
                                         -- Sri Lanka (id=1)
                                         (1, 'Colombo',       1),
                                         (2, 'Kandy',         1),
                                         (3, 'Galle',         1),
                                         (4, 'Negombo',       1),
                                         (5, 'Kalutara',      1),
                                         (6, 'Matara',        1),
                                         (7, 'Jaffna',        1),
                                         (8, 'Kurunegala',    1),

                                         -- India (id=2)
                                         (9,  'Mumbai',        2),
                                         (10, 'Delhi',         2),
                                         (11, 'Bangalore',     2),
                                         (12, 'Chennai',       2),

                                         -- United Kingdom (id=3)
                                         (13, 'London',        3),
                                         (14, 'Manchester',    3),
                                         (15, 'Birmingham',    3),

                                         -- United States (id=4)
                                         (16, 'New York',      4),
                                         (17, 'Los Angeles',   4),
                                         (18, 'Chicago',       4),

                                         -- Australia (id=5)
                                         (19, 'Sydney',        5),
                                         (20, 'Melbourne',     5),

                                         -- Canada (id=6)
                                         (21, 'Toronto',       6),
                                         (22, 'Vancouver',     6),

                                         -- Germany (id=7)
                                         (23, 'Berlin',        7),
                                         (24, 'Munich',        7),

                                         -- Singapore (id=8)
                                         (25, 'Singapore',     8);

-- End of Master Data. Sample customers have been intentionally excluded.