import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI mental health assistant. How are you feeling today?", isBot: true }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety')) {
      return "I understand anxiety can be challenging. Try taking slow, deep breaths. Would you like to try a breathing exercise?";
    }
    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed')) {
      return "I'm sorry you're feeling this way. Remember, it's okay to have difficult days. Would you like to talk about what's on your mind?";
    }
    if (lowerMessage.includes('stress') || lowerMessage.includes('stressed')) {
      return "Stress is something many people deal with. Consider taking short breaks, practicing mindfulness, or talking to someone you trust.";
    }
    if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia')) {
      return "Good sleep hygiene is important for mental health. Try maintaining a consistent sleep schedule and avoiding screens before bed.";
    }
    if (lowerMessage.includes('thank')) {
      return "You're welcome! I'm here to support you on your mental health journey. 💚";
    }
    
    return "Thank you for sharing that with me. Remember, I'm here to support you. Would you like to explore some coping strategies or relaxation techniques?";
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      isBot: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: getBotResponse(inputValue),
        isBot: true
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex">
      <Navbar />
      
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-8 flex flex-col h-screen">
        <div className="max-w-3xl mx-auto w-full flex flex-col h-full">
          {/* Header */}
          <div className="card rounded-none border-b px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-text-main">AI Chat Assistant</h1>
              <p className="text-xs text-text-muted">Always here to listen</p>
            </div>
            <div className="ml-auto">
              <span className="badge badge-success text-xs">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} fade-in`}
              >
                <div
                  className={`max-w-[80%] sm:max-w-[70%] p-3 sm:p-4 rounded-2xl ${
                    message.isBot
                      ? 'bg-bg-card border border-border rounded-tl-md'
                      : 'bg-primary text-white rounded-tr-md'
                  }`}
                >
                  <p className={`text-sm sm:text-base ${message.isBot ? 'text-text-main' : 'text-white'}`}>
                    {message.text}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start fade-in">
                <div className="bg-bg-card border border-border p-3 rounded-2xl rounded-tl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-text-light rounded-full animate-pulse"></span>
                    <span className="w-2 h-2 bg-text-light rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-text-light rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="card rounded-none border-t p-3 sm:p-4 flex gap-2 flex-shrink-0">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 py-2 sm:py-3"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="btn-primary px-4 sm:px-6 py-2 sm:py-3 flex-shrink-0"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;