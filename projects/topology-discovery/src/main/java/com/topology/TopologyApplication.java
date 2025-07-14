package com.topology;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Main Spring Boot application for Network Topology Discovery Engine
 * 
 * This application provides:
 * - Network device discovery using SNMP, LLDP, and CDP
 * - Real-time topology mapping and visualization
 * - Network monitoring and analytics
 * - REST API for topology data access
 * - WebSocket support for real-time updates
 * 
 * @author Siva Reddy Venna
 * @version 1.0.0
 */
@SpringBootApplication
@EnableAsync
@EnableScheduling
public class TopologyApplication {

    public static void main(String[] args) {
        System.out.println("=================================================");
        System.out.println("  Network Topology Discovery Engine v1.0.0");
        System.out.println("  Intelligent network mapping and monitoring");
        System.out.println("=================================================");
        
        SpringApplication.run(TopologyApplication.class, args);
        
        System.out.println("\n🌐 Application started successfully!");
        System.out.println("📡 Web Interface: http://localhost:8080");
        System.out.println("📚 API Documentation: http://localhost:8080/swagger-ui.html");
        System.out.println("🔌 WebSocket Endpoint: ws://localhost:8080/topology-updates");
    }
}
