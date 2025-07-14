import { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { domain = 'cisco.com' } = req.query;
  
  try {
    // Use system nslookup command
    const command = process.platform === 'win32' 
      ? `nslookup ${domain}`
      : `nslookup ${domain}`;
    
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr && !stdout) {
      throw new Error(stderr);
    }

    // Parse nslookup output
    const lines = stdout.split('\n').filter(line => line.trim());
    
    res.status(200).json({
      domain,
      output: lines,
      success: true,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('DNS lookup error:', error);
    res.status(200).json({
      domain,
      output: [`nslookup: ${domain}: ${error.message || 'DNS lookup failed'}`],
      success: false,
      timestamp: new Date().toISOString()
    });
  }
}
