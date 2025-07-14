# Network Topology Discovery Engine

An intelligent network topology mapper that uses SNMP, LLDP, and CDP protocols to create real-time interactive network diagrams and monitor device relationships.

## Features

- **Multi-Protocol Discovery**: SNMP, LLDP, CDP, and ARP-based discovery
- **Interactive Topology Maps**: Web-based interactive network diagrams
- **Real-time Monitoring**: Live updates of network topology changes
- **Link Utilization Tracking**: Monitor bandwidth usage on network links
- **Device Relationship Mapping**: Understand physical and logical connections
- **Predictive Analysis**: Early warning system for potential network issues
- **Export Capabilities**: Export topology data to various formats (JSON, GraphML, SVG)

## Technologies

- Java 17+
- Spring Boot 3.1+
- SNMP4J (SNMP protocol handling)
- H2/PostgreSQL Database
- React.js (Frontend)
- D3.js (Network visualization)
- WebSocket (Real-time updates)
- Maven (Build tool)

## Project Structure

```
topology-discovery/
├── src/main/java/
│   ├── com/topology/
│   │   ├── TopologyApplication.java
│   │   ├── controller/
│   │   │   ├── TopologyController.java
│   │   │   └── DiscoveryController.java
│   │   ├── service/
│   │   │   ├── SnmpDiscoveryService.java
│   │   │   ├── LldpService.java
│   │   │   ├── CdpService.java
│   │   │   └── TopologyMapperService.java
│   │   ├── model/
│   │   │   ├── NetworkDevice.java
│   │   │   ├── NetworkLink.java
│   │   │   └── TopologyGraph.java
│   │   └── config/
│   │       └── WebSocketConfig.java
├── src/main/resources/
│   ├── application.yml
│   └── static/
│       ├── js/
│       │   ├── topology-viewer.js
│       │   └── network-monitor.js
│       └── css/
│           └── topology.css
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TopologyViewer.jsx
│   │   │   ├── DeviceDetails.jsx
│   │   │   └── NetworkStats.jsx
│   │   └── services/
│   │       └── topology-api.js
├── pom.xml
└── README.md
```

## Installation & Setup

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- Node.js 16+ (for frontend)

### Backend Setup
```bash
cd topology-discovery
mvn clean install
mvn spring-boot:run
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Access
- Backend API: http://localhost:8080
- Frontend UI: http://localhost:3000
- API Documentation: http://localhost:8080/swagger-ui.html

## Configuration

Edit `src/main/resources/application.yml`:

```yaml
topology:
  discovery:
    snmp:
      community: public
      timeout: 5000
      retries: 2
    networks:
      - "192.168.1.0/24"
      - "10.0.0.0/24"
    protocols:
      enabled: [SNMP, LLDP, CDP, ARP]
    
database:
  type: h2  # or postgresql
  
websocket:
  endpoint: /topology-updates
```

## API Endpoints

- `GET /api/topology` - Get current network topology
- `POST /api/discovery/start` - Start network discovery
- `GET /api/devices` - List all discovered devices
- `GET /api/devices/{id}/neighbors` - Get device neighbors
- `GET /api/links` - Get all network links
- `GET /api/stats/utilization` - Get link utilization data
- `WebSocket /topology-updates` - Real-time topology updates

## Features in Detail

### Network Discovery
- Automated SNMP scanning of configured network ranges
- LLDP neighbor discovery for detailed device relationships
- CDP protocol support for Cisco device networks
- ARP table analysis for Layer 2 connectivity mapping

### Visualization
- Interactive network topology maps using D3.js
- Drag-and-drop interface for manual topology adjustments
- Color-coded devices based on type, status, or utilization
- Hierarchical layouts (tree, force-directed, circular)

### Monitoring
- Real-time link utilization monitoring
- Device status tracking (up/down, reachable/unreachable)
- Interface status and statistics
- Historical data collection and trending

### Analytics
- Network path analysis
- Redundancy identification
- Single points of failure detection
- Capacity planning recommendations

## License

MIT License - See LICENSE file for details
