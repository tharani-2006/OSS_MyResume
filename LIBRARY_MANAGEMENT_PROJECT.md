# Library Management System Database

A comprehensive database management system for a library that demonstrates advanced DBMS concepts, optimization techniques, and real-world database operations.

## Project Overview

This project showcases database design, normalization, indexing, stored procedures, triggers, and performance optimization using PostgreSQL.

## Features

### Core Functionality
- **Book Management**: Add, update, delete books with multiple copies
- **Member Management**: Student and faculty member registration
- **Borrowing System**: Check-in/check-out with due dates and fines
- **Reservation System**: Book reservation queue
- **Fine Management**: Automated fine calculation and payment tracking
- **Reporting**: Various reports for library analytics

### Advanced Database Features
- **Normalization**: Properly normalized schema (3NF)
- **Indexing**: Strategic indexes for performance optimization
- **Stored Procedures**: Complex business logic implementation
- **Triggers**: Automated operations and data integrity
- **Views**: Simplified data access for reports
- **Transactions**: ACID compliance for critical operations
- **Security**: Role-based access control

## Database Schema

### Core Tables
```sql
-- Authors table
CREATE TABLE authors (
    author_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_date DATE,
    nationality VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books table
CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    isbn VARCHAR(13) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    publication_year INTEGER,
    publisher VARCHAR(100),
    edition VARCHAR(50),
    total_copies INTEGER DEFAULT 1,
    available_copies INTEGER DEFAULT 1,
    category_id INTEGER REFERENCES categories(category_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Book_Authors junction table (many-to-many)
CREATE TABLE book_authors (
    book_id INTEGER REFERENCES books(book_id) ON DELETE CASCADE,
    author_id INTEGER REFERENCES authors(author_id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, author_id)
);

-- Members table
CREATE TABLE members (
    member_id SERIAL PRIMARY KEY,
    member_type VARCHAR(20) CHECK (member_type IN ('student', 'faculty', 'staff')),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    address TEXT,
    registration_date DATE DEFAULT CURRENT_DATE,
    membership_expiry DATE NOT NULL,
    max_books_allowed INTEGER DEFAULT 3,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Borrowings table
CREATE TABLE borrowings (
    borrowing_id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(member_id),
    book_id INTEGER REFERENCES books(book_id),
    borrowed_date DATE DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    returned_date DATE,
    fine_amount DECIMAL(8,2) DEFAULT 0.00,
    is_returned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reservations table
CREATE TABLE reservations (
    reservation_id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(member_id),
    book_id INTEGER REFERENCES books(book_id),
    reservation_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE NOT NULL,
    is_fulfilled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fines table
CREATE TABLE fines (
    fine_id SERIAL PRIMARY KEY,
    borrowing_id INTEGER REFERENCES borrowings(borrowing_id),
    fine_amount DECIMAL(8,2) NOT NULL,
    fine_reason VARCHAR(100),
    is_paid BOOLEAN DEFAULT FALSE,
    payment_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Advanced Database Features Implementation

### 1. Indexes for Performance
```sql
-- Composite index for borrowing queries
CREATE INDEX idx_borrowings_member_status ON borrowings(member_id, is_returned);

-- Index for book search
CREATE INDEX idx_books_title_gin ON books USING gin(to_tsvector('english', title));

-- Index for due date queries
CREATE INDEX idx_borrowings_due_date ON borrowings(due_date) WHERE is_returned = FALSE;
```

### 2. Stored Procedures
```sql
-- Procedure to issue a book
CREATE OR REPLACE FUNCTION issue_book(
    p_member_id INTEGER,
    p_book_id INTEGER,
    p_days INTEGER DEFAULT 14
) RETURNS BOOLEAN AS $$
DECLARE
    available_count INTEGER;
    current_books INTEGER;
    max_allowed INTEGER;
BEGIN
    -- Check book availability
    SELECT available_copies INTO available_count 
    FROM books WHERE book_id = p_book_id;
    
    IF available_count <= 0 THEN
        RAISE EXCEPTION 'Book not available';
    END IF;
    
    -- Check member's current borrowed books
    SELECT COUNT(*), m.max_books_allowed 
    INTO current_books, max_allowed
    FROM borrowings b
    JOIN members m ON m.member_id = p_member_id
    WHERE b.member_id = p_member_id AND b.is_returned = FALSE
    GROUP BY m.max_books_allowed;
    
    IF current_books >= max_allowed THEN
        RAISE EXCEPTION 'Member has reached maximum book limit';
    END IF;
    
    -- Issue the book
    INSERT INTO borrowings (member_id, book_id, due_date)
    VALUES (p_member_id, p_book_id, CURRENT_DATE + p_days);
    
    -- Update available copies
    UPDATE books 
    SET available_copies = available_copies - 1 
    WHERE book_id = p_book_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
