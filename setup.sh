#!/bin/bash

# Portfolio and Project Setup Script
# Author: Venna Venkata Siva Reddy

echo "🚀 Setting up Portfolio and Library Management System..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_status "Initializing Git repository..."
    git init
    print_success "Git repository initialized"
else
    print_warning "Git repository already exists"
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    print_status "Creating .gitignore..."
    cat > .gitignore << EOL
# Dependencies
node_modules/
*/node_modules/

# Next.js
.next/
out/
*.tsbuildinfo

# Environment variables
.env
.env.local
.env.production
.env.development

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Build outputs
dist/
build/

# Database
*.db
*.sqlite
*.sqlite3

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
.venv/
EOL
    print_success "Created .gitignore"
fi

# Create README for the main portfolio
print_status "Updating main README..."
cat > README.md << EOL
# Venna Venkata Siva Reddy - Portfolio

A modern, futuristic portfolio website showcasing my backend development and cybersecurity expertise.

## 🚀 Live Demo
[View Portfolio](https://your-username.vercel.app) <!-- Update this after deployment -->

## 🛠 Features
- Modern Next.js 14 with TypeScript
- Futuristic cyber-themed design
- Responsive and mobile-first
- Smooth animations with Framer Motion
- Backend and cybersecurity focused content

## 🎯 Projects Showcased
- **Library Management System** - Advanced DBMS project with PostgreSQL
- **Secure Authentication System** - JWT-based security implementation
- **RESTful API Development** - Scalable backend architecture
- **Containerized Microservices** - Docker and deployment automation

## 🔧 Technologies
- **Frontend**: Next.js, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Python, PostgreSQL, Docker
- **Security**: JWT, bcrypt, SQL injection prevention
- **DevOps**: Docker, AWS, CI/CD pipelines

## 🚀 Quick Start

\`\`\`bash
# Clone the repository
git clone https://github.com/sivavenna/portfolio-website.git
cd portfolio-website

# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

## 📁 Project Structure
\`\`\`
├── app/                    # Next.js app directory
│   ├── components/         # React components
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── library-management-system/  # DBMS project
├── public/                # Static assets
├── tailwind.config.js     # Tailwind configuration
└── package.json          # Dependencies
\`\`\`

## 🎨 Customization
- Update personal information in \`app/components/\`
- Modify colors in \`tailwind.config.js\`
- Add your projects to \`app/components/Projects.tsx\`
- Update contact details in \`app/components/Contact.tsx\`

## 📞 Contact
- **Email**: [your.email@example.com](mailto:your.email@example.com)
- **LinkedIn**: [linkedin.com/in/sivavenna](https://linkedin.com/in/sivavenna)
- **GitHub**: [github.com/sivavenna](https://github.com/sivavenna)

## 📄 License
This project is licensed under the MIT License.
EOL

print_success "Updated main README"

# Set up the library management system as a separate project
print_status "Setting up Library Management System project structure..."

# Move to the library management directory
cd library-management-system

# Create a separate README for the library project
cat > README.md << EOL
# Library Management System

A comprehensive database management system demonstrating advanced PostgreSQL features, backend API development, and database optimization techniques.

## 🎯 Project Overview

This project showcases enterprise-level database design and management skills, including:
- Advanced database schema design and normalization
- Stored procedures and triggers implementation
- Performance optimization and indexing strategies
- Full-featured REST API with Flask/Python
- Security implementation and best practices

## 🗄️ Database Features

### Schema Design
- **Normalized database** structure (3NF)
- **Referential integrity** with foreign key constraints
- **Check constraints** for data validation
- **Audit trails** for tracking changes

### Advanced SQL Features
- **Stored Procedures** for complex business logic
- **Triggers** for automated operations
- **Views** for simplified data access
- **Indexes** for performance optimization
- **Full-text search** capabilities

### Performance Optimization
- Strategic indexing for fast queries
- Query optimization techniques
- Connection pooling and caching
- Database profiling and monitoring

## 🚀 Quick Start

### Prerequisites
- PostgreSQL 12+
- Python 3.8+
- Redis (optional, for caching)

### Database Setup
\`\`\`bash
# Create database
createdb library_management

# Run schema and data setup
psql -d library_management -f schema.sql
psql -d library_management -f functions.sql
psql -d library_management -f triggers.sql
psql -d library_management -f views.sql
psql -d library_management -f sample_data.sql
\`\`\`

### API Setup
\`\`\`bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL="postgresql://username:password@localhost/library_management"

# Run the API
python app.py
\`\`\`

## 📊 API Endpoints

### Books
- \`GET /api/books\` - List all books with pagination
- \`GET /api/books/{id}\` - Get book details
- \`POST /api/borrowings/issue\` - Issue a book
- \`PUT /api/borrowings/{id}/return\` - Return a book

### Search & Reports
- \`GET /api/search?q={term}\` - Full-text search
- \`GET /api/reports/overdue\` - Overdue books report
- \`GET /api/statistics\` - Library statistics

## 🎓 Learning Outcomes

This project demonstrates proficiency in:
- **Database Design**: Normalization, constraints, relationships
- **Advanced SQL**: Stored procedures, triggers, views, optimization
- **API Development**: RESTful design, error handling, validation
- **Security**: SQL injection prevention, input validation
- **Performance**: Indexing, caching, query optimization

## 🔧 Technologies Used
- **Database**: PostgreSQL 14
- **Backend**: Python, Flask
- **ORM**: SQLAlchemy
- **Caching**: Redis
- **Testing**: pytest
- **Documentation**: SQL comments and API docs

## 📈 Future Enhancements
- [ ] GraphQL API implementation
- [ ] Database replication setup
- [ ] Advanced analytics dashboard
- [ ] Microservices architecture
- [ ] Machine learning for book recommendations

---
**Author**: Venna Venkata Siva Reddy  
**Focus**: Backend Development & Database Management  
**Skills Demonstrated**: PostgreSQL, Python, API Development, Database Optimization
EOL

print_success "Created Library Management System README"

# Go back to main directory
cd ..

# Add all files to git
print_status "Adding files to Git..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    print_warning "No changes to commit"
else
    print_status "Committing changes..."
    git commit -m "Initial portfolio setup with Library Management System

- Modern Next.js portfolio with futuristic design
- Comprehensive Library Management System DBMS project
- Backend and cybersecurity focused content
- Ready for deployment to Vercel/Netlify"
    print_success "Changes committed successfully"
fi

# Instructions for next steps
echo ""
echo "🎉 Setup complete! Next steps:"
echo ""
echo "1. 📋 Update your personal information:"
echo "   - Edit components in app/components/"
echo "   - Update contact details and social links"
echo "   - Add your real email and phone number"
echo ""
echo "2. 🌐 Create GitHub repository:"
echo "   - Create a new repo at github.com/sivavenna/portfolio-website"
echo "   - Run: git remote add origin https://github.com/sivavenna/portfolio-website.git"
echo "   - Run: git push -u origin main"
echo ""
echo "3. 🚀 Deploy your portfolio:"
echo "   - Go to vercel.com and import your GitHub repo"
echo "   - Or follow instructions in DEPLOYMENT.md"
echo ""
echo "4. 📚 Set up Library Management System:"
echo "   - Create separate repo for the database project"
echo "   - Follow README in library-management-system/"
echo ""
echo "🔗 Your portfolio will be live at: https://your-username.vercel.app"
echo ""
print_success "Portfolio is ready to showcase your backend and database skills!"
EOL
