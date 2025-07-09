-- Initialize multiple databases for microservices
-- This script runs when PostgreSQL container starts

-- Create databases for each microservice
CREATE DATABASE user_db;
CREATE DATABASE product_db;
CREATE DATABASE order_db;
CREATE DATABASE notification_db;

-- Grant permissions to the user
GRANT ALL PRIVILEGES ON DATABASE user_db TO ecommerce_user;
GRANT ALL PRIVILEGES ON DATABASE product_db TO ecommerce_user;
GRANT ALL PRIVILEGES ON DATABASE order_db TO ecommerce_user;
GRANT ALL PRIVILEGES ON DATABASE notification_db TO ecommerce_user;

-- Switch to each database and ensure the user has proper permissions
\c user_db;
GRANT ALL ON SCHEMA public TO ecommerce_user;

\c product_db;
GRANT ALL ON SCHEMA public TO ecommerce_user;

\c order_db;
GRANT ALL ON SCHEMA public TO ecommerce_user;

\c notification_db;
GRANT ALL ON SCHEMA public TO ecommerce_user;
