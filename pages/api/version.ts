import { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get git commit count as version number
    let commitCount = '35'; // Fallback version
    let latestCommit = 'unknown';
    let buildTime = new Date().toISOString();

    try {
      // Try to get actual git info
      const { stdout: countOutput } = await execAsync('git rev-list --count HEAD');
      commitCount = countOutput.trim();
      
      const { stdout: commitOutput } = await execAsync('git rev-parse --short HEAD');
      latestCommit = commitOutput.trim();
    } catch (error) {
      // If git commands fail (production environment), use fallback
      console.warn('Git commands not available, using fallback version');
    }

    // Get build/deployment info
    const buildNumber = parseInt(commitCount);
    const formattedVersion = `1.${commitCount}.${buildNumber}`;
    
    const deploymentInfo = {
      version: formattedVersion,
      shortVersion: `v${commitCount}`,
      buildNumber: buildNumber,
      commitCount: parseInt(commitCount),
      commit: latestCommit,
      buildTime,
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
      platform: 'Vercel',
      nodeVersion: process.version,
      nextVersion: '14.2.30',
      deploymentId: process.env.VERCEL_DEPLOYMENT_ID || 'local',
      deploymentUrl: process.env.VERCEL_URL || 'localhost:3000',
      gitBranch: process.env.VERCEL_GIT_COMMIT_REF || 'main',
      features: {
        terminalUI: true,
        networkCommands: true,
        realTimeMonitoring: true,
        bashLikeNavigation: true,
        apiEndpoints: 16
      },
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      data: deploymentInfo
    });
  } catch (error: any) {
    console.error('Version info error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      fallback: {
        version: '1.37.37',
        shortVersion: 'v37',
        buildNumber: 37,
        commitCount: 37,
        commit: 'unknown',
        environment: 'unknown'
      }
    });
  }
}
