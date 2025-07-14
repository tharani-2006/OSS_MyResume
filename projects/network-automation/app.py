#!/usr/bin/env python3
"""
Main Flask Web Application for Network Automation Toolkit
Provides web interface for device management and automation tasks
"""

from flask import Flask, render_template, request, jsonify, send_file
import json
import os
from datetime import datetime
import threading
from device_discovery import NetworkDiscovery
from config_backup import ConfigBackup
from bulk_deployment import BulkDeployment

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'

# Initialize modules
discovery = NetworkDiscovery()
backup_mgr = ConfigBackup()
deployment_mgr = BulkDeployment()

@app.route('/')
def dashboard():
    """Main dashboard"""
    return render_template('dashboard.html')

@app.route('/api/devices')
def get_devices():
    """Get list of discovered devices"""
    devices = discovery.load_inventory()
    return jsonify(devices)

@app.route('/api/discover', methods=['POST'])
def start_discovery():
    """Start network discovery"""
    data = request.get_json()
    networks = data.get('networks', ['192.168.1.0/24'])
    
    def run_discovery():
        discovery.discover_network(networks)
        discovery.save_inventory()
    
    # Run discovery in background thread
    thread = threading.Thread(target=run_discovery)
    thread.start()
    
    return jsonify({'status': 'started', 'message': 'Discovery started in background'})

@app.route('/api/backup', methods=['POST'])
def start_backup():
    """Start configuration backup"""
    data = request.get_json()
    device_ips = data.get('devices', [])
    
    # Load device inventory
    all_devices = discovery.load_inventory()
    
    # Filter devices to backup
    devices_to_backup = []
    for device in all_devices:
        if device['ip'] in device_ips:
            # Add connection credentials (should be from secure storage)
            device['username'] = 'admin'
            device['password'] = 'cisco123'  # In production, use secure credential management
            devices_to_backup.append(device)
    
    def run_backup():
        backup_mgr.backup_multiple_devices(devices_to_backup)
    
    # Run backup in background thread
    thread = threading.Thread(target=run_backup)
    thread.start()
    
    return jsonify({'status': 'started', 'message': f'Backup started for {len(devices_to_backup)} devices'})

@app.route('/api/deploy', methods=['POST'])
def start_deployment():
    """Start bulk configuration deployment"""
    data = request.get_json()
    template_name = data.get('template')
    device_ips = data.get('devices', [])
    device_variables = data.get('variables', {})
    dry_run = data.get('dry_run', True)
    
    # Load device inventory
    all_devices = discovery.load_inventory()
    
    # Filter devices for deployment
    devices_to_deploy = []
    for device in all_devices:
        if device['ip'] in device_ips:
            device['username'] = 'admin'
            device['password'] = 'cisco123'
            devices_to_deploy.append(device)
    
    def run_deployment():
        results = deployment_mgr.bulk_deploy(
            devices_to_deploy, 
            template_name, 
            device_variables, 
            dry_run=dry_run
        )
        if not dry_run:
            deployment_mgr.create_rollback_plan(results)
            deployment_mgr.generate_deployment_report(results)
    
    # Run deployment in background thread
    thread = threading.Thread(target=run_deployment)
    thread.start()
    
    action = "Dry run" if dry_run else "Deployment"
    return jsonify({
        'status': 'started', 
        'message': f'{action} started for {len(devices_to_deploy)} devices'
    })

@app.route('/api/templates')
def get_templates():
    """Get list of available configuration templates"""
    template_dir = 'templates'
    templates = []
    
    if os.path.exists(template_dir):
        for file in os.listdir(template_dir):
            if file.endswith('.j2'):
                templates.append({
                    'name': file,
                    'path': os.path.join(template_dir, file),
                    'modified': datetime.fromtimestamp(
                        os.path.getmtime(os.path.join(template_dir, file))
                    ).isoformat()
                })
    
    return jsonify(templates)

@app.route('/api/backups')
def get_backups():
    """Get list of configuration backups"""
    backup_dir = 'configs'
    backups = []
    
    if os.path.exists(backup_dir):
        for file in os.listdir(backup_dir):
            if file.endswith('.json'):
                backups.append({
                    'name': file,
                    'path': os.path.join(backup_dir, file),
                    'size': os.path.getsize(os.path.join(backup_dir, file)),
                    'modified': datetime.fromtimestamp(
                        os.path.getmtime(os.path.join(backup_dir, file))
                    ).isoformat()
                })
    
    return jsonify(backups)

