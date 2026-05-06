import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 1, height = 'h-64', className = '', type = 'card' }) => {
  if (type === 'hospital') {
    return (
      <div className={`space-y-6 ${className}`}>
        {[...Array(count)].map((_, idx) => (
          <motion.div
            key={idx}
            className="glass-card p-8 rounded-3xl animate-pulse border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="flex items-start justify-between gap-6 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-20 h-8 bg-white/10 rounded-2xl"></div>
                  <div className="w-16 h-8 bg-white/5 rounded-2xl"></div>
                </div>
                <div className="h-8 bg-white/15 rounded-xl w-3/4 mb-3"></div>
                <div className="h-5 bg-white/8 rounded-lg w-full mb-2"></div>
                <div className="h-5 bg-white/8 rounded-lg w-2/3 mb-4"></div>
                <div className="flex gap-3">
                  <div className="w-16 h-6 bg-yellow-500/10 rounded-xl"></div>
                  <div className="w-20 h-6 bg-green-500/10 rounded-xl"></div>
                  <div className="w-18 h-6 bg-white/5 rounded-xl"></div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 bg-white/5 rounded-2xl"></div>
                <div className="w-12 h-12 bg-white/5 rounded-2xl"></div>
                <div className="w-12 h-12 bg-white/5 rounded-2xl"></div>
              </div>
            </div>
            <div className="flex gap-3 pt-6 border-t border-white/5">
              <div className="w-32 h-8 bg-blue-500/10 rounded-2xl"></div>
              <div className="w-28 h-8 bg-emerald-500/10 rounded-2xl"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, idx) => (
        <motion.div
          key={idx}
          className={`glass-card p-6 animate-pulse ${height} border border-white/10`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.05 }}
        >
          <div className="h-6 bg-white/10 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-white/5 rounded w-1/2 mb-3"></div>
          <div className="h-4 bg-white/5 rounded w-1/3"></div>
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;

