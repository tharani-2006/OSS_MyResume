import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { target = 'cisco.com' } = req.query;

  try {
    // For browser-safe ping simulation, we'll use a HTTP request with timing
    const startTime = Date.now();
    
    try {
      // Try to make a simple HEAD request to check connectivity
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`https://${target}`, {
        method: 'HEAD',
        signal: controller.signal,
        mode: 'no-cors' // This allows the request but limits response data
      });
      
      clearTimeout(timeoutId);
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      const pingResult = {
        target,
        timestamp: new Date().toISOString(),
        responseTime,
        status: 'success',
        packets: [
          { seq: 1, time: responseTime + Math.random() * 5 - 2.5 },
          { seq: 2, time: responseTime + Math.random() * 5 - 2.5 },
          { seq: 3, time: responseTime + Math.random() * 5 - 2.5 }
        ],
        statistics: {
          transmitted: 3,
          received: 3,
          loss: 0
        }
      };

      res.status(200).json(pingResult);
    } catch (error) {
      // If the request fails, simulate a timeout or unreachable response
      const pingResult = {
        target,
        timestamp: new Date().toISOString(),
        responseTime: null,
        status: 'failed',
        error: 'Destination unreachable or timeout',
        packets: [],
        statistics: {
          transmitted: 3,
          received: 0,
          loss: 100
        }
      };

      res.status(200).json(pingResult);
    }
  } catch (error) {
    console.error('Error in ping API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
