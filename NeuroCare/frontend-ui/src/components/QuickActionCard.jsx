import React from 'react';
import { motion } from 'framer-motion';

const QuickActionCard = ({ icon: Icon, title, path, color = 'from-indigo-500 to-purple-600' }) => {
  const navigateTo = () => {
    window.location.href = path;
  };

  return (
    <motion.div
      className="glass-card p-8 text-center cursor-pointer group"
      whileHover={{ scale: 1.05, y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={navigateTo}
    >
      <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl ${color} flex items-center justify-center shadow-2xl group-hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] transition-all duration-300`}>
        <Icon className="w-12 h-12 text-white drop-shadow-lg" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2 group-hover:neon-text">{title}</h3>
      <p className="text-gray-300 text-sm">Get immediate support</p>
    </motion.div>
  );
};

export default QuickActionCard;

