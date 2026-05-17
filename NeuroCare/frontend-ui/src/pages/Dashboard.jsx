import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../utils/storage';
import {
  Brain, Sun, CloudLightning, MessageCircle, AlertTriangle, MapPin, Stethoscope, Moon, HeartPulse, Zap,
  User, Award, Clock, Phone, CalendarDays, Shield, Landmark, Pill, Waves, TestTube, LogOut, Bell, Search,
  ChevronRight, TrendingUp, Activity
} from 'lucide-react';
import { useToast } from '../components/ToastContext';

const moodEmojis = [
  { id: 'happy', emoji: '😊', label: 'Happy', color: 'bg-green-100' },
  { id: 'calm', emoji: '😌', label: 'Calm', color: 'bg-blue-100' },
  { id: 'neutral', emoji: '😐', label: 'Neutral', color: 'bg-gray-100' },
  { id: 'stressed', emoji: '😣', label: 'Stressed', color: 'bg-orange-100' },
  { id: 'sad', emoji: '😢', label: 'Sad', color: 'bg-purple-100' },
  { id: 'anxious', emoji: '😰', label: 'Anxious', color: 'bg-red-100' }
];

const quickActions = [
  { icon: MessageCircle, title: 'AI Chat', subtitle: 'Talk to our AI therapist', path: '/chat', color: 'bg-blue-500' },
  { icon: AlertTriangle, title: 'Panic Help', subtitle: 'Emergency support', path: '/panic', color: 'bg-red-500' },
  { icon: Landmark, title: 'Hospitals', subtitle: 'Find nearby care', path: '/hospitals', color: 'bg-green-500' },
  { icon: Stethoscope, title: 'Doctors', subtitle: 'Book appointments', path: '/doctors', color: 'bg-purple-500' }
];

const services = [
  { icon: Brain, title: 'Therapy', subtitle: 'Professional support', path: '/doctors' },
  { icon: Pill, title: 'Medication', subtitle: 'Prescriptions', path: '/settings' },
  { icon: Waves, title: 'Meditation', subtitle: 'Guided sessions', path: '/chat' },
  { icon: HeartPulse, title: 'Health Tracking', subtitle: 'Monitor your progress', path: '/dashboard' },
  { icon: TestTube, title: 'Assessments', subtitle: 'Self-evaluation tests', path: '/dashboard' }
];

