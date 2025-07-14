#!/usr/bin/env python3
"""
Configuration Backup Module
Automated backup of network device configurations
"""

import os
import json
from datetime import datetime
from netmiko import ConnectHandler
from concurrent.futures import ThreadPoolExecutor, as_completed
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ConfigBackup:
    def __init__(self, backup_dir="configs"):
        self.backup_dir = backup_dir
        self.ensure_backup_dir()
        
    def ensure_backup_dir(self):
        """Create backup directory if it doesn't exist"""
        if not os.path.exists(self.backup_dir):
            os.makedirs(self.backup_dir)
            
    def connect_to_device(self, device_info):
        """Establish connection to network device"""
        device_params = {
            'device_type': device_info.get('device_type', 'cisco_ios'),
            'host': device_info['ip'],
            'username': device_info['username'],
            'password': device_info['password'],
            'timeout': 30,
            'session_log': f"logs/{device_info['ip']}_session.log"
        }
        
        # Handle SSH keys if configured
        if device_info.get('use_keys'):
            device_params['use_keys'] = True
            device_params['key_file'] = device_info.get('key_file')
            
        try:
            connection = ConnectHandler(**device_params)
            return connection
        except Exception as e:
            logger.error(f"Failed to connect to {device_info['ip']}: {e}")
            return None
    
    def backup_cisco_ios(self, connection, device_ip):
        """Backup Cisco IOS configuration"""
        try:
            # Get running config
            running_config = connection.send_command("show running-config")
            
            # Get startup config  
            startup_config = connection.send_command("show startup-config")
            
            # Get version info
            version_info = connection.send_command("show version")
            
            # Get interface status
            interface_status = connection.send_command("show ip interface brief")
            
            # Get routing table
            routing_table = connection.send_command("show ip route")
            
            backup_data = {
                'device_ip': device_ip,
                'timestamp': datetime.now().isoformat(),
                'running_config': running_config,
                'startup_config': startup_config,
                'version_info': version_info,
                'interface_status': interface_status,
                'routing_table': routing_table
            }
            
            return backup_data
            
        except Exception as e:
            logger.error(f"Error backing up Cisco IOS device {device_ip}: {e}")
            return None
    
    def backup_cisco_nxos(self, connection, device_ip):
        """Backup Cisco NX-OS configuration"""
        try:
            # Get running config
            running_config = connection.send_command("show running-config")
            
            # Get startup config
            startup_config = connection.send_command("show startup-config")
            
            # Get version info
            version_info = connection.send_command("show version")
            
            # Get interface status
            interface_status = connection.send_command("show interface brief")
            
            # Get VRF information
            vrf_info = connection.send_command("show vrf")
            
            backup_data = {
                'device_ip': device_ip,
                'timestamp': datetime.now().isoformat(),
                'running_config': running_config,
                'startup_config': startup_config,
                'version_info': version_info,
                'interface_status': interface_status,
                'vrf_info': vrf_info
            }
            
            return backup_data
            
        except Exception as e:
            logger.error(f"Error backing up Cisco NX-OS device {device_ip}: {e}")
            return None
    
    def backup_device(self, device_info):
        """Backup single network device"""
        device_ip = device_info['ip']
        device_type = device_info.get('device_type', 'cisco_ios')
        
        logger.info(f"Starting backup for device: {device_ip}")
        
        # Connect to device
        connection = self.connect_to_device(device_info)
        if not connection:
            return None
        
        try:
            # Determine backup method based on device type
            if device_type == 'cisco_ios':
                backup_data = self.backup_cisco_ios(connection, device_ip)
            elif device_type == 'cisco_nxos':
                backup_data = self.backup_cisco_nxos(connection, device_ip)
            else:
                # Generic backup for unknown device types
                backup_data = {
                    'device_ip': device_ip,
                    'timestamp': datetime.now().isoformat(),
                    'running_config': connection.send_command("show running-config"),
                    'version_info': connection.send_command("show version")
                }
            
            if backup_data:
                # Save backup to file
                self.save_backup(backup_data, device_ip)
                logger.info(f"Backup completed for device: {device_ip}")
                return backup_data
            
        except Exception as e:
            logger.error(f"Error during backup of {device_ip}: {e}")
            
        finally:
            connection.disconnect()
        
        return None
    
    def save_backup(self, backup_data, device_ip):
        """Save backup data to file"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{self.backup_dir}/{device_ip}_{timestamp}.json"
        
        try:
            with open(filename, 'w') as f:
                json.dump(backup_data, f, indent=2)
            
            # Also save just the running config as text file
            config_filename = f"{self.backup_dir}/{device_ip}_{timestamp}_running.cfg"
            with open(config_filename, 'w') as f:
                f.write(backup_data.get('running_config', ''))
                
            logger.info(f"Backup saved: {filename}")
            
        except Exception as e:
            logger.error(f"Error saving backup for {device_ip}: {e}")
    
    def backup_multiple_devices(self, devices_list, max_workers=5):
        """Backup multiple devices concurrently"""
        results = []
        
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_device = {executor.submit(self.backup_device, device): device 
                               for device in devices_list}
            
            for future in as_completed(future_to_device):
                device = future_to_device[future]
                try:
                    result = future.result()
                    if result:
                        results.append(result)
                        logger.info(f"Successfully backed up: {device['ip']}")
                    else:
                        logger.error(f"Failed to backup: {device['ip']}")
                except Exception as e:
                    logger.error(f"Exception during backup of {device['ip']}: {e}")
        
        return results
    
    def schedule_backup(self, devices_list, interval_hours=24):
        """Schedule regular backups"""
        import schedule
        import time
        
        def run_backup():
            logger.info("Starting scheduled backup...")
            results = self.backup_multiple_devices(devices_list)
            logger.info(f"Scheduled backup completed. {len(results)} devices backed up.")
        
        schedule.every(interval_hours).hours.do(run_backup)
        
        logger.info(f"Backup scheduled every {interval_hours} hours")
        while True:
            schedule.run_pending()
            time.sleep(60)  # Check every minute
    
    def restore_config(self, device_info, backup_file):
        """Restore configuration to device from backup"""
        logger.info(f"Restoring configuration to {device_info['ip']} from {backup_file}")
        
        # Load backup data
        try:
            with open(backup_file, 'r') as f:
                backup_data = json.load(f)
        except Exception as e:
            logger.error(f"Error loading backup file {backup_file}: {e}")
            return False
        
        # Connect to device
        connection = self.connect_to_device(device_info)
        if not connection:
            return False
        
        try:
            # Enter configuration mode
            connection.config_mode()
            
            # Send configuration commands
            config_lines = backup_data['running_config'].split('\n')
            
            # Filter out comments and empty lines
            config_commands = [line.strip() for line in config_lines 
                             if line.strip() and not line.strip().startswith('!')]
            
            # Apply configuration
            output = connection.send_config_set(config_commands)
            
            # Save configuration
            save_output = connection.send_command("write memory")
            
            logger.info(f"Configuration restored successfully to {device_info['ip']}")
            return True
            
        except Exception as e:
            logger.error(f"Error restoring configuration to {device_info['ip']}: {e}")
            return False
            
        finally:
            connection.disconnect()

def main():
    """Main backup function"""
    # Sample device configuration
    devices = [
        {
            'ip': '192.168.1.10',
            'username': 'admin',
            'password': 'cisco123',
            'device_type': 'cisco_ios'
        },
        {
            'ip': '192.168.1.20',
            'username': 'admin', 
            'password': 'cisco123',
            'device_type': 'cisco_ios'
        }
    ]
    
    # Initialize backup manager
    backup_mgr = ConfigBackup()
    
    # Perform backup
    print("Starting configuration backup...")
    results = backup_mgr.backup_multiple_devices(devices)
    
    print(f"Backup completed. {len(results)} devices backed up successfully.")

if __name__ == "__main__":
    main()
