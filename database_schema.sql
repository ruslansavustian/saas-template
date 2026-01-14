-- =============================================
-- Database Schema for Orders & Products System
-- Generated from TypeORM Entities
-- =============================================

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- =============================================
-- ROLES TABLE
-- =============================================
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO roles (id, name, description) VALUES 
(1, 'admin', 'Administrator role'),
(2, 'user', 'Regular user role'),
(3, 'manager', 'Manager role');

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INTEGER DEFAULT 2,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);

-- =============================================
-- ORDERS TABLE
-- =============================================
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_orders_date ON orders(date);
CREATE INDEX idx_orders_deleted ON orders(deleted);

-- =============================================
-- PRODUCTS TABLE
-- =============================================
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    serial_number BIGINT NOT NULL UNIQUE,
    is_new BOOLEAN DEFAULT TRUE,
    photo TEXT,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    specification TEXT,
    guarantee JSONB,
    price JSONB NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    order_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_products_serial_number ON products(serial_number);
CREATE INDEX idx_products_type ON products(type);
CREATE INDEX idx_products_order_id ON products(order_id);
CREATE INDEX idx_products_deleted ON products(deleted);

-- =============================================
-- SAMPLE DATA
-- =============================================

-- Insert sample users
INSERT INTO users (name, email, password, role_id) VALUES 
('Admin User', 'admin@example.com', '$2b$10$hashedpassword1', 1),
('Manager User', 'manager@example.com', '$2b$10$hashedpassword2', 3),
('Regular User', 'user@example.com', '$2b$10$hashedpassword3', 2);

-- Insert sample orders
INSERT INTO orders (title, description, date) VALUES 
('Electronics Order #1', 'Order for computer equipment', '2024-01-15 10:30:00'),
('Office Supplies #2', 'Order for office furniture and supplies', '2024-01-20 14:45:00'),
('IT Equipment #3', 'Order for servers and networking equipment', '2024-02-01 09:15:00');

-- Insert sample products
INSERT INTO products (serial_number, title, type, specification, guarantee, price, order_id) VALUES 
(1001, 'Samsung Monitor 24"', 'Монітори', '24-inch LED monitor, 1920x1080', '{"start": "2024-01-15", "end": "2026-01-15"}', '[{"value": 250, "symbol": "USD", "isDefault": true}, {"value": 9500, "symbol": "UAH", "isDefault": false}]', 1),
(1002, 'Dell Laptop XPS 13', 'Ноутбуки', '13-inch laptop, Intel i7, 16GB RAM', '{"start": "2024-01-15", "end": "2025-01-15"}', '[{"value": 1200, "symbol": "USD", "isDefault": true}, {"value": 45600, "symbol": "UAH", "isDefault": false}]', 1),
(1003, 'iPhone 15 Pro', 'Телефони', 'Latest iPhone with A17 Pro chip', '{"start": "2024-01-20", "end": "2025-01-20"}', '[{"value": 999, "symbol": "USD", "isDefault": true}, {"value": 37980, "symbol": "UAH", "isDefault": false}]', 2);

-- =============================================
-- VIEWS FOR REPORTING
-- =============================================

-- View for orders with product count
CREATE VIEW orders_with_product_count AS
SELECT 
    o.id,
    o.title,
    o.description,
    o.date,
    o.created_at,
    COUNT(p.id) as product_count,
    COALESCE(SUM(
        CASE 
            WHEN p.price::jsonb->0->>'symbol' = 'USD' 
            THEN (p.price::jsonb->0->>'value')::numeric 
            ELSE 0 
        END
    ), 0) as total_usd
FROM orders o
LEFT JOIN products p ON o.id = p.order_id AND p.deleted = FALSE
WHERE o.deleted = FALSE
GROUP BY o.id, o.title, o.description, o.date, o.created_at;

-- View for products with order information
CREATE VIEW products_with_orders AS
SELECT 
    p.id,
    p.serial_number,
    p.title,
    p.type,
    p.is_new,
    p.guarantee,
    p.price,
    p.date,
    o.title as order_title,
    o.date as order_date
FROM products p
LEFT JOIN orders o ON p.order_id = o.id
WHERE p.deleted = FALSE;

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE roles IS 'User roles and permissions';
COMMENT ON TABLE users IS 'System users with authentication';
COMMENT ON TABLE orders IS 'Purchase orders containing products';
COMMENT ON TABLE products IS 'Individual products with specifications and pricing';

COMMENT ON COLUMN products.serial_number IS 'Unique product serial number (BIGINT for large numbers)';
COMMENT ON COLUMN products.guarantee IS 'Product warranty period in JSON format';
COMMENT ON COLUMN products.price IS 'Product pricing in multiple currencies (JSON array)';
COMMENT ON COLUMN products.order_id IS 'Reference to the order this product belongs to';

-- =============================================
-- SCHEMA COMPLETE
-- =============================================
