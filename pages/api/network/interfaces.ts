import { NextApiRequest, NextApiResponse } from 'next';
import * as os from 'os';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get real network interfaces from Node.js os module
    const networkInterfaces = os.networkInterfaces();
    const output = [];

    for (const [name, interfaces] of Object.entries(networkInterfaces)) {
      if (interfaces) {
        output.push(`${name}: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>`);
        
        for (const iface of interfaces) {
          if (iface.family === 'IPv4') {
            output.push(`      inet ${iface.address}  netmask ${iface.netmask}  broadcast ${iface.address.split('.').slice(0, 3).join('.')}.255`);
          } else if (iface.family === 'IPv6') {
            output.push(`      inet6 ${iface.address}  prefixlen ${iface.cidr?.split('/')[1] || '64'}`);
          }
          
          if (iface.mac && iface.mac !== '00:00:00:00:00:00') {
            output.push(`      ether ${iface.mac}  txqueuelen 1000`);
          }
        }
        output.push('');
      }
    }

    // Add some summary info
    const interfaceCount = Object.keys(networkInterfaces).length;
    output.push(`Total network interfaces: ${interfaceCount}`);
    output.push(`System hostname: ${os.hostname()}`);

    res.status(200).json({
      success: true,
      output,
      interfaces: networkInterfaces,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Network interfaces error:', error);
    res.status(200).json({
      success: false,
      output: [
        "ifconfig: Unable to retrieve network interfaces",
        `Error: ${error.message}`,
        "",
        "Fallback interface information:",
        "lo: flags=73<UP,LOOPBACK,RUNNING>",
        "    inet 127.0.0.1  netmask 255.0.0.0",
        "    inet6 ::1  prefixlen 128"
      ],
      error: error.message
    });
  }
}
