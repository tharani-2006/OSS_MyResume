# Network Automation Toolkit

A comprehensive enterprise network automation platform designed for Cisco devices with support for automated device discovery, configuration management, and monitoring.

## Features

- **Device Discovery**: Automatically discover network devices using SNMP and CDP
- **Configuration Backup**: Automated backup of device configurations
- **Bulk Deployment**: Deploy configurations to multiple devices simultaneously
- **Health Monitoring**: Real-time monitoring of device health and performance
- **Compliance Auditing**: Ensure devices comply with security policies

## Technologies

- Python 3.9+
- NETCONF/YANG
- SNMP
- SSH/Telnet
- Cisco IOS
- Flask (Web Interface)
- SQLite (Database)

## Installation

```bash
cd network-automation
pip install -r requirements.txt
python app.py
```

## Usage

1. Start the web interface: `python app.py`
2. Access the dashboard at `http://localhost:5000`
3. Add network devices in the inventory
4. Run discovery and automation tasks

## Project Structure

```
network-automation/
├── app.py                 # Main Flask application
├── device_discovery.py    # SNMP device discovery
├── config_backup.py       # Configuration backup utilities
├── bulk_deployment.py     # Bulk configuration deployment
├── health_monitor.py      # Device health monitoring
├── compliance_checker.py  # Security compliance auditing
├── templates/             # Web interface templates
├── static/               # CSS, JS files
├── configs/              # Stored configurations
└── requirements.txt      # Python dependencies
```

## Configuration

Edit `config.py` to set up your network parameters:

```python
SNMP_COMMUNITY = "your_community_string"
SSH_USERNAME = "admin"
SSH_PASSWORD = "password"
DEVICE_RANGES = ["192.168.1.0/24", "10.0.0.0/24"]
```

## License

MIT License - See LICENSE file for details
