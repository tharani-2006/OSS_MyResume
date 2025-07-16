"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function NotFound() {
  const [deploymentVersion, setDeploymentVersion] = useState('1.37.37');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    fetch('/api/version')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDeploymentVersion(data.data.version);
        }
      })
      .catch(() => {
        // Keep fallback
      });
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex flex-col">
      <div className="border-b border-green-400/30 p-4">
        <div className="flex items-center justify-between">
          <span className="text-green-400 text-sm">
            terminal@portfolio:~/404$ - Error Handler v{deploymentVersion}
          </span>
          <span className="text-xs text-green-400/60">
            Version {deploymentVersion} | Error Code: 404
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-red-400 mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl text-green-300 mb-4">
            Command Not Found
          </h2>
          <p className="text-green-400/80 text-lg mb-8">
            The path you're looking for doesn't exist in this terminal session.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link href="/" className="flex-1">
              <button className="w-full bg-green-400 text-black px-6 py-3 rounded font-semibold hover:bg-green-300 transition-colors">
                🏠 Return to Terminal
              </button>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="flex-1 border border-green-400 text-green-400 px-6 py-3 rounded font-semibold hover:bg-green-400/10 transition-colors"
            >
              ← Go Back
            </button>
          </div>

          <div className="mt-12 pt-6 border-t border-green-400/30">
            <p className="text-green-400/60 text-sm">
              Portfolio Terminal System v{deploymentVersion} | 
              Error Logged: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
