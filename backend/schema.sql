CREATE TABLE outlets (
    outlet_id SERIAL PRIMARY KEY,
    outlet_name VARCHAR(100) NOT NULL,
    owner_name VARCHAR(100),
    phone VARCHAR(15),
    email VARCHAR(100),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    opening_date DATE,
    status VARCHAR(20) DEFAULT 'Active'
);
CREATE TABLE staff (
    staff_id SERIAL PRIMARY KEY,
    outlet_id INT REFERENCES outlets(outlet_id),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role VARCHAR(50),
    salary DECIMAL(10,2),
    phone VARCHAR(15),
    email VARCHAR(100),
    hire_date DATE,
    status VARCHAR(20) DEFAULT 'Active'
);
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(15),
    email VARCHAR(100),
    loyalty_points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(100),
    category VARCHAR(50),
    price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'Available'
);
CREATE TABLE inventory (
    inventory_id SERIAL PRIMARY KEY,
    outlet_id INT REFERENCES outlets(outlet_id),
    product_id INT REFERENCES products(product_id),
    quantity INT,
    reorder_level INT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE sales (
    sale_id SERIAL PRIMARY KEY,
    outlet_id INT REFERENCES outlets(outlet_id),
    customer_id INT REFERENCES customers(customer_id),
    staff_id INT REFERENCES staff(staff_id),
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2),
    payment_method VARCHAR(30)
);
CREATE TABLE sales_items (
    sales_item_id SERIAL PRIMARY KEY,
    sale_id INT REFERENCES sales(sale_id),
    product_id INT REFERENCES products(product_id),
    quantity INT,
    price DECIMAL(10,2),
    subtotal DECIMAL(10,2)
);
CREATE TABLE suppliers (
    supplier_id SERIAL PRIMARY KEY,
    supplier_name VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT
);
CREATE TABLE purchase_orders (
    purchase_order_id SERIAL PRIMARY KEY,
    supplier_id INT REFERENCES suppliers(supplier_id),
    outlet_id INT REFERENCES outlets(outlet_id),
    order_date DATE,
    status VARCHAR(30),
    total_amount DECIMAL(10,2)
);
CREATE TABLE purchase_order_items (
    purchase_order_item_id SERIAL PRIMARY KEY,
    purchase_order_id INT REFERENCES purchase_orders(purchase_order_id),
    product_id INT REFERENCES products(product_id),
    quantity INT,
    unit_price DECIMAL(10,2)
);
CREATE TABLE marketing_campaigns (
    campaign_id SERIAL PRIMARY KEY,
    campaign_name VARCHAR(100),
    start_date DATE,
    end_date DATE,
    budget DECIMAL(10,2),
    status VARCHAR(30)
);
CREATE TABLE audits (
    audit_id SERIAL PRIMARY KEY,
    outlet_id INT REFERENCES outlets(outlet_id),
    audit_date DATE,
    score INT,
    remarks TEXT
);
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    outlet_id INT REFERENCES outlets(outlet_id),
    message TEXT,
    notification_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20)
);
CREATE TABLE feedback (
    feedback_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(customer_id),
    outlet_id INT REFERENCES outlets(outlet_id),
    rating INT CHECK(rating BETWEEN 1 AND 5),
    comments TEXT,
    feedback_date DATE
);
CREATE TABLE expenses (
    expense_id SERIAL PRIMARY KEY,
    outlet_id INT REFERENCES outlets(outlet_id),
    expense_type VARCHAR(100),
    amount DECIMAL(10,2),
    expense_date DATE,
    description TEXT
);
CREATE TABLE ai_predictions (
    prediction_id SERIAL PRIMARY KEY,
    outlet_id INT REFERENCES outlets(outlet_id),
    prediction_type VARCHAR(100),
    predicted_value DECIMAL(12,2),
    confidence DECIMAL(5,2),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);