const aiSuggestions = [
  { title: 'Daily Breathing', desc: '5 min exercise to reduce stress', icon: '🧘', path: '/breathing' },
  { title: 'Mood Journal', desc: 'Track your emotions daily', icon: '📝', path: '/journal' },
  { title: 'Sleep Hygiene', desc: 'Tips for better rest', icon: '😴', path: '/sleep' }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [user, setUser] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login', { replace: true });
      return;
    }
    setUser(currentUser);
    
    // Set current date
    const now = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    setCurrentDate(now.toLocaleDateString('en-US', options));

    // Load mood history
    const history = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    setMoodHistory(history);
  }, [navigate]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getMotivationalMessage = () => {
    const messages = [
      "Every step forward is a victory. 🌟",
      "Your mental health matters. 💚",
      "Today is a new beginning. ✨",
      "You're doing great! Keep going. 💪",
      "Take a deep breath and smile. 😊"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const logMood = () => {
    if (!selectedMood) {
      showToast('Please select your mood first', 'warning');
      return;
    }

    const entry = {
      id: Date.now(),
      mood: selectedMood.id,
      label: selectedMood.label,
      timestamp: new Date().toISOString()
    };

    const updated = [entry, ...moodHistory].slice(0, 30);
    setMoodHistory(updated);
    localStorage.setItem('moodHistory', JSON.stringify(updated));
    setSelectedMood(null);
    showToast(`Mood logged: ${selectedMood.label}. Great job tracking!`, 'success');
  };

  const handleLogout = () => {
    logoutUser();
    showToast('Logged out successfully', 'success');
    navigate('/login', { replace: true });
  };

  const handleQuickAction = (path) => {
    navigate(path);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7FB]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00BFA6] mx-auto mb-4"></div>
          <p className="text-[#64748B]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🧠</span>
              <span className="text-xl font-bold text-[#1E293B]">NeuroCare</span>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#94A3B8]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search doctors, hospitals, services..."
                  className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-full focus:ring-2 focus:ring-[#00BFA6] focus:border-transparent outline-none text-[#1E293B] placeholder-[#94A3B8]"
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-[#64748B] hover:text-[#1E293B] transition-colors">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#F1F5F9] transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00BFA6] to-[#6C63FF] flex items-center justify-center text-white font-semibold">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-[#1E293B]">{user.fullName || user.username}</p>
                    <p className="text-xs text-[#64748B] capitalize">{user.role}</p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#E2E8F0] py-2 z-50">
                    <div className="px-4 py-2 border-b border-[#E2E8F0]">
                      <p className="text-sm font-semibold text-[#1E293B]">{user.fullName || user.username}</p>
                      <p className="text-xs text-[#64748B]">{user.email}</p>
                    </div>
                    <button
                      onClick={() => { navigate('/settings'); setShowUserMenu(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-[#1E293B] hover:bg-[#F1F5F9] flex items-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={() => { navigate('/appointments'); setShowUserMenu(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-[#1E293B] hover:bg-[#F1F5F9] flex items-center space-x-2"
                    >
                      <CalendarDays className="h-4 w-4" />
                      <span>Appointments</span>
                    </button>
                    <button
                      onClick={() => { navigate('/favorites'); setShowUserMenu(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-[#1E293B] hover:bg-[#F1F5F9] flex items-center space-x-2"
                    >
                      <HeartPulse className="h-4 w-4" />
                      <span>Favorites</span>
                    </button>
                    <hr className="my-2 border-[#E2E8F0]" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <section className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[#64748B] text-sm mb-1">{currentDate}</p>
                <h1 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-2">
                  {getGreeting()}, {user.fullName?.split(' ')[0] || user.username} 👋
                </h1>
                <p className="text-[#64748B]">{getMotivationalMessage()}</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <div className="bg-[#00BFA6]/10 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-[#00BFA6]">{moodHistory.length}</p>
                  <p className="text-sm text-[#64748B]">Moods Tracked</p>
                </div>
                <div className="bg-[#6C63FF]/10 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-[#6C63FF]">7</p>
                  <p className="text-sm text-[#64748B]">Day Streak</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mood Tracking Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-[#1E293B] mb-4">How are you feeling today?</h2>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {moodEmojis.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood)}
                  className={`p-4 rounded-xl transition-all duration-200 ${
                    selectedMood?.id === mood.id
                      ? `${mood.color} ring-2 ring-[#00BFA6] scale-105`
                      : 'bg-[#F1F5F9] hover:bg-[#E2E8F0]'
                  }`}
                >
                  <div className="text-3xl mb-2">{mood.emoji}</div>
                  <p className="text-sm font-medium text-[#1E293B]">{mood.label}</p>
                </button>
              ))}
            </div>
            <button
              onClick={logMood}
              disabled={!selectedMood}
              className={`mt-6 w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                selectedMood
                  ? 'bg-[#00BFA6] text-white hover:bg-[#00A891]'
                  : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
              }`}
            >
              Log My Mood
            </button>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-[#1E293B] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.path)}
                className="bg-white rounded-2xl shadow-sm p-6 text-left hover:shadow-md transition-all duration-200 group"
              >
                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-4`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-[#1E293B] mb-1">{action.title}</h3>
                <p className="text-sm text-[#64748B]">{action.subtitle}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Services Grid */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-[#1E293B] mb-4">Our Services</h2>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {services.map((service, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(service.path)}
                  className="p-4 rounded-xl border border-[#E2E8F0] hover:border-[#00BFA6] hover:bg-[#00BFA6]/5 transition-all duration-200 text-center"
                >
                  <service.icon className="h-8 w-8 text-[#00BFA6] mx-auto mb-3" />
                  <h3 className="font-semibold text-[#1E293B] text-sm">{service.title}</h3>
                  <p className="text-xs text-[#64748B] mt-1">{service.subtitle}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom Grid: Mood History + AI Suggestions */}
        <section className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Mood History Chart */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#1E293B]">Mood History</h2>
              <TrendingUp className="h-5 w-5 text-[#64748B]" />
            </div>
            {moodHistory.length > 0 ? (
              <div className="space-y-3">
                {moodHistory.slice(0, 5).map((entry, index) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-[#F1F5F9] rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">
                        {moodEmojis.find(m => m.id === entry.mood)?.emoji || '😐'}
                      </span>
                      <div>
                        <p className="font-medium text-[#1E293B]">{entry.label}</p>
                        <p className="text-xs text-[#64748B]">
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {index === 0 && <span className="text-xs bg-[#00BFA6]/20 text-[#00BFA6] px-2 py-1 rounded-full">Latest</span>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-[#64748B]">No mood entries yet. Start tracking!</p>
              </div>
            )}
          </div>

          {/* AI Suggestions */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#1E293B]">AI Suggestions</h2>
              <Brain className="h-5 w-5 text-[#64748B]" />
            </div>
            <div className="space-y-4">
              {aiSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => navigate(suggestion.path)}
                  className="w-full flex items-start space-x-4 p-4 bg-[#F1F5F9] rounded-xl hover:bg-[#E2E8F0] transition-all duration-200 text-left group"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform">{suggestion.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1E293B]">{suggestion.title}</h3>
                    <p className="text-sm text-[#64748B]">{suggestion.desc}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-[#94A3B8] group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Emergency Panic Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => navigate('/panic')}
            className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-lg flex items-center justify-center text-white text-2xl hover:shadow-xl hover:scale-110 transition-all duration-300"
            title="Emergency Panic Button"
          >
            🚨
          </button>
        </div>
      </main>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;