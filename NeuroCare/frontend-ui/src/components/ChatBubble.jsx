import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertTriangle, Heart, Zap } from 'lucide-react';

const ChatBubble = ({ message, type, onSuggestionClick }) => {
  const isAI = type === 'ai';
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    if (isAI && message.content) {
      setIsTyping(true);
      setDisplayedText('');
      
      const words = message.content.split(' ');
      let currentIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (currentIndex < words.length) {
          setDisplayedText(prev => prev + (prev ? ' ' : '') + words[currentIndex]);
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typeInterval);
        }
      }, 50); // Adjust typing speed here
      
      return () => clearInterval(typeInterval);
    } else {
      setDisplayedText(message.content || '');
    }
  }, [message.content, isAI]);
  
  const getStressIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'high':
      case 'critical':
        return <AlertTriangle className="w-4 h-4" />;
      case 'medium':
        return <Zap className="w-4 h-4" />;
      default:
        return <Heart className="w-4 h-4" />;
    }
  };
  
  const getStressColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'from-red-500/20 to-red-600/20 border-red-500/40 text-red-300';
      case 'medium':
        return 'from-orange-500/20 to-yellow-500/20 border-orange-500/40 text-orange-300';
      default:
        return 'from-green-500/20 to-blue-500/20 border-green-500/40 text-green-300';
    }
  };
  
  return (
    <motion.div
      className={`max-w-[85%] p-6 rounded-3xl shadow-2xl glass-card mb-6 transition-all duration-300 ${
        isAI 
          ? 'chat-bubble-ai rounded-br-md ml-6 bg-gradient-to-br from-white/12 to-white/8 border-white/25 hover:border-white/35' 
          : 'chat-bubble-user rounded-bl-md mr-6 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 text-white shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:shadow-[0_0_35px_rgba(99,102,241,0.7)]'
      }`}
      initial={{ opacity: 0, y: 25, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ scale: isAI ? 1.02 : 1.01 }}
    >
      {isAI && (
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/15">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/20">
            <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>
          <div className="flex-1">
            <span className="text-sm font-semibold text-blue-300">NeuroCare AI</span>
            <p className="text-xs text-gray-400">Always here to help</p>
          </div>
          <div className="w-3 h-3 bg-green-400 rounded-full shadow-lg animate-pulse" title="Online" />
        </div>
      )}
      
      <div className="relative">
        <p className="text-base leading-relaxed whitespace-pre-wrap">
          {displayedText}
          {isTyping && <span className="animate-pulse text-blue-400">|</span>}
        </p>
      </div>
      
      {message.stressLevel && (
        <motion.div 
          className="mt-5 pt-4 border-t border-white/15"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className={`inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r ${getStressColor(message.stressLevel)} border rounded-2xl text-sm font-medium shadow-lg`}>
            {getStressIcon(message.stressLevel)}
            <span>AI detected stress level:</span>
            <span className="font-bold text-lg">{message.stressLevel}</span>
          </div>
        </motion.div>
      )}
      
      {message.suggestions?.length > 0 && (
        <motion.div 
          className="mt-5 pt-4 border-t border-white/15"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-sm text-gray-300 mb-3 font-medium">💡 Quick replies:</p>
          <div className="flex flex-wrap gap-3">
            {message.suggestions.slice(0, 3).map((suggestion, idx) => (
              <motion.button
                key={idx}
                className="px-4 py-2 bg-gradient-to-r from-white/10 to-white/5 hover:from-blue-500/20 hover:to-purple-500/20 border border-white/20 hover:border-blue-400/50 rounded-2xl text-sm transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] font-medium"
                onClick={() => onSuggestionClick?.(suggestion)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + idx * 0.1 }}
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
      
      {message.resources && (
        <motion.div 
          className="mt-5 pt-4 border-t border-white/15 text-sm space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <p className="font-semibold text-red-300 mb-3 flex items-center gap-2">
            🚨 Emergency Resources:
          </p>
          {message.resources.helpline && (
            <motion.a 
              href={`tel:${message.resources.helpline}`} 
              className="block p-3 bg-gradient-to-r from-red-500/15 to-red-600/15 border border-red-500/30 rounded-2xl hover:from-red-500/25 hover:to-red-600/25 hover:border-red-400/50 transition-all duration-300 hover:scale-102 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              📞 Crisis Hotline: <span className="font-bold text-red-300">{message.resources.helpline}</span>
            </motion.a>
          )}
        </motion.div>
      )}
      
      <div className={`text-xs opacity-60 mt-3 ${isAI ? 'text-right' : 'text-left'}`}>
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </motion.div>
  );
};

export default ChatBubble;

