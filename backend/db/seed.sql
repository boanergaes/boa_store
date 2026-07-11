-- Reset database
TRUNCATE TABLE cart, products, prod_category
RESTART IDENTITY CASCADE;

-- Categories
INSERT INTO prod_category (category)
VALUES
    ('Electronics'),
    ('Books'),
    ('Clothing'),
    ('Home & Kitchen'),
    ('Sports'),
    ('Accessories');

-- Products
INSERT INTO products (name, category_id, price, image_path)
VALUES
    ('Wireless Mouse',           1,  799.99, NULL),
    ('Mechanical Keyboard',      1, 2499.99, NULL),
    ('27-inch Monitor',          1, 13999.99, NULL),
    ('USB-C Hub',                1, 1299.99, NULL),

    ('Clean Code',               2,  950.00, NULL),
    ('The Pragmatic Programmer', 2, 1100.00, NULL),
    ('Design Patterns',          2, 1400.00, NULL),
    ('Introduction to Algorithms', 2, 3200.00, NULL),

    ('Hoodie',                   3, 1599.99, NULL),
    ('Jeans',                    3, 1899.99, NULL),
    ('Sneakers',                 3, 2999.99, NULL),

    ('Coffee Mug',               4,  250.00, NULL),
    ('Desk Lamp',                4,  899.99, NULL),
    ('Office Chair',             4, 7499.99, NULL),

    ('Football',                 5,  850.00, NULL),
    ('Yoga Mat',                 5, 1200.00, NULL),
    ('Skipping Rope',            5,  NULL, NULL),

    ('Backpack',                 6, 1800.00, NULL),
    ('Laptop Sleeve',            6,  650.00, NULL),

    -- Products without categories
    ('Gift Card',              NULL, 500.00, NULL),
    ('Mystery Box',            NULL, 999.99, NULL);

-- Cart
-- INSERT INTO cart (entry_id)
-- VALUES
--     (1),
--     (5),
--     (9),
--     (12),
--     (20);