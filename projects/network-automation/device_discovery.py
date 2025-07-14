#!/usr/bin/env python3
"""
Network Device Discovery Module
Discovers network devices using SNMP and CDP protocols
"""

import socket
import subprocess
import ipaddress
from concurrent.futures import ThreadPoolExecutor, as_completed
from pysnmp.hlapi import *
import json
from datetime import datetime

class NetworkDiscovery:
    def __init__(self, community="public", timeout=2, retries=1):
        self.community = community
        self.timeout = timeout
        self.retries = retries
        self.discovered_devices = []

    def ping_sweep(self, network):
        """Perform ping sweep to find active hosts"""
        active_hosts = []
        network_obj = ipaddress.ip_network(network, strict=False)
        
        def ping_host(ip):
            try:
                # Ping command varies by OS
                import platform
                if platform.system().lower() == "windows":
                    cmd = ["ping", "-n", "1", "-w", "1000", str(ip)]
                else:
                    cmd = ["ping", "-c", "1", "-W", "1", str(ip)]
                
                result = subprocess.run(cmd, capture_output=True, text=True)
                if result.returncode == 0:
                    return str(ip)
            except Exception:
                pass
            return None

        # Use ThreadPoolExecutor for concurrent pings
        with ThreadPoolExecutor(max_workers=50) as executor:
            future_to_ip = {executor.submit(ping_host, ip): ip for ip in network_obj.hosts()}
            
            for future in as_completed(future_to_ip):
                result = future.result()
                if result:
                    active_hosts.append(result)
                    print(f"Active host found: {result}")

        return active_hosts

    def snmp_query(self, target, oid):
        """Query SNMP OID from target device"""
        try:
            for (errorIndication, errorStatus, errorIndex, varBinds) in nextCmd(
                SnmpEngine(),
                CommunityData(self.community),
                UdpTransportTarget((target, 161), timeout=self.timeout, retries=self.retries),
                ContextData(),
                ObjectType(ObjectIdentity(oid)),
                lexicographicMode=False):

                if errorIndication:
                    break
                elif errorStatus:
                    break
                else:
                    for varBind in varBinds:
                        return str(varBind[1])
        except Exception as e:
            return None

    def get_device_info(self, ip):
        """Get comprehensive device information via SNMP"""
        device_info = {
            'ip': ip,
            'hostname': None,
            'description': None,
            'vendor': None,
            'model': None,
            'os_version': None,
            'uptime': None,
            'interfaces': [],
            'discovered_at': datetime.now().isoformat()
        }

        # Standard SNMP OIDs
        oids = {
            'hostname': '1.3.6.1.2.1.1.5.0',      # sysName
            'description': '1.3.6.1.2.1.1.1.0',   # sysDescr
            'uptime': '1.3.6.1.2.1.1.3.0',        # sysUpTime
            'contact': '1.3.6.1.2.1.1.4.0',       # sysContact
            'location': '1.3.6.1.2.1.1.6.0'       # sysLocation
        }

        print(f"Querying device: {ip}")
        
        # Query basic system information
        for key, oid in oids.items():
            value = self.snmp_query(ip, oid)
            if value and value != "None":
                device_info[key] = value

        # Parse vendor/model from description
        if device_info['description']:
            desc = device_info['description'].lower()
            if 'cisco' in desc:
                device_info['vendor'] = 'Cisco'
                if 'ios' in desc:
                    device_info['os_version'] = 'Cisco IOS'
            elif 'juniper' in desc:
                device_info['vendor'] = 'Juniper'
            elif 'arista' in desc:
                device_info['vendor'] = 'Arista'

        # Get interface information
        device_info['interfaces'] = self.get_interface_info(ip)

        return device_info

    def get_interface_info(self, ip):
        """Get interface information from device"""
        interfaces = []
        
        # Interface description OID base
        if_descr_oid = '1.3.6.1.2.1.2.2.1.2'
        if_status_oid = '1.3.6.1.2.1.2.2.1.8'
        
        try:
            # Query interface descriptions
            for i in range(1, 25):  # Check first 24 interfaces
                descr = self.snmp_query(ip, f"{if_descr_oid}.{i}")
                status = self.snmp_query(ip, f"{if_status_oid}.{i}")
                
                if descr and descr != "None":
                    interfaces.append({
                        'index': i,
                        'description': descr,
                        'status': 'up' if status == '1' else 'down'
                    })
        except Exception as e:
            print(f"Error getting interface info for {ip}: {e}")

        return interfaces

    def discover_network(self, networks):
        """Discover all devices in given networks"""
        all_devices = []
        
        for network in networks:
            print(f"Scanning network: {network}")
            active_hosts = self.ping_sweep(network)
            
            print(f"Found {len(active_hosts)} active hosts in {network}")
            
            # Query each active host via SNMP
            with ThreadPoolExecutor(max_workers=10) as executor:
                future_to_ip = {executor.submit(self.get_device_info, ip): ip 
                               for ip in active_hosts}
                
                for future in as_completed(future_to_ip):
                    try:
                        device_info = future.result()
                        if device_info and device_info.get('hostname'):
                            all_devices.append(device_info)
                            print(f"Discovered device: {device_info['hostname']} ({device_info['ip']})")
                    except Exception as e:
                        print(f"Error processing device: {e}")

        self.discovered_devices = all_devices
        return all_devices

    def save_inventory(self, filename="network_inventory.json"):
        """Save discovered devices to JSON file"""
        with open(filename, 'w') as f:
            json.dump(self.discovered_devices, f, indent=2)
        print(f"Inventory saved to {filename}")

    def load_inventory(self, filename="network_inventory.json"):
        """Load device inventory from JSON file"""
        try:
            with open(filename, 'r') as f:
                self.discovered_devices = json.load(f)
            return self.discovered_devices
        except FileNotFoundError:
            return []

def main():
    """Main discovery function"""
    # Configuration
    networks = ["192.168.1.0/24", "10.0.0.0/24"]  # Add your networks here
    community = "public"  # Change to your SNMP community string
    
    # Initialize discovery
    discovery = NetworkDiscovery(community=community)
    
    print("Starting network discovery...")
    print("=" * 50)
    
    # Discover devices
    devices = discovery.discover_network(networks)
    
    # Save results
    discovery.save_inventory()
    
    print("=" * 50)
    print(f"Discovery complete! Found {len(devices)} network devices.")
    
    # Print summary
    for device in devices:
        print(f"Device: {device['hostname']} ({device['ip']}) - {device.get('vendor', 'Unknown')} {device.get('model', '')}")

if __name__ == "__main__":
    main()
