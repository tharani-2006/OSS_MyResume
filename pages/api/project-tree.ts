import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface TreeNode {
  name: string;
  isDirectory: boolean;
  children?: TreeNode[];
  size?: number;
}

function generateTree(dirPath: string, basePath: string = '', depth: number = 0, maxDepth: number = 3): string[] {
  if (depth > maxDepth) return [];
  
  const result: string[] = [];
  
  try {
    const entries = fs.readdirSync(dirPath);
    // Filter out hidden files and common ignore patterns
    const filteredEntries = entries.filter(entry => 
      !entry.startsWith('.') && 
      !entry.includes('node_modules') && 
      !entry.includes('__pycache__') &&
      !entry.includes('.git')
    );
    
    filteredEntries.sort((a, b) => {
      const aPath = path.join(dirPath, a);
      const bPath = path.join(dirPath, b);
      const aIsDir = fs.statSync(aPath).isDirectory();
      const bIsDir = fs.statSync(bPath).isDirectory();
      
      // Directories first, then files
      if (aIsDir && !bIsDir) return -1;
      if (!aIsDir && bIsDir) return 1;
      return a.localeCompare(b);
    });

    filteredEntries.forEach((entry, index) => {
      const entryPath = path.join(dirPath, entry);
      const stats = fs.statSync(entryPath);
      const isLast = index === filteredEntries.length - 1;
      const prefix = basePath + (isLast ? '└── ' : '├── ');
      const icon = stats.isDirectory() ? '📁' : '📄';
      
      result.push(`${prefix}${icon} ${entry}`);
      
      if (stats.isDirectory() && depth < maxDepth) {
        const childBasePath = basePath + (isLast ? '    ' : '│   ');
        const childTree = generateTree(entryPath, childBasePath, depth + 1, maxDepth);
        result.push(...childTree);
      }
    });
  } catch (error) {
    result.push(`${basePath}└── ❌ Error reading directory`);
  }
  
  return result;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { path: targetPath } = req.query;

  try {
    // Default to projects directory if no path specified
    const relativePath = targetPath && typeof targetPath === 'string' ? targetPath : 'projects';
    
    // Security: Only allow paths within the projects directory
    if (!relativePath.startsWith('projects/') && relativePath !== 'projects') {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied: Only project directories are accessible' 
      });
    }

    // Get the absolute path
    const projectsDir = path.join(process.cwd(), 'projects');
    const fullPath = path.join(process.cwd(), relativePath);

    // Security: Ensure the resolved path is still within the projects directory
    if (!fullPath.startsWith(projectsDir) && fullPath !== projectsDir) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied: Path traversal not allowed' 
      });
    }

    // Check if directory exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ 
        success: false, 
        error: 'Directory not found' 
      });
    }

    // Check if it's a directory
    const stats = fs.statSync(fullPath);
    if (!stats.isDirectory()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Path is not a directory' 
      });
    }

    // Generate the tree structure
    const tree = generateTree(fullPath);
    
    // Count files and directories
    const countFiles = (dirPath: string): { files: number; dirs: number } => {
      let files = 0;
      let dirs = 0;
      
      try {
        const entries = fs.readdirSync(dirPath);
        entries.forEach(entry => {
          if (entry.startsWith('.')) return; // Skip hidden files
          
          const entryPath = path.join(dirPath, entry);
          const entryStats = fs.statSync(entryPath);
          
          if (entryStats.isDirectory()) {
            dirs++;
            const childCounts = countFiles(entryPath);
            files += childCounts.files;
            dirs += childCounts.dirs;
          } else {
            files++;
          }
        });
      } catch (error) {
        // Ignore errors
      }
      
      return { files, dirs };
    };

    const counts = countFiles(fullPath);
    
    // Add summary at the end
    tree.push('');
    tree.push(`${counts.dirs} directories, ${counts.files} files`);

    return res.status(200).json({
      success: true,
      path: relativePath,
      tree,
      totalFiles: counts.files,
      totalDirectories: counts.dirs
    });

  } catch (error: any) {
    console.error('Error generating project tree:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
