import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle } from 'lucide-react';

export function AnalyzingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center">
      <div className="text-center text-white px-4">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mx-auto mb-8 w-24 h-24 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/40 flex items-center justify-center"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
        </motion.div>
        
        <h2 className="text-3xl font-bold mb-4">Analyzing Evidence...</h2>
        <p className="text-xl text-white/80 mb-8">AI models are processing your media</p>
        
        <div className="max-w-md mx-auto space-y-3 text-left">
          {[
            { text: 'Uploading to secure server', delay: 0 },
            { text: 'Extracting media features', delay: 0.5 },
            { text: 'Running AI detection models', delay: 1 },
            { text: 'Generating confidence scores', delay: 1.5 },
            { text: 'Creating forensic report', delay: 2 },
          ].map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: step.delay }}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-lg px-4 py-3"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: step.delay + 0.2 }}
                className="w-5 h-5 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0"
              >
                <CheckCircle className="text-white" size={16} strokeWidth={3} />
              </motion.div>
              <span>{step.text}</span>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8">
          <div className="inline-block bg-white/20 backdrop-blur-md rounded-full px-6 py-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm">Processing... estimated 30 seconds</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}