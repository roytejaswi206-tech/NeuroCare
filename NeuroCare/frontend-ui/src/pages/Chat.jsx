import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatAPI } from '../services/api';
import { Send, MessageCircle, Bot, Sparkles, RefreshCw, Clock, User, ThumbsUp, ThumbsDown, Copy, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useToast } from '../components/ToastContext';
import { getCurrentUser } from '../utils/storage';

// Typing indicator component
const TypingIndicator = () => (
  <div className="flex items-center space-x-1.5 px-4 py-3">
    <motion.div
      className="w-2 h-2 bg-blue-400 rounded-full"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
    />
    <motion.div
      className="w-2 h-2 bg-purple-400 rounded-full"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
    />
    <motion.div
      className="w-2 h-2 bg-pink-400 rounded-full"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
    />
  </div>
);

// Streaming text component
const StreamingText = ({ text, isStreaming }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    if (isStreaming) {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 15);
      return () => clearInterval(interval);
    } else {
      setDisplayedText(text);
    }
  }, [text, isStreaming]);

  return <div className="whitespace-pre-wrap">{displayedText}</div>;
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { showToast } = useToast();
  const [user, setUser] = useState(null);

  const quickResponses = [
    { text: "I feel anxious", icon: "😰" },
    { text: "I'm stressed", icon: "😣" },
    { text: "I can't sleep", icon: "😴" },
    { text: "I feel sad", icon: "😢" },
    { text: "Need breathing help", icon: "🧘" },
    { text: "Panic attack", icon: "🆘" },
  ];

  const aiPersonas = {
    anxiety: {
      greeting: "I understand anxiety can be overwhelming. Let's work through this together. 🌿",
      suggestions: ["Tell me about your anxiety", "Breathing exercise", "Grounding technique"]
    },
    sleep: {
      greeting: "Sleep is so important for mental health. Let's explore what's keeping you awake. 🌙",
      suggestions: ["Sleep hygiene tips", "Relaxation exercise", "Bedtime routine"]
    },
    stress: {
      greeting: "Stress can feel heavy, but we can break it down together. 💪",
      suggestions: ["Stress relief techniques", "Time management", "Mindfulness exercise"]
    },
    default: {
      greeting: "Hello! I'm here to support you. How are you feeling today? 💚",
      suggestions: ["I need someone to talk to", "I'm feeling overwhelmed", "Just checking in"]
    }
  };

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }

    // Load chat history from localStorage
    const savedChat = localStorage.getItem('chatHistory');
    if (savedChat) {
      try {
        const parsed = JSON.parse(savedChat);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        } else {
          initializeChat();
        }
      } catch (e) {
        initializeChat();
      }
    } else {
      initializeChat();
    }
  }, []);

  useEffect(() => {
    // Save chat history whenever messages change
    if (messages.length > 1) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  const initializeChat = () => {
    const welcomeMessage = {
      id: 'welcome',
      type: 'ai',
      content: aiPersonas.default.greeting,
      timestamp: new Date().toISOString(),
      suggestions: aiPersonas.default.suggestions,
      isWelcome: true
    };
    setMessages([welcomeMessage]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const detectTopic = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('anxious') || lower.includes('anxiety') || lower.includes('worry')) return 'anxiety';
    if (lower.includes('sleep') || lower.includes('insomnia') || lower.includes('can\'t sleep')) return 'sleep';
    if (lower.includes('stress') || lower.includes('stressed') || lower.includes('overwhelmed')) return 'stress';
    return 'default';
  };

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
    setShowTyping(true);

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setShowTyping(false);
    setIsStreaming(true);

    try {
      const response = await chatAPI.chat(userMessage.content);
      const topic = detectTopic(userMessage.content);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.data.response || "I hear you. Thank you for sharing that with me. Let's explore this together.",
        suggestions: response.data.suggestions || aiPersonas[topic]?.suggestions,
        resources: response.data.resources,
        timestamp: new Date().toISOString(),
        topic: topic
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const topic = detectTopic(userMessage.content);
      const fallbackResponses = {
        anxiety: "I understand anxiety can feel overwhelming. Would you like to try a breathing exercise together? 🌿",
        sleep: "Sleep difficulties are common. Let's talk about what might be affecting your rest. 🌙",
        stress: "Stress is a natural response, but we can find ways to manage it together. 💪",
        default: "Thank you for sharing. I'm here to listen and support you. 💚"
      };
      
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: fallbackResponses[topic] || "I'm here for you. Sometimes technical issues happen, but my support remains. 💚",
        timestamp: new Date().toISOString(),
        isFallback: true
      };
      setMessages((prev) => [...prev, errorMessage]);
      showToast('Using offline response. AI service temporarily unavailable.', 'warning');
    } finally {
      setLoading(false);
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      localStorage.removeItem('chatHistory');
      initializeChat();
      showToast('Chat history cleared', 'success');
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast('Copied to clipboard', 'success');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getTopicEmoji = (topic) => {
    const emojis = {
      anxiety: '🌿',
      sleep: '🌙',
      stress: '💪',
      default: '💚'
    };
    return emojis[topic] || emojis.default;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      
      <motion.div 
        className="max-w-5xl mx-auto px-4 pt-20 pb-8 h-screen flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Enhanced Header */}
        <motion.div 
          className="flex items-center justify-between mb-6 bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Bot className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                NeuroCare AI
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">Online</span>
              </h1>
              <p className="text-sm text-gray-400">Your mental wellness companion</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={handleClearChat}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Clear chat history"
            >
              <RefreshCw className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Messages Container */}
        <div className="flex-1 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden flex flex-col shadow-2xl">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <AnimatePresence mode="popLayout">
              {messages.map((message, idx) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] md:max-w-[75%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`flex items-start gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-br from-blue-500 to-cyan-500' 
                          : 'bg-gradient-to-br from-purple-500 to-pink-500'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`px-5 py-4 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-sm'
                            : 'bg-white/10 backdrop-blur-md border border-white/15 text-gray-100 rounded-tl-sm'
                        }`}>
                          {message.type === 'ai' ? (
                            <StreamingText text={message.content} isStreaming={isStreaming && idx === messages.length - 1} />
                          ) : (
                            message.content
                          )}
                        </div>

                        {/* Timestamp & Actions */}
                        <div className="flex items-center gap-2 mt-2 px-1">
                          <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                          {message.type === 'ai' && (
                            <div className="flex items-center gap-1">
                              <motion.button
                                onClick={() => copyToClipboard(message.content, message.id)}
                                className="p-1 text-gray-500 hover:text-white transition-colors"
                                whileHover={{ scale: 1.2 }}
                              >
                                {copiedId === message.id ? (
                                  <Check className="w-3 h-3 text-green-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </motion.button>
                              <motion.button
                                className="p-1 text-gray-500 hover:text-green-400 transition-colors"
                                whileHover={{ scale: 1.2 }}
                              >
                                <ThumbsUp className="w-3 h-3" />
                              </motion.button>
                              <motion.button
                                className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                                whileHover={{ scale: 1.2 }}
                              >
                                <ThumbsDown className="w-3 h-3" />
                              </motion.button>
                            </div>
                          )}
                        </div>

                        {/* Suggestions */}
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {message.suggestions.map((suggestion, sIdx) => (
                              <motion.button
                                key={sIdx}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-blue-400/50 rounded-full text-sm text-gray-300 hover:text-white transition-all duration-200"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: sIdx * 0.1 }}
                              >
                                {suggestion}
                              </motion.button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {showTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-start"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl rounded-tl-sm">
                    <TypingIndicator />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-6 py-4 border-t border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {quickResponses.map((response, idx) => (
                <motion.button
                  key={response.text}
                  onClick={() => handleSuggestionClick(response.text)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-blue-400/50 rounded-full text-sm text-gray-300 whitespace-nowrap transition-all duration-200 flex-shrink-0"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <span>{response.icon}</span>
                  <span>{response.text}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6 bg-gradient-to-b from-white/5 to-white/10 backdrop-blur-xl border-t border-white/10">
            <div className="flex items-end gap-4">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share how you're feeling today..."
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300 resize-none"
                  disabled={loading}
                  rows={1}
                />
              </div>
              <motion.button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className={`w-5 h-5 ${loading ? 'animate-pulse' : ''}`} />
              </motion.button>
            </div>
            
            {/* Disclaimer */}
            <p className="text-xs text-gray-500 text-center mt-3">
              🧠 AI responses are for wellness support only and not a substitute for professional medical advice.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Chat;