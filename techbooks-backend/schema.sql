-- 1. Table for Dynamic Popup Notices / Announcements
CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT 1, -- 1 = Show popup, 0 = Hide popup
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table for the Dynamic Service Splitter Layout (Renamed to match API)
CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    engine_type TEXT CHECK(engine_type IN ('enterprise', 'local')) NOT NULL, -- Groups into left or right engine
    service_name TEXT NOT NULL,     -- e.g., 'Wings Trade' or 'Website Development'
    description TEXT NOT NULL,      -- Description of the software/service
    sort_order INTEGER DEFAULT 0    -- Controls which item appears first
);

-- 3. Simple Admin Authentication Table (For Securing your Admin Panel Dashboard)
CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL, -- Securely hashed string
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- SEED DATA (Pre-populating your website with your real services)
-- ==========================================

-- Add an initial notice/announcement
INSERT INTO announcements (title, content, is_active) 
VALUES ('Welcome to Tech Books Solutions', 'Explore our authorized Wings ERP implementations alongside expert web development services.', 1);

-- Populate Enterprise Engine (Wings ERP Suite)
INSERT INTO services (engine_type, service_name, description, sort_order) VALUES 
('enterprise', 'Wings Trade', 'Powerful, comprehensive distribution and trading logistics specialized for the FMCG and retail sectors.', 1),
('enterprise', 'Wings Book', 'Advanced multi-branch inventory tracking and robust accounting tailored for modern SMEs.', 2),
('enterprise', 'Wings Auto', 'Custom specialized operations management for automobile dealerships and service tracking.', 3),
('enterprise', 'Wings Electronics & Appliances', 'Targeted retail POS workflows and serial-number inventory control for consumer goods.', 4);

-- Populate Local Services Engine
INSERT INTO services (engine_type, service_name, description, sort_order) VALUES 
('local', 'Website Development & Design', 'Building responsive, modern, high-converting dynamic web applications and corporate ecosystems.', 1),
('local', 'Advertising Content Creation', 'Strategic multimedia assets and customized marketing materials built completely from scratch.', 2),
('local', 'Computer Hardware & Accessories', 'Reliable supply lines for essential enterprise hardware components and corporate technical scaling.', 3),
('local', 'Comprehensive Tech Support', 'On-demand remote and localized troubleshooting for data networking, computers, and peripheral arrays.', 4);