import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { hospitalsAPI, placesAPI } from '../services/api';
import {
  Brain, Sun, CloudLightning, MessageCircle, AlertTriangle, MapPin, Stethoscope, Moon, HeartPulse, Zap,
  User, Award, Clock, Phone, CalendarDays, Shield, Landmark, Pill, Waves, TestTube
} from 'lucide-react';
import Navbar from '../components/Navbar';
import QuickActionCard from '../components/QuickActionCard';
import HealthChart from '../components/HealthChart';
import AIBanner from '../components/AIBanner';
import { useToast } from '../components/ToastContext';

const moodEmojis = [
  { id: 'calm', emoji: '😌', label: 'Calm' },
  { id: 'stressed', emoji: '😣', label: 'Stressed' },
  { id: 'panic', emoji: '😰', label: 'Panic' }
];

const services = [
  { icon: Brain, title: 'Therapy', subtitle: 'Professional support', path: '/doctors' },
  { icon: Pill, title: 'Medication', subtitle: 'Prescriptions', path: '/settings' },
  { icon: Waves, title: 'Meditation', subtitle: 'Guided sessions', path: '/chat' },
  { icon: AlertTriangle, title: 'Emergency', subtitle: '24/7 crisis help', path: '/panic' },
  { icon: TestTube, title: 'Health Tests', subtitle: 'Lab bookings', path: '/hospitals' }
];

const recommendations = [
  { title: 'Talk to Dr. Maya Patel', subtitle: 'Psychiatrist • 4.9⭐', image: '👩‍⚕️' },
  { title: 'Breathing Exercise', subtitle: '2 min • Reduces anxiety 40%', image: '🧘' },
  { title: 'Apollo Hospital (2.3km)', subtitle: '24hr Emergency • Psychiatry', image: '🏥' }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [user, setUser] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  const [savedHospitals, setSavedHospitals] = useState(0);
  const [panicAlerts, setPanicAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    loadData();
  }, []);

  const loadData = async () => {
    const history = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    setMoodHistory(history);
    
    const alerts = JSON.parse(localStorage.getItem('panicAlerts') || '[]');
    setPanicAlerts(alerts.slice(-3).reverse());
    
    try {
      const response = await placesAPI.getSaved();
      setSavedHospitals(response.data.favorites?.length || 0);
    } catch (err) {
      setSavedHospitals(0);
    }
  };

  const logMood = () => {
    if (!selectedMood) {
      showToast('Please select your mood', 'warning');
      return;
    }
    
    // Adapt existing logic (preserve)
    const entry = {
      id: Date.now(),
      state: selectedMood.id,
      created_at: new Date().toISOString(),
    };
    
    const updated = [entry, ...moodHistory].slice(0, 30);
    setMoodHistory(updated);
    localStorage.setItem('moodHistory', JSON.stringify(updated));
    setSelectedMood(null);
    showToast('Mood logged! Great job tracking your wellness.', 'success');
  };

  const triggerPanic = async () => {
    setLoading(true);
    try {
      if (!navigator.geolocation) {
        showToast('Geolocation not supported', 'error');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const payload = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            location_description: 'Dashboard emergency trigger',
            severity: 'critical',
          };
          await hospitalsAPI.createPanicAlert(payload);
          
          const alerts = JSON.parse(localStorage.getItem('panicAlerts') || '[]');
          localStorage.setItem('panicAlerts', JSON.stringify([payload, ...alerts].slice(0, 10)));
          
          showToast('🚨 Help is on the way! Redirecting...', 'success');
          navigate('/panic');
        },
        () => navigate('/hospitals')
      );
    } catch (error) {
      showToast('Unable to send alert', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-black overflow-x-hidden">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-24 space-y-8">
        
        {/* SECTION 1: GREETING + MOOD */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 md:p-12 text-center"
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            Hi {user?.username || 'Tejaswi'} 👋
          </motion.h1>
          <p className="text-xl text-gray-300 mb-8">How are you feeling today?</p>
          
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <AnimatePresence>
              {moodEmojis.map((mood) => (
                <motion.button
                  key={mood.id}
                  className={`glass-card p-8 rounded-3xl text-3xl transition-all duration-300 group hover:scale-110 ${
                    selectedMood?.id === mood.id 
                      ? 'ring-4 ring-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.5)] bg-blue-500/20' 
                      : 'hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]'
                  }`}
                  onClick={() => setSelectedMood(mood)}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="mb-2 text-5xl">{mood.emoji}</div>
                  <div className="text-lg font-bold text-white">{mood.label}</div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
          
          <motion.button
            className="neon-button mt-8 px-12 py-6 text-lg font-bold rounded-3xl mx-auto block"
            onClick={logMood}
            disabled={!selectedMood}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Log My Mood
          </motion.button>
        </motion.section>

        {/* SECTION 2: QUICK ACTIONS */}
        <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickActionCard icon={MessageCircle} title="🧠 Chat Therapy" path="/chat" color="from-blue-500 to-indigo-600" />
            <QuickActionCard icon={AlertTriangle} title="🚑 Panic Help" path="/panic" color="from-red-500 to-orange-500" />
            <QuickActionCard icon={Landmark} title="🏥 Find Hospital" path="/hospitals" color="from-emerald-500 to-teal-600" />
            <QuickActionCard icon={Stethoscope} title="👨‍⚕️ Book Doctor" path="/doctors" color="from-purple-500 to-pink-600" />
          </div>
        </motion.section>

        {/* SECTION 3: AI BANNER */}
        <AIBanner />

        {/* SECTION 4: HEALTH VISUALS */}
        <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid md:grid-cols-3 gap-6">
          <HealthChart type="mood" data={moodHistory.map(h => ({ name: new Date(h.created_at).toLocaleDateString().slice(-2), value: Math.random() * 4 + 1 }))} />
          <HealthChart type="sleep" data={moodHistory} />
          <HealthChart type="stress" />
        </motion.section>

        {/* SECTION 5: SERVICES GRID */}
        <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            Our Services
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {services.map(({ icon: Icon, title, subtitle, path }, idx) => (
              <motion.div
                key={title}
                className="glass-card p-6 text-center hover:bg-white/20 transition-all duration-300 cursor-pointer"
                whileHover={{ y: -8, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + idx * 0.1 }}
                onClick={() => window.location.href = path}
              >
                <Icon className="w-12 h-12 mx-auto mb-4 text-blue-400 drop-shadow-lg" />
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-gray-400 text-sm">{subtitle}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* SECTION 6: RECOMMENDATIONS */}
        <motion.section 
          className="glass-card p-8 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            Recommended For You
          </h2>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {recommendations.map((rec, idx) => (
              <motion.div
                key={rec.title}
                className="glass-card p-6 min-w-[280px] flex-shrink-0 snap-center hover:scale-105 transition-all duration-300"
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + idx * 0.1 }}
              >
                <div className="text-5xl mb-4">{rec.image}</div>
                <h3 className="font-bold text-xl mb-2">{rec.title}</h3>
                <p className="text-gray-400 mb-4">{rec.subtitle}</p>
                <button className="w-full neon-button py-3 rounded-xl font-semibold">
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Emergency Button (Preserve panic logic) */}
        <motion.div 
          className="fixed bottom-8 right-8 z-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.button
            className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl hover:shadow-[0_0_50px_rgba(239,68,68,0.6)] hover:scale-110 transition-all duration-300 panic-button"
            onClick={triggerPanic}
            disabled={loading}
            whileTap={{ scale: 0.95 }}
          >
            🚨
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

