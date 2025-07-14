import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Simulate real-time analytics data for the portfolio
    const analytics = {
      timestamp: new Date().toISOString(),
      visitors: {
        current: Math.floor(Math.random() * 10) + 1,
        today: Math.floor(Math.random() * 100) + 150,
        thisWeek: Math.floor(Math.random() * 500) + 800,
        thisMonth: Math.floor(Math.random() * 2000) + 3500,
        total: Math.floor(Math.random() * 10000) + 25000
      },
      pageViews: {
        today: Math.floor(Math.random() * 300) + 400,
        thisWeek: Math.floor(Math.random() * 1500) + 2200,
        thisMonth: Math.floor(Math.random() * 5000) + 8500,
        total: Math.floor(Math.random() * 30000) + 75000
      },
      popularSections: [
        { name: 'projects', views: Math.floor(Math.random() * 500) + 800, percentage: 35 },
        { name: 'about', views: Math.floor(Math.random() * 400) + 600, percentage: 28 },
        { name: 'experience', views: Math.floor(Math.random() * 300) + 450, percentage: 20 },
        { name: 'skills', views: Math.floor(Math.random() * 200) + 300, percentage: 12 },
        { name: 'contact', views: Math.floor(Math.random() * 100) + 150, percentage: 5 }
      ],
      performance: {
        loadTime: Math.random() * 500 + 200, // ms
        ttfb: Math.random() * 100 + 50, // ms
        fcp: Math.random() * 300 + 100, // ms
        lcp: Math.random() * 800 + 400, // ms
        cls: Math.random() * 0.1, // cumulative layout shift
        fid: Math.random() * 10 + 5 // ms
      },
      geography: [
        { country: 'India', visitors: Math.floor(Math.random() * 200) + 400, percentage: 45 },
        { country: 'United States', visitors: Math.floor(Math.random() * 150) + 250, percentage: 28 },
        { country: 'Germany', visitors: Math.floor(Math.random() * 80) + 120, percentage: 12 },
        { country: 'Canada', visitors: Math.floor(Math.random() * 60) + 80, percentage: 8 },
        { country: 'United Kingdom', visitors: Math.floor(Math.random() * 40) + 60, percentage: 7 }
      ],
      devices: {
        desktop: { count: Math.floor(Math.random() * 400) + 600, percentage: 68 },
        mobile: { count: Math.floor(Math.random() * 200) + 250, percentage: 28 },
        tablet: { count: Math.floor(Math.random() * 50) + 40, percentage: 4 }
      },
      browsers: [
        { name: 'Chrome', users: Math.floor(Math.random() * 300) + 500, percentage: 65 },
        { name: 'Firefox', users: Math.floor(Math.random() * 100) + 150, percentage: 18 },
        { name: 'Safari', users: Math.floor(Math.random() * 80) + 100, percentage: 12 },
        { name: 'Edge', users: Math.floor(Math.random() * 40) + 50, percentage: 5 }
      ],
      referrers: [
        { source: 'Direct', visitors: Math.floor(Math.random() * 200) + 350, percentage: 42 },
        { source: 'LinkedIn', visitors: Math.floor(Math.random() * 150) + 200, percentage: 28 },
        { source: 'GitHub', visitors: Math.floor(Math.random() * 100) + 120, percentage: 18 },
        { source: 'Google', visitors: Math.floor(Math.random() * 60) + 80, percentage: 8 },
        { source: 'Other', visitors: Math.floor(Math.random() * 30) + 40, percentage: 4 }
      ],
      terminalUsage: {
        totalSessions: Math.floor(Math.random() * 500) + 800,
        averageSessionTime: Math.random() * 300 + 120, // seconds
        commandsExecuted: Math.floor(Math.random() * 2000) + 3500,
        mostUsedCommands: [
          { command: 'help', count: Math.floor(Math.random() * 200) + 400 },
          { command: 'open projects', count: Math.floor(Math.random() * 150) + 300 },
          { command: 'ls', count: Math.floor(Math.random() * 100) + 250 },
          { command: 'status', count: Math.floor(Math.random() * 80) + 180 },
          { command: 'cat about.txt', count: Math.floor(Math.random() * 60) + 150 }
        ],
        miniTerminalInteractions: Math.floor(Math.random() * 300) + 450
      }
    };

    res.status(200).json(analytics);
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
}
