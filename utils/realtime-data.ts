// Utility functions for fetching real-time data from APIs

export interface SystemInfo {
  timestamp: string;
  uptime: number;
  memory: NodeJS.MemoryUsage;
  platform: string;
  version: string;
  pid: number;
  nodeVersion: string;
  loadAverage: number[];
  totalMemory: number;
  freeMemory: number;
  cpuInfo: any[];
  networkInterfaces: any;
  hostname: string;
  userInfo: any;
}

export interface PingResult {
  target: string;
  timestamp: string;
  responseTime: number | null;
  status: 'success' | 'failed';
  error?: string;
  packets: Array<{ seq: number; time: number }>;
  statistics: {
    transmitted: number;
    received: number;
    loss: number;
  };
}

export interface GitHubData {
  user: {
    login: string;
    name: string;
    bio: string;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
  };
  repositories: Array<{
    name: string;
    description: string;
    language: string;
    stargazers_count: number;
    forks_count: number;
    size: number;
    updated_at: string;
    private: boolean;
    topics: string[];
  }>;
  lastUpdated: string;
  totalStars: number;
  totalForks: number;
  languages: Record<string, number>;
}

export interface NetworkData {
  timestamp: string;
  interfaces: Array<{
    name: string;
    type: string;
    status: string;
    ip: string;
    netmask: string;
    gateway?: string;
    mac: string;
    mtu: number;
    rxPackets: number;
    txPackets: number;
    rxBytes: number;
    txBytes: number;
    rxErrors: number;
    txErrors: number;
    speed: string;
    duplex: string;
  }>;
  connections: Array<{
    protocol: string;
    localAddress: string;
    foreignAddress: string;
    state: string;
    pid: number;
    program: string;
  }>;
  routingTable: Array<{
    destination: string;
    gateway: string;
    genmask: string;
    flags: string;
    metric: number;
    iface: string;
  }>;
  arpTable: Array<{
    address: string;
    hwtype: string;
    hwaddress: string;
    flags: string;
    iface: string;
  }>;
  statistics: {
    totalPackets: number;
    totalBytes: number;
    bandwidth: {
      current: number;
      peak: number;
      average: number;
    };
    latency: {
      current: number;
      average: number;
      peak: number;
    };
  };
}

export interface ProjectsData {
  timestamp: string;
  totalProjects: number;
  implementedProjects: number;
  totalSize: number;
  projects: Array<{
    name: string;
    path: string;
    status: 'implemented' | 'documented' | 'planned';
    technology: string;
    description: string;
    features: string[];
    files: Array<{
      name: string;
      type: 'file' | 'directory';
      size: number;
      extension?: string;
    }>;
    lastModified: string | null;
    size: number;
  }>;
  summary: {
    byStatus: {
      implemented: number;
      documented: number;
      planned: number;
    };
    byTechnology: {
      python: number;
      java: number;
      javascript: number;
      typescript: number;
      other: number;
    };
  };
}

export interface AnalyticsData {
  timestamp: string;
  visitors: {
    current: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    total: number;
  };
  pageViews: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    total: number;
  };
  popularSections: Array<{
    name: string;
    views: number;
    percentage: number;
  }>;
  performance: {
    loadTime: number;
    ttfb: number;
    fcp: number;
    lcp: number;
    cls: number;
    fid: number;
  };
  geography: Array<{
    country: string;
    visitors: number;
    percentage: number;
  }>;
  devices: {
    desktop: { count: number; percentage: number };
    mobile: { count: number; percentage: number };
    tablet: { count: number; percentage: number };
  };
  browsers: Array<{
    name: string;
    users: number;
    percentage: number;
  }>;
  referrers: Array<{
    source: string;
    visitors: number;
    percentage: number;
  }>;
  terminalUsage: {
    totalSessions: number;
    averageSessionTime: number;
    commandsExecuted: number;
    mostUsedCommands: Array<{
      command: string;
      count: number;
    }>;
    miniTerminalInteractions: number;
  };
}

// Cache for storing fetched data to avoid excessive API calls
const dataCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

// Cache TTL in milliseconds
const CACHE_TTL = {
  systemInfo: 5000,    // 5 seconds
  ping: 10000,         // 10 seconds
  githubData: 300000,  // 5 minutes
  networkData: 5000,   // 5 seconds
  analytics: 30000,    // 30 seconds
  projectsData: 60000  // 1 minute
};

function getCachedData<T>(key: string): T | null {
  const cached = dataCache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data;
  }
  return null;
}

function setCachedData<T>(key: string, data: T, ttl: number): void {
  dataCache.set(key, { data, timestamp: Date.now(), ttl });
}

