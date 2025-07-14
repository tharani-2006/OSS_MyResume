import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { path: filePath } = req.query;

  if (!filePath || typeof filePath !== 'string') {
    return res.status(400).json({ success: false, error: 'Path parameter is required' });
  }

  try {
    // Security: Only allow files within the projects directory
    if (!filePath.startsWith('projects/')) {
      return res.status(403).json({ success: false, error: 'Access denied: Only project files are accessible' });
    }

    // Get the absolute path to the file
    const projectsDir = path.join(process.cwd(), 'projects');
    const fullPath = path.join(process.cwd(), filePath);

    // Security: Ensure the resolved path is still within the projects directory
    if (!fullPath.startsWith(projectsDir)) {
      return res.status(403).json({ success: false, error: 'Access denied: Path traversal not allowed' });
    }

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }

    // Check if it's a file (not a directory)
    const stats = fs.statSync(fullPath);
    if (!stats.isFile()) {
      return res.status(400).json({ success: false, error: 'Path is not a file' });
    }

    // Read the file content
    const content = fs.readFileSync(fullPath, 'utf-8');

    return res.status(200).json({
      success: true,
      content,
      path: filePath,
      size: stats.size,
      lastModified: stats.mtime.toISOString()
    });

  } catch (error: any) {
    console.error('Error reading file:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
