import React, { useState, useRef, useEffect } from 'react';
import { chatAPI } from '../services/api';
import { Send, MessageCircle, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { useToast } from '../components/ToastContext';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      type: 'ai',
      content: "Hello! I'm here to support you. How are you feeling today? You can talk about anything that's on your mind.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
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
  
  return (
    <div className="min-h-screen bg-neuro-dark pb-20 md:pb-4">
      <Navbar />
      
      <div className="max-w-4xl mx-auto p-4 pt-20 md:pt-4 h-[calc(100vh-80px)] flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="text-neuro-accent" size={24} />
          <h1 className="text-2xl font-bold neon-text">AI Chat</h1>
        </div>
        
        <div className="glass-card flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`chat-bubble ${
                    message.type === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'
                  }`}
                >
                  {message.type === 'ai' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={14} className="text-neuro-accent" />
                      <span className="text-xs text-neuro-accent">NeuroCare</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-xs text-gray-400 mb-2">Suggestions:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.slice(0, 3).map((suggestion, index) => (
                          <span
                            key={index}
                            className="text-xs bg-white/10 px-2 py-1 rounded"
                          >
                            {suggestion}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {message.resources && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-xs text-gray-400 mb-2">Crisis Resources:</p>
                      <div className="space-y-1">
                        {message.resources.helpline && (
                          <p className="text-sm text-neuro-danger">
                            📞 {message.resources.helpline}
                          </p>
                        )}
                        {message.resources.crisis_text && (
                          <p className="text-sm text-neuro-warning">
                            💬 {message.resources.crisis_text}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="chat-bubble chat-bubble-ai">
                  <div className="flex items-center gap-2">
                    <Loader size="small" text="Typing..." />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Quick Responses */}
          <div className="border-t border-white/10 p-3">
            <div className="flex flex-wrap gap-2 mb-3">
              {quickResponses.map((response) => (
                <button
                  key={response}
                  onClick={() => {
                    setInput(response);
                  }}
                  className="text-xs bg-neuro-card border border-white/10 px-3 py-1 rounded-full hover:border-neuro-accent transition-colors"
                >
                  {response}
                </button>
              ))}
            </div>
            
            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="neon-button text-white px-4"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
