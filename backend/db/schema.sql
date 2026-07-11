-- Drop existing tables (safe for development)
DROP TABLE IF EXISTS cart CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS prod_category CASCADE;

-- Categories
CREATE TABLE prod_category (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category VARCHAR(30) NOT NULL UNIQUE
);

-- Products
CREATE TABLE products (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category_id INTEGER,
    price NUMERIC(7,2) DEFAULT 0.00 CHECK (price >= 0.00),
    image_path TEXT,

    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id)
        REFERENCES prod_category(id)
        ON DELETE SET NULL
);

-- Cart
CREATE TABLE cart (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    entry_id INTEGER NOT NULL UNIQUE,

    CONSTRAINT cart_entry_id_fkey
        FOREIGN KEY (entry_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);