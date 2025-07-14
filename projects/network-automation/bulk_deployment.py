#!/usr/bin/env python3
"""
Bulk Configuration Deployment Module
Deploy configurations to multiple network devices simultaneously
"""

import os
import json
import yaml
from datetime import datetime
from netmiko import ConnectHandler
from concurrent.futures import ThreadPoolExecutor, as_completed
import logging
import jinja2

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BulkDeployment:
    def __init__(self, template_dir="templates", logs_dir="logs"):
        self.template_dir = template_dir
        self.logs_dir = logs_dir
        self.ensure_directories()
        self.jinja_env = jinja2.Environment(loader=jinja2.FileSystemLoader(template_dir))
        
    def ensure_directories(self):
        """Create necessary directories"""
        for directory in [self.template_dir, self.logs_dir]:
            if not os.path.exists(directory):
                os.makedirs(directory)
    
    def load_device_inventory(self, inventory_file):
        """Load device inventory from JSON file"""
        try:
            with open(inventory_file, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading inventory: {e}")
            return []
    
    def load_template(self, template_name):
        """Load Jinja2 configuration template"""
        try:
            template = self.jinja_env.get_template(template_name)
            return template
        except Exception as e:
            logger.error(f"Error loading template {template_name}: {e}")
            return None
    
    def render_config(self, template, device_vars):
        """Render configuration using template and device variables"""
        try:
            return template.render(**device_vars)
        except Exception as e:
            logger.error(f"Error rendering template: {e}")
            return None
    
    def connect_to_device(self, device_info):
        """Establish connection to network device"""
        device_params = {
            'device_type': device_info.get('device_type', 'cisco_ios'),
            'host': device_info['ip'],
            'username': device_info['username'],
            'password': device_info['password'],
            'timeout': 30,
            'session_log': f"{self.logs_dir}/{device_info['ip']}_session.log"
        }
        
        try:
            connection = ConnectHandler(**device_params)
            return connection
        except Exception as e:
            logger.error(f"Failed to connect to {device_info['ip']}: {e}")
            return None
    
    def deploy_config_to_device(self, device_info, config_commands):
        """Deploy configuration to a single device"""
        device_ip = device_info['ip']
        logger.info(f"Deploying configuration to {device_ip}")
        
        # Connect to device
        connection = self.connect_to_device(device_info)
        if not connection:
            return {'device': device_ip, 'status': 'failed', 'error': 'Connection failed'}
        
        try:
            # Backup current configuration first
            current_config = connection.send_command("show running-config")
            backup_file = f"{self.logs_dir}/{device_ip}_pre_deployment_{datetime.now().strftime('%Y%m%d_%H%M%S')}.cfg"
            with open(backup_file, 'w') as f:
                f.write(current_config)
            
            # Enter configuration mode
            connection.config_mode()
            
            # Send configuration commands
            if isinstance(config_commands, str):
                config_lines = [line.strip() for line in config_commands.split('\n') 
                              if line.strip() and not line.strip().startswith('!')]
            else:
                config_lines = config_commands
            
            # Deploy configuration
            output = connection.send_config_set(config_lines)
            
            # Save configuration
            save_output = connection.send_command("write memory")
            
            # Exit config mode
            connection.exit_config_mode()
            
            # Verify deployment
            verification_commands = [
                "show running-config | include hostname",
                "show ip interface brief",
                "show version | include uptime"
            ]
            
            verification_results = {}
            for cmd in verification_commands:
                verification_results[cmd] = connection.send_command(cmd)
            
            deployment_result = {
                'device': device_ip,
                'status': 'success',
                'timestamp': datetime.now().isoformat(),
                'backup_file': backup_file,
                'deployment_output': output,
                'save_output': save_output,
                'verification': verification_results
            }
            
            logger.info(f"Successfully deployed configuration to {device_ip}")
            return deployment_result
            
        except Exception as e:
            error_msg = f"Error deploying to {device_ip}: {e}"
            logger.error(error_msg)
            return {'device': device_ip, 'status': 'failed', 'error': error_msg}
            
        finally:
            connection.disconnect()
    
    def bulk_deploy(self, devices, template_name, device_variables, max_workers=5, dry_run=False):
        """Deploy configuration to multiple devices"""
        # Load template
        template = self.load_template(template_name)
        if not template:
            return []
        
        deployment_results = []
        
        # Prepare deployment tasks
        deployment_tasks = []
        for device in devices:
            device_ip = device['ip']
            
            # Get device-specific variables
            device_vars = device_variables.get(device_ip, {})
            device_vars.update({
                'device_ip': device_ip,
                'hostname': device.get('hostname', f"device-{device_ip.replace('.', '-')}")
            })
            
            # Render configuration
            config = self.render_config(template, device_vars)
            if config:
                if dry_run:
                    # Save rendered config for review
                    preview_file = f"{self.logs_dir}/{device_ip}_config_preview.cfg"
                    with open(preview_file, 'w') as f:
                        f.write(config)
                    logger.info(f"Dry run: Configuration saved to {preview_file}")
                    deployment_results.append({
                        'device': device_ip,
                        'status': 'dry_run',
                        'preview_file': preview_file
                    })
                else:
                    deployment_tasks.append((device, config))
        
        if dry_run:
            return deployment_results
        
        # Execute deployments concurrently
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_device = {executor.submit(self.deploy_config_to_device, device, config): device 
                               for device, config in deployment_tasks}
            
            for future in as_completed(future_to_device):
                try:
                    result = future.result()
                    deployment_results.append(result)
                except Exception as e:
                    device = future_to_device[future]
                    logger.error(f"Exception during deployment to {device['ip']}: {e}")
                    deployment_results.append({
                        'device': device['ip'],
                        'status': 'failed',
                        'error': f"Deployment exception: {e}"
                    })
        
        return deployment_results
    
    def create_rollback_plan(self, deployment_results):
        """Create rollback plan based on deployment results"""
        rollback_plan = {
            'timestamp': datetime.now().isoformat(),
            'devices': []
        }
        
        for result in deployment_results:
            if result['status'] == 'success' and 'backup_file' in result:
                rollback_plan['devices'].append({
                    'device': result['device'],
                    'backup_file': result['backup_file'],
                    'deployment_timestamp': result['timestamp']
                })
        
        # Save rollback plan
        rollback_file = f"{self.logs_dir}/rollback_plan_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(rollback_file, 'w') as f:
            json.dump(rollback_plan, f, indent=2)
        
        logger.info(f"Rollback plan created: {rollback_file}")
        return rollback_file
    
    def execute_rollback(self, rollback_plan_file):
        """Execute rollback using rollback plan"""
        try:
            with open(rollback_plan_file, 'r') as f:
                rollback_plan = json.load(f)
        except Exception as e:
            logger.error(f"Error loading rollback plan: {e}")
            return []
        
        rollback_results = []
        
        for device_info in rollback_plan['devices']:
            device_ip = device_info['device']
            backup_file = device_info['backup_file']
            
            logger.info(f"Rolling back {device_ip} using {backup_file}")
            
            # For rollback, we need device connection info
            # This should be loaded from inventory or provided separately
            # For now, using placeholder
            device_conn_info = {
                'ip': device_ip,
                'username': 'admin',  # Should be loaded from secure storage
                'password': 'password',  # Should be loaded from secure storage
                'device_type': 'cisco_ios'
            }
            
            try:
                with open(backup_file, 'r') as f:
                    backup_config = f.read()
                
                result = self.deploy_config_to_device(device_conn_info, backup_config)
                rollback_results.append(result)
                
            except Exception as e:
                logger.error(f"Error during rollback of {device_ip}: {e}")
                rollback_results.append({
                    'device': device_ip,
                    'status': 'rollback_failed',
                    'error': str(e)
                })
        
        return rollback_results
    
    def generate_deployment_report(self, deployment_results, output_file=None):
        """Generate deployment report"""
        if not output_file:
            output_file = f"{self.logs_dir}/deployment_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        report = {
            'deployment_summary': {
                'total_devices': len(deployment_results),
                'successful': len([r for r in deployment_results if r['status'] == 'success']),
                'failed': len([r for r in deployment_results if r['status'] == 'failed']),
                'timestamp': datetime.now().isoformat()
            },
            'device_results': deployment_results
        }
        
        with open(output_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        logger.info(f"Deployment report saved: {output_file}")
        return output_file

def main():
    """Main deployment function"""
    # Sample configuration
    devices = [
        {
            'ip': '192.168.1.10',
            'hostname': 'switch-01',
            'username': 'admin',
            'password': 'cisco123',
            'device_type': 'cisco_ios'
        },
        {
            'ip': '192.168.1.20',
            'hostname': 'switch-02',
            'username': 'admin',
            'password': 'cisco123',
            'device_type': 'cisco_ios'
        }
    ]
    
    # Device-specific variables for template rendering
    device_variables = {
        '192.168.1.10': {
            'mgmt_vlan': 100,
            'ntp_server': '192.168.1.1',
            'snmp_community': 'public'
        },
        '192.168.1.20': {
            'mgmt_vlan': 200,
            'ntp_server': '192.168.1.1',
            'snmp_community': 'public'
        }
    }
    
    # Initialize deployment manager
    deployment_mgr = BulkDeployment()
    
    # Create sample template
    sample_template = """
! Generated configuration for {{ hostname }}
!
hostname {{ hostname }}
!
{% if ntp_server %}
ntp server {{ ntp_server }}
{% endif %}
!
{% if snmp_community %}
snmp-server community {{ snmp_community }} RO
{% endif %}
!
{% if mgmt_vlan %}
interface vlan{{ mgmt_vlan }}
 description Management VLAN
 ip address dhcp
{% endif %}
!
end
"""
    
    # Save sample template
    with open("templates/basic_config.j2", 'w') as f:
        f.write(sample_template)
    
    # Perform dry run first
    print("Performing dry run...")
    dry_run_results = deployment_mgr.bulk_deploy(
        devices, 
        "basic_config.j2", 
        device_variables, 
        dry_run=True
    )
    
    print(f"Dry run completed. Check preview files in logs/ directory.")
    
    # Uncomment the following lines to perform actual deployment
    # print("Performing actual deployment...")
    # results = deployment_mgr.bulk_deploy(devices, "basic_config.j2", device_variables)
    # rollback_plan = deployment_mgr.create_rollback_plan(results)
    # report = deployment_mgr.generate_deployment_report(results)
    # print(f"Deployment completed. Report: {report}")

if __name__ == "__main__":
    main()
