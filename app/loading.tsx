import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
      <div className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <h1 className="text-4xl font-bold text-green-300">Portfolio Terminal</h1>
          <p className="text-lg text-green-400/80">Initializing system...</p>
        </motion.div>

        {/* Terminal-style loading animation */}
        <div className="border border-green-400/30 rounded bg-black/50 p-6 max-w-md mx-auto">
          <div className="space-y-2 text-sm">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-yellow-400"
            >
              $ systemctl start portfolio-terminal
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-green-400/80"
            >
              Loading system modules...
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-green-400/80"
            >
              Initializing network commands...
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="text-green-400/80"
            >
              Loading project data...
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              className="text-green-300"
            >
              ✓ Portfolio Terminal ready
            </motion.div>
          </div>
          
          {/* Loading bar */}
          <div className="mt-4 bg-green-400/20 rounded h-2 overflow-hidden">
            <motion.div
              className="bg-green-400 h-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Animated cursor */}
        <motion.div
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-xl"
        >
          _
        </motion.div>

        <div className="text-xs text-green-400/40">
          Version 35 | Build #35 | Loading...
        </div>
      </div>
    </div>
  );
}