```

### 3. Triggers
```sql
-- Trigger to automatically calculate fines
CREATE OR REPLACE FUNCTION calculate_fine()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.returned_date IS NOT NULL AND OLD.returned_date IS NULL THEN
        IF NEW.returned_date > NEW.due_date THEN
            NEW.fine_amount := (NEW.returned_date - NEW.due_date) * 1.00; -- $1 per day
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER fine_calculation_trigger
    BEFORE UPDATE ON borrowings
    FOR EACH ROW
    EXECUTE FUNCTION calculate_fine();
```

### 4. Views for Reporting
```sql
-- View for overdue books
CREATE VIEW overdue_books AS
SELECT 
    b.borrowing_id,
    m.first_name || ' ' || m.last_name AS member_name,
    bk.title AS book_title,
    b.due_date,
    CURRENT_DATE - b.due_date AS days_overdue,
    (CURRENT_DATE - b.due_date) * 1.00 AS calculated_fine
FROM borrowings b
JOIN members m ON b.member_id = m.member_id
JOIN books bk ON b.book_id = bk.book_id
WHERE b.is_returned = FALSE 
AND b.due_date < CURRENT_DATE;
```

## Installation & Setup

### Prerequisites
- PostgreSQL 12+
- Python 3.8+ (for backend API)
- Git

### Database Setup
```bash
# Create database
createdb library_management

# Run schema creation
psql -d library_management -f schema.sql

# Insert sample data
psql -d library_management -f sample_data.sql

# Create indexes
psql -d library_management -f indexes.sql
```

### Backend API Setup
```bash
# Clone repository
git clone <your-repo-url>
cd library-management-system

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL="postgresql://username:password@localhost/library_management"

# Run the application
python app.py
```

## API Endpoints

### Books
- `GET /api/books` - List all books with pagination
- `GET /api/books/{id}` - Get book details
- `POST /api/books` - Add new book
- `PUT /api/books/{id}` - Update book
- `DELETE /api/books/{id}` - Delete book

### Members
- `GET /api/members` - List all members
- `POST /api/members` - Register new member
- `GET /api/members/{id}/borrowed` - Get member's borrowed books

### Borrowings
- `POST /api/borrowings/issue` - Issue a book
- `PUT /api/borrowings/{id}/return` - Return a book
- `GET /api/borrowings/overdue` - Get overdue books

## Performance Optimizations

### Query Optimization
- Strategic indexing on frequently queried columns
- Composite indexes for multi-column queries
- Full-text search using PostgreSQL GIN indexes

### Database Design
- Proper normalization to reduce redundancy
- Efficient foreign key relationships
- Optimized data types for storage efficiency

### Caching Strategy
- Redis caching for frequently accessed book information
- Query result caching for reports
- Session management for user authentication

## Testing

### Database Testing
```bash
# Run database tests
python -m pytest tests/test_database.py

# Performance testing
python scripts/performance_test.py

# Data integrity tests
python scripts/integrity_test.py
```

## Key Learning Outcomes

### Database Design
- ✅ Normalization principles (1NF, 2NF, 3NF)
- ✅ Entity-Relationship modeling
- ✅ Index design and optimization
- ✅ Constraint implementation

### Advanced SQL
- ✅ Complex JOINs and subqueries
- ✅ Window functions and CTEs
- ✅ Stored procedures and functions
- ✅ Triggers and event handling

### Performance Optimization
- ✅ Query optimization techniques
- ✅ Index strategy and analysis
- ✅ Database profiling and monitoring
- ✅ Caching implementation

### Security
- ✅ SQL injection prevention
- ✅ Role-based access control
- ✅ Data encryption and hashing
- ✅ Audit trails and logging

## Technologies Used

- **Database**: PostgreSQL 14
- **Backend**: Python, Flask/FastAPI
- **ORM**: SQLAlchemy
- **Caching**: Redis
- **Testing**: pytest
- **Documentation**: PostgreSQL documentation tools

## Future Enhancements

- [ ] GraphQL API implementation
- [ ] Database replication setup
- [ ] Advanced analytics dashboard
- [ ] Mobile app integration
- [ ] Microservices architecture

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**This project demonstrates comprehensive DBMS knowledge including:**
- Database design and normalization
- Performance optimization
- Advanced SQL features
- Security implementation
- Real-world application scenarios
