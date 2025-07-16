"use client";

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-black text-green-400 font-mono">
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-2xl w-full text-center">
            {/* Terminal Header */}
            <div className="border border-red-400/30 rounded-t bg-red-400/10 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-red-500/50 rounded-full"></div>
                    <div className="w-3 h-3 bg-red-500/30 rounded-full"></div>
                  </div>
                  <span className="text-red-400 text-sm">
                    terminal@portfolio:~/error$ - System Error
                  </span>
                </div>
                <div className="text-xs text-red-400/60">
                  Build #36 | CRITICAL ERROR
                </div>
              </div>
            </div>

            {/* Error Content */}
            <div
              className="border-x border-b border-red-400/30 rounded-b bg-black/50 p-8 space-y-6"
            >
              <div className="space-y-4">
                <div
                  className="text-6xl text-red-400 mb-4"
                >
                  💥
                </div>
                
                <h1 className="text-3xl text-red-400 font-bold">
                  System Error Detected
                </h1>
                
                <p className="text-green-400/80 text-lg">
                  The portfolio terminal encountered an unexpected error.
                </p>
              </div>

              <div className="border border-red-400/30 rounded p-4 bg-red-400/5 text-left">
                <h3 className="text-red-300 font-semibold mb-2">Error Details:</h3>
                <div className="text-sm font-mono space-y-1">
                  <div className="text-red-400">
                    ERROR: {error.name || 'Unknown Error'}
                  </div>
                  <div className="text-orange-400">
                    MESSAGE: {error.message || 'No error message available'}
                  </div>
                  {error.digest && (
                    <div className="text-yellow-400">
                      DIGEST: {error.digest}
                    </div>
                  )}
                  <div className="text-blue-400">
                    TIMESTAMP: {new Date().toISOString()}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border border-green-400/30 rounded p-4 bg-green-400/5">
                  <h3 className="text-green-300 font-semibold mb-2">🔧 Recovery Options:</h3>
                  <div className="space-y-1 text-sm text-left">
                    <div><span className="text-yellow-400">Ctrl + R</span> - Refresh the page</div>
                    <div><span className="text-yellow-400">F5</span> - Hard reload</div>
                    <div><span className="text-yellow-400">Ctrl + Shift + R</span> - Clear cache and reload</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={reset}
                    className="flex-1 bg-green-400 text-black px-6 py-3 rounded font-semibold hover:bg-green-300 transition-colors"
                  >
                    🔄 Try Again
                  </button>
                  
                  <button
                    onClick={() => window.location.href = '/'}
                    className="flex-1 border border-green-400 text-green-400 px-6 py-3 rounded font-semibold hover:bg-green-400/10 transition-colors"
                  >
                    🏠 Return Home
                  </button>
                </div>
              </div>

              <div className="text-center">
                <p className="text-green-400/60 text-sm">
                  Portfolio Terminal v1.37.37 | 
                  If this error persists, please refresh your browser
                </p>
                <p className="text-green-400/40 text-xs mt-2">
                  Error logged for debugging purposes
                </p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
