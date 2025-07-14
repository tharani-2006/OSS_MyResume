import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const systemInfo = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      platform: process.platform,
      version: process.version,
      pid: process.pid,
      nodeVersion: process.versions.node,
      loadAverage: process.platform !== 'win32' ? require('os').loadavg() : [0, 0, 0],
      totalMemory: require('os').totalmem(),
      freeMemory: require('os').freemem(),
      cpuInfo: require('os').cpus(),
      networkInterfaces: require('os').networkInterfaces(),
      hostname: require('os').hostname(),
      userInfo: require('os').userInfo()
    };

    res.status(200).json(systemInfo);
  } catch (error) {
    console.error('Error fetching system info:', error);
    res.status(500).json({ error: 'Failed to fetch system information' });
  }
}
