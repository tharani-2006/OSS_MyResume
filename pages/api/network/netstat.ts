import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get current server port and some mock network connections
    const serverPort = process.env.PORT || '4000';
    
    const output = [
      "Proto Recv-Q Send-Q Local Address           Foreign Address         State",
      `tcp        0      0 127.0.0.1:${serverPort}         0.0.0.0:*               LISTEN`,
      "tcp        0      0 127.0.0.1:22            0.0.0.0:*               LISTEN",
      "tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN",
      "tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN",
      "udp        0      0 127.0.0.1:53            0.0.0.0:*                    ",
      "udp        0      0 0.0.0.0:68              0.0.0.0:*                    ",
      "",
      `Active Internet connections (servers and established)`,
      `Current portfolio server running on port ${serverPort}`,
      `SSH service available on port 22`,
      `Web services on ports 80/443`
    ];

    res.status(200).json({
      success: true,
      output,
      timestamp: new Date().toISOString(),
      serverPort
    });
  } catch (error: any) {
    console.error('Netstat error:', error);
    res.status(200).json({
      success: false,
      output: ["netstat: Unable to retrieve network connections", `Error: ${error.message}`],
      error: error.message
    });
  }
}
