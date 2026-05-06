import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const banners = [
  {
    title: "Feeling anxious? Try 2-min breathing exercise",
    subtitle: "Deep breathing reduces anxiety by 40% in 2 minutes",
    cta: "Start Now",
    action: "/panic"
  },
  {
    title: "You slept 5.2 hrs last night 😴",
    subtitle: "Aim for 7-9 hours. Better sleep = better mood",
    cta: "Sleep Tips",
    action: "/dashboard"
  },
  {
    title: "High stress detected this week",
    subtitle: "Book a therapy session for better coping strategies",
    cta: "Book Therapy",
    action: "/doctors"
  }
];

const AIBanner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCTA = () => {
    window.location.href = banners[current].action;
  };

  return (
    <motion.div
      className="glass-card p-8 mb-8 overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))' }}
    >
      <motion.div
        className="float-animation"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="max-w-md mx-auto text-center">
          <motion.h2 
            key={`title-${current}`}
            className="text-2xl md:text-3xl font-bold mb-4 neon-text"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            {banners[current].title}
          </motion.h2>
          <p className="text-gray-300 mb-6 text-lg">{banners[current].subtitle}</p>
          <motion.button
            className="neon-button px-8 py-4 rounded-2xl text-lg font-bold flex items-center gap-3 mx-auto"
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(99,102,241,0.6)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCTA}
          >
            {banners[current].cta} <Play className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {banners.map((_, idx) => (
          <div
            key={idx}
            className={`w-3 h-3 rounded-full transition-all ${idx === current ? 'bg-white w-8' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default AIBanner;

