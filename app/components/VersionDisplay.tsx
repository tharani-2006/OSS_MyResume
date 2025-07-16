"use client";

import { useState, useEffect } from 'react';

interface VersionInfo {
  version: string;
  shortVersion?: string;
  buildNumber: number;
  commitCount?: number;
  commit: string;
  environment: string;
  uptime: number;
}

export default function VersionDisplay() {
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchVersionInfo();
  }, []);

  const fetchVersionInfo = async () => {
    try {
      const response = await fetch('/api/version');
      const data = await response.json();
      if (data.success) {
        setVersionInfo(data.data);
      }
    } catch (error) {
      console.warn('Could not fetch version info:', error);
      // Fallback version info
      setVersionInfo({
        version: '1.37.37',
        shortVersion: 'v37',
        buildNumber: 37,
        commitCount: 37,
        commit: 'unknown',
        environment: 'production',
        uptime: 0
      });
    }
  };

  if (!versionInfo) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div 
        className={`transition-all duration-300 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-60 scale-95'
        }`}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        <div className="bg-black/90 border border-green-400/30 rounded-lg p-3 font-mono text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400">
              {versionInfo.version}
            </span>
          </div>
          
          {isVisible && (
            <div className="mt-2 space-y-1 text-green-400/70 min-w-48">
              <div className="flex justify-between">
                <span>Build:</span>
                <span>#{versionInfo.buildNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Commit:</span>
                <span className="font-mono">{versionInfo.commit}</span>
              </div>
              <div className="flex justify-between">
                <span>Env:</span>
                <span>{versionInfo.environment}</span>
              </div>
              <div className="flex justify-between">
                <span>Uptime:</span>
                <span>{Math.floor(versionInfo.uptime / 60)}m</span>
              </div>
              <div className="border-t border-green-400/20 pt-1 mt-2">
                <div className="text-center text-green-400/50">
                  Portfolio Terminal System
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
