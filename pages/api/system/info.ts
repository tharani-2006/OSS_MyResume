import { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import { promisify } from 'util';
import os from 'os';

const execAsync = promisify(exec);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const systemInfo = {
      platform: os.platform(),
      arch: os.arch(),
      hostname: os.hostname(),
      release: os.release(),
      uptime: os.uptime(),
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
        used: os.totalmem() - os.freemem()
      },
      cpus: os.cpus(),
      loadavg: os.loadavg(),
      networkInterfaces: os.networkInterfaces(),
      nodeVersion: process.version,
      processUptime: process.uptime(),
      timestamp: new Date().toISOString()
    };

    // Get additional process information
    let processInfo = {};
    try {
      const { stdout } = await execAsync('ps aux | head -10');
      processInfo = { processes: stdout.split('\n').filter(line => line.trim()) };
    } catch (error) {
      processInfo = { processes: ['ps: command not available'] };
    }

    res.status(200).json({
      system: systemInfo,
      processes: processInfo,
      success: true
    });
  } catch (error: any) {
    console.error('System info error:', error);
    res.status(500).json({
      error: error.message || 'Failed to get system information',
      success: false
    });
  }
}
