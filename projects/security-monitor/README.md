# Network Security Compliance Monitor

An automated security auditing and compliance monitoring system for enterprise networks. Performs vulnerability assessments, ACL validation, security policy enforcement, and generates detailed compliance reports.

## Features

- **Vulnerability Scanning**: Automated network vulnerability assessment using Nmap and OpenVAS
- **Compliance Monitoring**: SOC 2, ISO 27001, NIST framework compliance checking
- **ACL Validation**: Firewall and router ACL policy verification
- **Security Policy Enforcement**: Automated security configuration validation
- **Real-time Alerting**: Immediate notifications for security violations
- **Compliance Reporting**: Detailed reports for auditors and compliance teams
- **Remediation Guidance**: Automated recommendations for security improvements

## Technologies

- Python 3.9+
- FastAPI (REST API framework)
- Nmap (Network scanning)
- OpenVAS Python library
- Celery (Async task processing)
- Redis (Task queue and caching)
- PostgreSQL (Database)
- React.js (Frontend dashboard)
- Docker & Docker Compose

## Project Structure

```
security-monitor/
├── app/
│   ├── main.py                    # FastAPI main application
│   ├── api/
│   │   ├── endpoints/
│   │   │   ├── scans.py          # Vulnerability scan endpoints
│   │   │   ├── compliance.py     # Compliance check endpoints
│   │   │   ├── reports.py        # Report generation endpoints
│   │   │   └── policies.py       # Security policy endpoints
│   │   └── dependencies.py       # API dependencies
│   ├── core/
│   │   ├── config.py             # Application configuration
│   │   ├── security.py           # Security utilities
│   │   └── database.py           # Database connection
│   ├── models/
│   │   ├── scan_results.py       # Scan result models
│   │   ├── compliance.py         # Compliance models
│   │   └── policies.py           # Policy models
│   ├── services/
│   │   ├── scanner/
│   │   │   ├── nmap_scanner.py   # Nmap integration
│   │   │   ├── openvas_scanner.py # OpenVAS integration
│   │   │   └── vulnerability_db.py # CVE database
│   │   ├── compliance/
│   │   │   ├── soc2_checker.py   # SOC 2 compliance
│   │   │   ├── iso27001_checker.py # ISO 27001 compliance
│   │   │   └── nist_checker.py   # NIST framework
│   │   ├── policy/
│   │   │   ├── acl_validator.py  # ACL validation
│   │   │   ├── config_checker.py # Configuration validation
│   │   │   └── baseline_checker.py # Security baseline
│   │   └── reporting/
│   │       ├── report_generator.py # Report generation
│   │       └── notification.py   # Alert notifications
│   └── workers/
│       ├── scan_worker.py        # Async scan processing
│       └── compliance_worker.py  # Compliance checking
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx     # Main dashboard
│   │   │   ├── ScanResults.jsx   # Vulnerability results
│   │   │   ├── ComplianceView.jsx # Compliance status
│   │   │   └── Reports.jsx       # Report viewer
│   │   └── services/
│   │       └── api.js            # API client
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── postgres/
│       └── init.sql
├── tests/
├── requirements.txt
├── pyproject.toml
└── README.md
```

## Installation & Setup

### Using Docker (Recommended)
```bash
cd security-monitor
docker-compose up -d
```

### Manual Installation
```bash
# Backend
cd security-monitor
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Database setup
psql -U postgres -c "CREATE DATABASE security_monitor;"
alembic upgrade head

# Start services
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
celery -A app.workers.scan_worker worker --loglevel=info

# Frontend
cd frontend
npm install
npm start
```

### Access Points
- Web Dashboard: http://localhost:3000
- API Documentation: http://localhost:8000/docs
- Admin Panel: http://localhost:8000/admin

## Configuration

Edit `app/core/config.py` or set environment variables:

```python
# Database
DATABASE_URL = "postgresql://user:password@localhost/security_monitor"

# Redis (for Celery)
REDIS_URL = "redis://localhost:6379"

# Scanning Configuration
NMAP_TIMEOUT = 300
OPENVAS_HOST = "localhost"
OPENVAS_PORT = 9390

# Compliance Frameworks
ENABLED_FRAMEWORKS = ["SOC2", "ISO27001", "NIST"]

# Notifications
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
ALERT_EMAIL = "security@company.com"

# Security
SECRET_KEY = "your-secret-key-here"
API_KEY_EXPIRY = 30  # days
```

