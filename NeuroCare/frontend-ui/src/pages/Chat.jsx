import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatAPI } from '../services/api';
import { Send, MessageCircle, Bot } from 'lucide-react';
import Navbar from '../components/Navbar';
import ChatBubble from '../components/ChatBubble';
import { useToast } from '../components/ToastContext';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      type: 'ai',
      content: "Hello! I'm here to support you. How are you feeling today? You can talk about anything that's on your mind.",
      timestamp: new Date().toISOString(),
      stressLevel: 'Medium',
      suggestions: ['I feel anxious', 'I can’t sleep', 'I need support'],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { showToast } = useToast();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
    const response = await chatAPI.chat(userMessage.content);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.data.response,
        suggestions: response.data.suggestions,
        resources: response.data.resources,
        stressLevel: response.data.stress_level || 'Low', // Add stress detection UI
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm sorry, I couldn't process your message. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      showToast('Chat service failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const quickResponses = [
    "I feel anxious",
    "I'm stressed",
    "I'm having a panic attack",
    "I can't sleep",
    "I feel sad",
  ];

  const getEmotionClass = (message) => {
    if (message.type === 'user') {
      return 'chat-bubble-user';
    }

    const text = (message.emotion || message.content || '').toLowerCase();
    if (text.includes('panic') || text.includes('urgent') || text.includes('scared')) {
      return 'chat-bubble-ai bg-neuro-danger/15 border border-neuro-danger';
    }
    if (text.includes('anxious') || text.includes('stressed') || text.includes('worried')) {
      return 'chat-bubble-ai bg-neuro-warning/15 border border-neuro-warning';
    }
    return 'chat-bubble-ai bg-white/10 border border-white/10';
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-black">
      <Navbar />
      
      <motion.div 
        className="max-w-4xl mx-auto px-4 pt-24 pb-24 h-screen flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div className="flex items-center gap-3 mb-8" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center">
            <MessageCircle className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-transparent bg-clip-text text-transparent">
              AI Therapy Chat
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="status-online" />
              <span className="text-sm text-green-400 font-medium">NeuroCare AI Online</span>
            </div>
          </div>
        </motion.div>

        {/* Messages Container */}
        <div className="glass-card flex-1 flex flex-col overflow-hidden rounded-3xl shadow-2xl border border-white/20">
          <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
            <AnimatePresence>
              {messages.map((message, idx) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: idx * 0.08, ease: 'easeOut' }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <ChatBubble message={message} type={message.type} onSuggestionClick={(suggestion) => setInput(suggestion)} />
                </motion.div>
              ))}
            </AnimatePresence>
            
            {loading && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="glass-card bg-gradient-to-br from-white/8 to-white/4 border border-white/25 rounded-3xl px-6 py-5 max-w-2xl shadow-xl">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/20">
                      <Bot className="w-6 h-6 text-blue-300 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-blue-300">NeuroCare is thinking...</p>
                      <p className="text-sm text-gray-400">Analyzing your message and crafting a caring response.</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 rounded-full bg-white/15 animate-pulse" />
                    <div className="h-4 rounded-full bg-white/15 w-5/6 animate-pulse" style={{ animationDelay: '0.1s' }} />
                    <div className="h-4 rounded-full bg-white/15 w-3/4 animate-pulse" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-white/20 p-8 bg-gradient-to-b from-white/8 to-white/4">
            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-4 mb-8 pb-6 border-b border-white/15">
              {quickResponses.map((response, idx) => (
                <motion.button
                  key={response}
                  className="glass-card px-5 py-3 rounded-2xl text-sm border-white/25 hover:border-blue-400/60 hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all duration-300 font-medium text-gray-200 hover:text-white"
                  onClick={() => setInput(response)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {response}
                </motion.button>
              ))}
            </div>
            
            {/* Input + Send */}
            <div className="flex items-end gap-4">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share how you're feeling today..."
                  className="w-full bg-white/8 border border-white/25 rounded-3xl px-6 py-5 text-lg placeholder-gray-400 focus:border-blue-400 focus:shadow-[0_0_25px_rgba(59,130,246,0.3)] focus:outline-none transition-all duration-300 hover:border-white/35"
                  disabled={loading}
                />
              </div>
              <motion.button
                className="neon-button p-5 rounded-3xl shadow-2xl w-16 h-16 flex items-center justify-center hover:shadow-[0_0_45px_rgba(99,102,241,0.7)] disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSend}
                disabled={loading || !input.trim()}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className={`w-7 h-7 transition-transform ${loading ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Chat;
