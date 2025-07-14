import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { path: dirPath } = req.query;

  if (!dirPath || typeof dirPath !== 'string') {
    return res.status(400).json({ success: false, error: 'Path parameter is required' });
  }

  try {
    // Security: Only allow directories within the projects directory
    if (!dirPath.startsWith('projects/')) {
      return res.status(403).json({ success: false, error: 'Access denied: Only project directories are accessible' });
    }

    // Get the absolute path to the directory
    const projectsDir = path.join(process.cwd(), 'projects');
    const fullPath = path.join(process.cwd(), dirPath);

    // Security: Ensure the resolved path is still within the projects directory
    if (!fullPath.startsWith(projectsDir)) {
      return res.status(403).json({ success: false, error: 'Access denied: Path traversal not allowed' });
    }

    // Check if directory exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ success: false, error: 'Directory not found' });
    }

    // Check if it's a directory
    const stats = fs.statSync(fullPath);
    if (!stats.isDirectory()) {
      return res.status(400).json({ success: false, error: 'Path is not a directory' });
    }

    // Read the directory contents
    const entries = fs.readdirSync(fullPath);
    const files = entries.map(entry => {
      const entryPath = path.join(fullPath, entry);
      const entryStats = fs.statSync(entryPath);
      
      return {
        name: entry,
        isDirectory: entryStats.isDirectory(),
        size: entryStats.size,
        lastModified: entryStats.mtime.toISOString(),
        permissions: entryStats.isDirectory() ? 'drwxr-xr-x' : '-rw-r--r--'
      };
    });

    // Sort directories first, then files, both alphabetically
    files.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });

    return res.status(200).json({
      success: true,
      path: dirPath,
      files,
      totalFiles: files.filter(f => !f.isDirectory).length,
      totalDirectories: files.filter(f => f.isDirectory).length
    });

  } catch (error: any) {
    console.error('Error reading directory:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
