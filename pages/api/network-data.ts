import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Simulate real network monitoring data
    const networkData = {
      timestamp: new Date().toISOString(),
      interfaces: [
        {
          name: 'eth0',
          type: 'Ethernet',
          status: 'UP',
          ip: '192.168.1.100',
          netmask: '255.255.255.0',
          gateway: '192.168.1.1',
          mac: '08:00:27:4e:66:a1',
          mtu: 1500,
          rxPackets: Math.floor(Math.random() * 1000000) + 1456789,
          txPackets: Math.floor(Math.random() * 500000) + 987654,
          rxBytes: Math.floor(Math.random() * 1000000000) + 987654321,
          txBytes: Math.floor(Math.random() * 500000000) + 123456789,
          rxErrors: Math.floor(Math.random() * 10),
          txErrors: Math.floor(Math.random() * 5),
          speed: '1000 Mbps',
          duplex: 'Full'
        },
        {
          name: 'lo',
          type: 'Loopback',
          status: 'UP',
          ip: '127.0.0.1',
          netmask: '255.0.0.0',
          mac: '00:00:00:00:00:00',
          mtu: 65536,
          rxPackets: Math.floor(Math.random() * 10000) + 50000,
          txPackets: Math.floor(Math.random() * 10000) + 50000,
          rxBytes: Math.floor(Math.random() * 10000000) + 5000000,
          txBytes: Math.floor(Math.random() * 10000000) + 5000000,
          rxErrors: 0,
          txErrors: 0,
          speed: 'N/A',
          duplex: 'N/A'
        }
      ],
      connections: [
        {
          protocol: 'tcp',
          localAddress: 'localhost:3000',
          foreignAddress: '0.0.0.0:*',
          state: 'LISTEN',
          pid: process.pid,
          program: 'node'
        },
        {
          protocol: 'tcp',
          localAddress: 'localhost:22',
          foreignAddress: 'cisco-hq:45892',
          state: 'ESTABLISHED',
          pid: Math.floor(Math.random() * 10000) + 1000,
          program: 'ssh'
        },
        {
          protocol: 'tcp',
          localAddress: 'workstation:443',
          foreignAddress: 'github.com:443',
          state: 'ESTABLISHED',
          pid: Math.floor(Math.random() * 10000) + 1000,
          program: 'browser'
        },
        {
          protocol: 'tcp',
          localAddress: 'workstation:80',
          foreignAddress: 'portfolio-cdn:80',
          state: 'TIME_WAIT',
          pid: 0,
          program: '-'
        }
      ],
      routingTable: [
        {
          destination: '0.0.0.0',
          gateway: '192.168.1.1',
          genmask: '0.0.0.0',
          flags: 'UG',
          metric: 100,
          iface: 'eth0'
        },
        {
          destination: '192.168.1.0',
          gateway: '0.0.0.0',
          genmask: '255.255.255.0',
          flags: 'U',
          metric: 100,
          iface: 'eth0'
        },
        {
          destination: '169.254.0.0',
          gateway: '0.0.0.0',
          genmask: '255.255.0.0',
          flags: 'U',
          metric: 1000,
          iface: 'eth0'
        }
      ],
      arpTable: [
        {
          address: 'gateway',
          hwtype: 'ether',
          hwaddress: '00:50:56:c0:00:08',
          flags: 'C',
          iface: 'eth0'
        },
        {
          address: 'cisco-switch.local',
          hwtype: 'ether',
          hwaddress: '00:1b:21:a4:c5:d6',
          flags: 'C',
          iface: 'eth0'
        },
        {
          address: 'workstation-02',
          hwtype: 'ether',
          hwaddress: '00:0c:29:45:f2:8a',
          flags: 'C',
          iface: 'eth0'
        }
      ],
      statistics: {
        totalPackets: Math.floor(Math.random() * 10000000) + 50000000,
        totalBytes: Math.floor(Math.random() * 100000000000) + 500000000000,
        bandwidth: {
          current: Math.floor(Math.random() * 100) + 50, // Mbps
          peak: Math.floor(Math.random() * 200) + 800,
          average: Math.floor(Math.random() * 150) + 200
        },
        latency: {
          current: Math.random() * 10 + 5, // ms
          average: Math.random() * 15 + 10,
          peak: Math.random() * 50 + 30
        }
      }
    };

    res.status(200).json(networkData);
  } catch (error) {
    console.error('Error fetching network data:', error);
    res.status(500).json({ error: 'Failed to fetch network data' });
  }
}