export async function fetchSystemInfo(): Promise<SystemInfo> {
  const cacheKey = 'systemInfo';
  const cached = getCachedData<SystemInfo>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch('/api/system-info');
    if (!response.ok) throw new Error('Failed to fetch system info');
    const data = await response.json();
    setCachedData(cacheKey, data, CACHE_TTL.systemInfo);
    return data;
  } catch (error) {
    console.error('Error fetching system info:', error);
    // Return fallback data
    return {
      timestamp: new Date().toISOString(),
      uptime: 0,
      memory: { rss: 0, heapTotal: 0, heapUsed: 0, external: 0, arrayBuffers: 0 },
      platform: 'unknown',
      version: 'unknown',
      pid: 0,
      nodeVersion: 'unknown',
      loadAverage: [0, 0, 0],
      totalMemory: 0,
      freeMemory: 0,
      cpuInfo: [],
      networkInterfaces: {},
      hostname: 'localhost',
      userInfo: {}
    };
  }
}

export async function fetchPingData(target: string = 'cisco.com'): Promise<PingResult> {
  const cacheKey = `ping-${target}`;
  const cached = getCachedData<PingResult>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(`/api/ping?target=${encodeURIComponent(target)}`);
    if (!response.ok) throw new Error('Failed to fetch ping data');
    const data = await response.json();
    setCachedData(cacheKey, data, CACHE_TTL.ping);
    return data;
  } catch (error) {
    console.error('Error fetching ping data:', error);
    // Return fallback data
    return {
      target,
      timestamp: new Date().toISOString(),
      responseTime: null,
      status: 'failed',
      error: 'Network error',
      packets: [],
      statistics: { transmitted: 3, received: 0, loss: 100 }
    };
  }
}

export async function fetchGitHubData(): Promise<GitHubData> {
  const cacheKey = 'githubData';
  const cached = getCachedData<GitHubData>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch('/api/github-data');
    if (!response.ok) throw new Error('Failed to fetch GitHub data');
    const data = await response.json();
    setCachedData(cacheKey, data, CACHE_TTL.githubData);
    return data;
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    // Return fallback data
    return {
      user: {
        login: 'sivareddy',
        name: 'Siva Reddy Venna',
        bio: 'Software Engineer Trainee @ Cisco Systems',
        public_repos: 0,
        followers: 0,
        following: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      repositories: [],
      lastUpdated: new Date().toISOString(),
      totalStars: 0,
      totalForks: 0,
      languages: {}
    };
  }
}

export async function fetchNetworkData(): Promise<NetworkData> {
  const cacheKey = 'networkData';
  const cached = getCachedData<NetworkData>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch('/api/network-data');
    if (!response.ok) throw new Error('Failed to fetch network data');
    const data = await response.json();
    setCachedData(cacheKey, data, CACHE_TTL.networkData);
    return data;
  } catch (error) {
    console.error('Error fetching network data:', error);
    // Return fallback data
    return {
      timestamp: new Date().toISOString(),
      interfaces: [],
      connections: [],
      routingTable: [],
      arpTable: [],
      statistics: {
        totalPackets: 0,
        totalBytes: 0,
        bandwidth: { current: 0, peak: 0, average: 0 },
        latency: { current: 0, average: 0, peak: 0 }
      }
    };
  }
}

export async function fetchAnalyticsData(): Promise<AnalyticsData> {
  const cacheKey = 'analytics';
  const cached = getCachedData<AnalyticsData>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch('/api/analytics');
    if (!response.ok) throw new Error('Failed to fetch analytics data');
    const data = await response.json();
    setCachedData(cacheKey, data, CACHE_TTL.analytics);
    return data;
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    // Return fallback data
    return {
      timestamp: new Date().toISOString(),
      visitors: { current: 0, today: 0, thisWeek: 0, thisMonth: 0, total: 0 },
      pageViews: { today: 0, thisWeek: 0, thisMonth: 0, total: 0 },
      popularSections: [],
      performance: { loadTime: 0, ttfb: 0, fcp: 0, lcp: 0, cls: 0, fid: 0 },
      geography: [],
      devices: { desktop: { count: 0, percentage: 0 }, mobile: { count: 0, percentage: 0 }, tablet: { count: 0, percentage: 0 } },
      browsers: [],
      referrers: [],
      terminalUsage: {
        totalSessions: 0,
        averageSessionTime: 0,
        commandsExecuted: 0,
        mostUsedCommands: [],
        miniTerminalInteractions: 0
      }
    };
  }
}

export async function fetchProjectsData(): Promise<ProjectsData> {
  const cacheKey = 'projectsData';
  const cached = getCachedData<ProjectsData>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch('/api/projects-data');
    if (!response.ok) throw new Error('Failed to fetch projects data');
    const data = await response.json();
    setCachedData(cacheKey, data, CACHE_TTL.projectsData);
    return data;
  } catch (error) {
    console.error('Error fetching projects data:', error);
    // Return fallback data
    return {
      timestamp: new Date().toISOString(),
      totalProjects: 0,
      implementedProjects: 0,
      totalSize: 0,
      projects: [],
      summary: {
        byStatus: { implemented: 0, documented: 0, planned: 0 },
        byTechnology: { python: 0, java: 0, javascript: 0, typescript: 0, other: 0 }
      }
    };
  }
}

// Utility function to format bytes
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Utility function to format uptime
export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

// Utility function to format timestamp
export function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString();
}