@app.route('/api/logs')
def get_logs():
    """Get list of log files"""
    log_dir = 'logs'
    logs = []
    
    if os.path.exists(log_dir):
        for file in os.listdir(log_dir):
            logs.append({
                'name': file,
                'path': os.path.join(log_dir, file),
                'size': os.path.getsize(os.path.join(log_dir, file)),
                'modified': datetime.fromtimestamp(
                    os.path.getmtime(os.path.join(log_dir, file))
                ).isoformat()
            })
    
    return jsonify(logs)

@app.route('/api/system-status')
def system_status():
    """Get system status information"""
    devices = discovery.load_inventory()
    
    # Count backups
    backup_count = 0
    if os.path.exists('configs'):
        backup_count = len([f for f in os.listdir('configs') if f.endswith('.json')])
    
    # Count templates
    template_count = 0
    if os.path.exists('templates'):
        template_count = len([f for f in os.listdir('templates') if f.endswith('.j2')])
    
    status = {
        'timestamp': datetime.now().isoformat(),
        'discovered_devices': len(devices),
        'backup_count': backup_count,
        'template_count': template_count,
        'system_uptime': 'Running',
        'last_discovery': 'Never' if not devices else max(device.get('discovered_at', '') for device in devices)
    }
    
    return jsonify(status)

if __name__ == '__main__':
    # Ensure required directories exist
    for directory in ['templates', 'configs', 'logs', 'static', 'templates']:
        if not os.path.exists(directory):
            os.makedirs(directory)
    
    # Create basic HTML templates if they don't exist
    if not os.path.exists('templates/dashboard.html'):
        create_basic_templates()
    
    print("Network Automation Toolkit Web Interface")
    print("=" * 50)
    print("Starting Flask application...")
    print("Access the web interface at: http://localhost:5000")
    
    app.run(host='0.0.0.0', port=5000, debug=True)