## API Endpoints

### Vulnerability Scanning
- `POST /api/scans/` - Start new vulnerability scan
- `GET /api/scans/{scan_id}` - Get scan results
- `GET /api/scans/` - List all scans
- `DELETE /api/scans/{scan_id}` - Delete scan results

### Compliance Checking
- `POST /api/compliance/check` - Run compliance assessment
- `GET /api/compliance/status` - Get compliance status
- `GET /api/compliance/frameworks` - List supported frameworks
- `GET /api/compliance/history` - Compliance check history

### Policy Management
- `GET /api/policies/` - List security policies
- `POST /api/policies/` - Create new policy
- `PUT /api/policies/{policy_id}` - Update policy
- `POST /api/policies/{policy_id}/validate` - Validate policy compliance

### Reporting
- `GET /api/reports/` - List available reports
- `POST /api/reports/generate` - Generate new report
- `GET /api/reports/{report_id}/download` - Download report

## Features in Detail

### Vulnerability Scanning
- **Network Discovery**: Automated host and service discovery
- **Port Scanning**: Comprehensive port and service enumeration
- **Vulnerability Detection**: CVE-based vulnerability identification
- **Risk Assessment**: CVSS scoring and risk prioritization
- **Custom Scripts**: Nmap NSE script integration

### Compliance Monitoring
- **SOC 2 Type II**: Security, availability, confidentiality controls
- **ISO 27001**: Information security management system compliance
- **NIST Cybersecurity Framework**: Identify, protect, detect, respond, recover
- **Custom Frameworks**: Support for organization-specific requirements

### Security Policy Validation
- **Firewall Rules**: ACL analysis and validation
- **Configuration Baselines**: Security configuration checking
- **Password Policies**: Password strength and policy enforcement
- **Access Controls**: User access and privilege validation
- **Encryption Standards**: Data encryption compliance verification

### Automated Remediation
- **Remediation Workflows**: Step-by-step fix procedures
- **Configuration Templates**: Secure configuration examples
- **Patch Management**: Vulnerability patch recommendations
- **Security Hardening**: System hardening guidelines

## Sample Usage

### Python API Client
```python
import requests

# Start vulnerability scan
response = requests.post("http://localhost:8000/api/scans/", 
    json={
        "target": "192.168.1.0/24",
        "scan_type": "comprehensive",
        "frameworks": ["nmap", "openvas"]
    })
scan_id = response.json()["scan_id"]

# Check scan status
status = requests.get(f"http://localhost:8000/api/scans/{scan_id}")
print(f"Scan status: {status.json()['status']}")

# Run compliance check
compliance = requests.post("http://localhost:8000/api/compliance/check",
    json={
        "framework": "SOC2",
        "scope": ["network", "systems", "applications"]
    })
```

### CLI Usage
```bash
# Quick vulnerability scan
python -m app.cli scan --target 192.168.1.0/24 --output json

# Compliance assessment
python -m app.cli compliance --framework SOC2 --generate-report

# Policy validation
python -m app.cli validate --policy-file security_policies.yaml
```

## Compliance Frameworks

### SOC 2 Type II Controls
- CC1: Control Environment
- CC2: Communication and Information
- CC3: Risk Assessment
- CC4: Monitoring Activities
- CC5: Control Activities
- Security: Protection against unauthorized access
- Availability: System availability for operation and use
- Confidentiality: Information designated as confidential

### ISO 27001:2013 Controls
- A.5: Information Security Policies
- A.6: Organization of Information Security
- A.7: Human Resource Security
- A.8: Asset Management
- A.9: Access Control
- A.10: Cryptography
- A.11: Physical and Environmental Security
- A.12: Operations Security
- A.13: Communications Security
- A.14: System Acquisition, Development and Maintenance
- A.15: Supplier Relationships
- A.16: Information Security Incident Management
- A.17: Information Security Aspects of Business Continuity Management
- A.18: Compliance

### NIST Cybersecurity Framework
- **Identify**: Asset management, risk assessment, governance
- **Protect**: Access control, data security, training
- **Detect**: Anomaly detection, continuous monitoring
- **Respond**: Response planning, incident analysis
- **Recover**: Recovery planning, improvements

## License

MIT License - See LICENSE file for details
