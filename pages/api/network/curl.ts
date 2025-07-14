import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url = 'https://api.github.com/users/avis-enna' } = req.query;
  
  try {
    const response = await fetch(url as string, {
      method: 'GET',
      headers: {
        'User-Agent': 'Portfolio-Terminal/1.0'
      }
    });

    const headers: Record<string, string> = {};
    response.headers.forEach((value, name) => {
      headers[name] = value;
    });

    const text = await response.text();
    
    res.status(200).json({
      url,
      status: response.status,
      statusText: response.statusText,
      headers,
      body: text,
      success: response.ok,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('HTTP request error:', error);
    res.status(200).json({
      url,
      output: [`curl: ${url}: ${error.message || 'Request failed'}`],
      success: false,
      timestamp: new Date().toISOString()
    });
  }
}