def create_basic_templates():
    """Create basic HTML templates for the web interface"""
    dashboard_html = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Network Automation Toolkit</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: #2c3e50; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .card { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .btn { background: #3498db; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin: 5px; }
        .btn:hover { background: #2980b9; }
        .btn-success { background: #27ae60; }
        .btn-success:hover { background: #229954; }
        .btn-warning { background: #f39c12; }
        .btn-warning:hover { background: #e67e22; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .status { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .status-online { background: #d4edda; color: #155724; }
        .status-offline { background: #f8d7da; color: #721c24; }
        #devices-list, #status-info { min-height: 200px; }
        .device-item { padding: 10px; border-bottom: 1px solid #eee; }
        .device-item:last-child { border-bottom: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌐 Network Automation Toolkit</h1>
            <p>Enterprise Network Management & Automation Platform</p>
        </div>
        
        <div class="grid">
            <div class="card">
                <h3>📡 Device Discovery</h3>
                <p>Discover network devices using SNMP and CDP</p>
                <input type="text" id="networks" placeholder="192.168.1.0/24, 10.0.0.0/24" style="width: 100%; padding: 8px; margin: 10px 0;">
                <button class="btn btn-success" onclick="startDiscovery()">Start Discovery</button>
                <div id="discovery-status"></div>
            </div>
            
            <div class="card">
                <h3>💾 Configuration Backup</h3>
                <p>Backup device configurations</p>
                <button class="btn" onclick="selectAllDevices()">Select All</button>
                <button class="btn btn-warning" onclick="startBackup()">Start Backup</button>
                <div id="backup-status"></div>
            </div>
            
            <div class="card">
                <h3>🚀 Bulk Deployment</h3>
                <p>Deploy configurations to multiple devices</p>
                <select id="template-select" style="width: 100%; padding: 8px; margin: 10px 0;">
                    <option value="">Select Template</option>
                </select>
                <button class="btn" onclick="dryRun()">Dry Run</button>
                <button class="btn btn-warning" onclick="deploy()">Deploy</button>
                <div id="deploy-status"></div>
            </div>
        </div>
        
        <div class="grid">
            <div class="card">
                <h3>📋 Discovered Devices</h3>
                <div id="devices-list">Loading devices...</div>
            </div>
            
            <div class="card">
                <h3>📊 System Status</h3>
                <div id="status-info">Loading status...</div>
            </div>
        </div>
    </div>

    <script>
        let devices = [];
        let selectedDevices = [];

        // Load initial data
        document.addEventListener('DOMContentLoaded', function() {
            loadDevices();
            loadSystemStatus();
            loadTemplates();
            
            // Refresh data every 30 seconds
            setInterval(() => {
                loadDevices();
                loadSystemStatus();
            }, 30000);
        });

        async function loadDevices() {
            try {
                const response = await fetch('/api/devices');
                devices = await response.json();
                renderDevices();
            } catch (error) {
                document.getElementById('devices-list').innerHTML = 'Error loading devices';
            }
        }

        async function loadSystemStatus() {
            try {
                const response = await fetch('/api/system-status');
                const status = await response.json();
                renderStatus(status);
            } catch (error) {
                document.getElementById('status-info').innerHTML = 'Error loading status';
            }
        }

        async function loadTemplates() {
            try {
                const response = await fetch('/api/templates');
                const templates = await response.json();
                const select = document.getElementById('template-select');
                select.innerHTML = '<option value="">Select Template</option>';
                templates.forEach(template => {
                    const option = document.createElement('option');
                    option.value = template.name;
                    option.textContent = template.name;
                    select.appendChild(option);
                });
            } catch (error) {
                console.error('Error loading templates:', error);
            }
        }

        function renderDevices() {
            const container = document.getElementById('devices-list');
            if (devices.length === 0) {
                container.innerHTML = '<p>No devices discovered yet. Run device discovery first.</p>';
                return;
            }

            let html = '';
            devices.forEach(device => {
                const isSelected = selectedDevices.includes(device.ip);
                html += `
                    <div class="device-item">
                        <input type="checkbox" ${isSelected ? 'checked' : ''} 
                               onchange="toggleDevice('${device.ip}')" id="device-${device.ip}">
                        <label for="device-${device.ip}">
                            <strong>${device.hostname || device.ip}</strong> (${device.ip})
                            <br><small>${device.vendor || 'Unknown'} - ${device.description || ''}</small>
                            <span class="status status-online">Online</span>
                        </label>
                    </div>
                `;
            });
            container.innerHTML = html;
        }

        function renderStatus(status) {
            const container = document.getElementById('status-info');
            container.innerHTML = `
                <p><strong>Discovered Devices:</strong> ${status.discovered_devices}</p>
                <p><strong>Configuration Backups:</strong> ${status.backup_count}</p>
                <p><strong>Templates Available:</strong> ${status.template_count}</p>
                <p><strong>Last Discovery:</strong> ${status.last_discovery}</p>
                <p><strong>System Status:</strong> ${status.system_uptime}</p>
                <p><small>Last updated: ${new Date(status.timestamp).toLocaleString()}</small></p>
            `;
        }

        function toggleDevice(ip) {
            if (selectedDevices.includes(ip)) {
                selectedDevices = selectedDevices.filter(d => d !== ip);
            } else {
                selectedDevices.push(ip);
            }
        }

        function selectAllDevices() {
            selectedDevices = devices.map(d => d.ip);
            renderDevices();
        }

        async function startDiscovery() {
            const networks = document.getElementById('networks').value.split(',').map(n => n.trim());
            const statusDiv = document.getElementById('discovery-status');
            
            statusDiv.innerHTML = '<p>Starting discovery...</p>';
            
            try {
                const response = await fetch('/api/discover', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({networks})
                });
                const result = await response.json();
                statusDiv.innerHTML = `<p style="color: green;">${result.message}</p>`;
                
                // Refresh devices after a delay
                setTimeout(loadDevices, 5000);
            } catch (error) {
                statusDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
            }
        }

        async function startBackup() {
            if (selectedDevices.length === 0) {
                alert('Please select devices to backup');
                return;
            }
            
            const statusDiv = document.getElementById('backup-status');
            statusDiv.innerHTML = '<p>Starting backup...</p>';
            
            try {
                const response = await fetch('/api/backup', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({devices: selectedDevices})
                });
                const result = await response.json();
                statusDiv.innerHTML = `<p style="color: green;">${result.message}</p>`;
            } catch (error) {
                statusDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
            }
        }

        async function dryRun() {
            await performDeployment(true);
        }

        async function deploy() {
            if (!confirm('Are you sure you want to deploy configurations to selected devices?')) {
                return;
            }
            await performDeployment(false);
        }

        async function performDeployment(dryRun) {
            const template = document.getElementById('template-select').value;
            if (!template) {
                alert('Please select a template');
                return;
            }
            
            if (selectedDevices.length === 0) {
                alert('Please select devices for deployment');
                return;
            }
            
            const statusDiv = document.getElementById('deploy-status');
            const action = dryRun ? 'dry run' : 'deployment';
            statusDiv.innerHTML = `<p>Starting ${action}...</p>`;
            
            try {
                const response = await fetch('/api/deploy', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        template,
                        devices: selectedDevices,
                        variables: {},
                        dry_run: dryRun
                    })
                });
                const result = await response.json();
                statusDiv.innerHTML = `<p style="color: green;">${result.message}</p>`;
            } catch (error) {
                statusDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
            }
        }
    </script>
</body>
</html>
    """
    
    os.makedirs('templates', exist_ok=True)
    with open('templates/dashboard.html', 'w') as f:
        f.write(dashboard_html)
