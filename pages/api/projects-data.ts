import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const projectsDir = path.join(process.cwd(), 'projects');
    
    // Check if projects directory exists
    if (!fs.existsSync(projectsDir)) {
      return res.status(404).json({ error: 'Projects directory not found' });
    }

    const projects: any[] = [];
    const projectFolders = fs.readdirSync(projectsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const projectName of projectFolders) {
      const projectPath = path.join(projectsDir, projectName);
      const readmePath = path.join(projectPath, 'README.md');
      
      let projectInfo: {
        name: string;
        path: string;
        status: string;
        technology: string;
        description: string;
        features: string[];
        files: Array<{
          name: string;
          type: string;
          size: number;
          extension?: string;
        }>;
        lastModified: string | null;
        size: number;
      } = {
        name: projectName,
        path: projectPath,
        status: 'unknown',
        technology: 'unknown',
        description: 'No description available',
        features: [],
        files: [],
        lastModified: null,
        size: 0
      };

      // Get basic directory info
      try {
        const stats = fs.statSync(projectPath);
        projectInfo.lastModified = stats.mtime.toISOString();
      } catch (error) {
        projectInfo.lastModified = null;
      }

      // Read README if it exists
      if (fs.existsSync(readmePath)) {
        try {
          const readmeContent = fs.readFileSync(readmePath, 'utf-8');
          
          // Extract title and description
          const lines = readmeContent.split('\n');
          const titleLine = lines.find(line => line.startsWith('# '));
          if (titleLine) {
            projectInfo.name = titleLine.replace('# ', '');
          }

          // Extract description (first paragraph after title)
          const descriptionStart = lines.findIndex(line => line.trim() && !line.startsWith('#'));
          if (descriptionStart > 0 && lines[descriptionStart]) {
            projectInfo.description = lines[descriptionStart];
          }

          // Extract technology stack
          const techLine = lines.find(line => line.includes('Technology') || line.includes('Technologies'));
          if (techLine) {
            projectInfo.technology = techLine;
          }

          // Extract features
          const featuresSection = readmeContent.match(/## Features\n([\s\S]*?)(?=\n##|\n$)/);
          if (featuresSection) {
            projectInfo.features = featuresSection[1]
              .split('\n')
              .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
              .map(line => line.replace(/^[-*]\s*/, '').replace(/\*\*/g, ''))
              .slice(0, 5); // Limit to 5 features
          }
        } catch (error) {
          // Handle README reading error silently
        }
      }

      // Get file listing
      try {
        const getFiles = (dir: string, prefix = ''): Array<{name: string; type: string; size: number; extension?: string}> => {
          const files: Array<{name: string; type: string; size: number; extension?: string}> = [];
          const items = fs.readdirSync(dir, { withFileTypes: true });
          
          for (const item of items) {
            const itemPath = path.join(dir, item.name);
            const relativePath = path.join(prefix, item.name);
            
            if (item.isDirectory()) {
              // Add directory
              files.push({
                name: relativePath + '/',
                type: 'directory',
                size: 0
              });
              
              // Recursively get files (limit depth for performance)
              if (prefix.split('/').length < 3) {
                files.push(...getFiles(itemPath, relativePath));
              }
            } else {
              // Add file
              try {
                const stats = fs.statSync(itemPath);
                files.push({
                  name: relativePath,
                  type: 'file',
                  size: stats.size,
                  extension: path.extname(item.name)
                });
                projectInfo.size += stats.size;
              } catch (error) {
                // Handle file stat error silently
              }
            }
          }
          return files;
        };

        projectInfo.files = getFiles(projectPath).slice(0, 50); // Limit files for performance
      } catch (error) {
        // Handle file listing error silently
      }

      // Determine project status based on files
      const hasMainFile = projectInfo.files.some(file => 
        file.name.includes('main.') || 
        file.name.includes('app.') || 
        file.name.includes('index.') ||
        file.name === 'pom.xml' ||
        file.name === 'requirements.txt'
      );
      
      const hasReadme = projectInfo.files.some(file => file.name.toLowerCase().includes('readme'));
      
      if (hasMainFile && hasReadme) {
        projectInfo.status = 'implemented';
      } else if (hasReadme) {
        projectInfo.status = 'documented';
      } else {
        projectInfo.status = 'planned';
      }

      projects.push(projectInfo);
    }

    // Sort projects by last modified date
    projects.sort((a, b) => {
      if (a.lastModified && b.lastModified) {
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
      }
      return 0;
    });

    const response = {
      timestamp: new Date().toISOString(),
      totalProjects: projects.length,
      implementedProjects: projects.filter(p => p.status === 'implemented').length,
      totalSize: projects.reduce((sum, p) => sum + p.size, 0),
      projects: projects,
      summary: {
        byStatus: {
          implemented: projects.filter(p => p.status === 'implemented').length,
          documented: projects.filter(p => p.status === 'documented').length,
          planned: projects.filter(p => p.status === 'planned').length
        },
        byTechnology: projects.reduce((acc, p) => {
          if (p.technology.toLowerCase().includes('python')) acc.python++;
          if (p.technology.toLowerCase().includes('java')) acc.java++;
          if (p.technology.toLowerCase().includes('javascript') || p.technology.toLowerCase().includes('react')) acc.javascript++;
          if (p.technology.toLowerCase().includes('typescript')) acc.typescript++;
          return acc;
        }, { python: 0, java: 0, javascript: 0, typescript: 0, other: 0 })
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching projects data:', error);
    res.status(500).json({ error: 'Failed to fetch projects data' });
  }
}
