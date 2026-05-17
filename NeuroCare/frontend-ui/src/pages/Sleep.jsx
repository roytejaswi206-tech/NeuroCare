import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentUser } from '../utils/storage';
import { useToast } from '../components/ToastContext';
import {
  Moon, Sun, Clock, Calendar, TrendingUp, ChevronLeft, Play, Pause,
  RotateCcw, Music, BookOpen, Wind, Sparkles, Award, Info
} from 'lucide-react';

const sleepTips = [
  {
    title: 'Consistent Schedule',
    description: 'Go to bed and wake up at the same time every day, even on weekends.',
    icon: Clock
  },
  {
    title: 'Limit Screen Time',
    description: 'Avoid screens 1 hour before bed. Blue light suppresses melatonin.',
    icon: Moon
  },
  {
    title: 'Cool Environment',
    description: 'Keep your bedroom between 60-67°F (15-19°C) for optimal sleep.',
    icon: Wind
  },
  {
    title: 'Avoid Caffeine Late',
    description: 'No caffeine after 2 PM. It can stay in your system for 6-8 hours.',
    icon: Sun
  }
];

const bedtimeRoutines = [
  { time: '9:00 PM', activity: 'Stop caffeine intake', icon: '☕' },
  { time: '10:00 PM', activity: 'Light dinner, avoid heavy meals', icon: '🍽️' },
  { time: '10:30 PM', activity: 'Dim lights, reduce screen time', icon: '💡' },
  { time: '11:00 PM', activity: 'Reading or meditation', icon: '📖' },
  { time: '11:30 PM', activity: 'Lights out, sleep', icon: '😴' }
];

const sleepSounds = [
  { name: 'Rain Sounds', duration: '60 min', color: 'from-blue-400 to-blue-600' },
  { name: 'Ocean Waves', duration: '60 min', color: 'from-cyan-400 to-cyan-600' },
  { name: 'White Noise', duration: '60 min', color: 'from-gray-400 to-gray-600' },
  { name: 'Forest Ambience', duration: '60 min', color: 'from-green-400 to-green-600' },
  { name: 'Soft Piano', duration: '45 min', color: 'from-purple-400 to-purple-600' },
  { name: 'Thunderstorm', duration: '60 min', color: 'from-indigo-400 to-indigo-600' }
];

const Sleep = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [user, setUser] = useState(null);
  const [sleepLog, setSleepLog] = useState([]);
  const [bedtime, setBedtime] = useState('22:00');
  const [waketime, setWaketime] = useState('06:00');
  const [sleepQuality, setSleepQuality] = useState(3);
  const [showLogModal, setShowLogModal] = useState(false);
  const [playingSound, setPlayingSound] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login', { replace: true });
      return;
    }
    setUser(currentUser);
    loadSleepData();
  }, [navigate]);

  const loadSleepData = () => {
    const saved = JSON.parse(localStorage.getItem('sleepLog') || '[]');
    setSleepLog(saved.reverse().slice(0, 7));
  };

  const logSleep = () => {
    const entry = {
      id: Date.now(),
      bedtime,
      waketime,
      quality: sleepQuality,
      duration: calculateSleepDuration(bedtime, waketime),
      date: new Date().toISOString()
    };

    const updated = [entry, ...sleepLog];
    setSleepLog(updated);
    localStorage.setItem('sleepLog', JSON.stringify(updated.slice(0, 30)));
    setShowLogModal(false);
    showToast('Sleep logged successfully!', 'success');
  };

  const calculateSleepDuration = (bed, wake) => {
    const [bedH, bedM] = bed.split(':').map(Number);
    const [wakeH, wakeM] = wake.split(':').map(Number);

    let bedMinutes = bedH * 60 + bedM;
    let wakeMinutes = wakeH * 60 + wakeM;

    if (wakeMinutes < bedMinutes) {
      wakeMinutes += 24 * 60;
    }

    const totalMinutes = wakeMinutes - bedMinutes;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  const getAverageSleep = () => {
    if (sleepLog.length === 0) return '0h 0m';
    let totalMinutes = 0;
    sleepLog.forEach(entry => {
      const [h, m] = entry.duration.replace('h', ' ').replace('m', '').split(' ').map(Number);
      totalMinutes += (h || 0) * 60 + (m || 0);
    });
    const avg = Math.round(totalMinutes / sleepLog.length);
    return `${Math.floor(avg / 60)}h ${avg % 60}m`;
  };

  const getQualityEmoji = (quality) => {
    const emojis = ['😫', '😔', '😐', '😊', '😴'];
    return emojis[quality - 1] || '😐';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const toggleSound = (sound) => {
    if (playingSound === sound.name) {
      setPlayingSound(null);
    } else {
      setPlayingSound(sound.name);
      showToast(`Playing: ${sound.name}`, 'info');
    }
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900/30 via-purple-900/30 to-blue-900/30">
      {/* Header */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-white hover:text-white/80 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="font-semibold">Back</span>
            </button>
            <div className="flex items-center space-x-2">
              <Moon className="h-6 w-6 text-white" />
              <span className="text-xl font-bold text-white">Sleep Wellness</span>
            </div>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 text-white hover:text-white/80 transition-colors"
            >
              <Info className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <Moon className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{getAverageSleep()}</p>
                <p className="text-sm text-white/60">Avg Sleep</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{sleepLog.length}</p>
                <p className="text-sm text-white/60">Nights Tracked</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Sun className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{waketime}</p>
                <p className="text-sm text-white/60">Wake Time</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Award className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {sleepLog.length > 0 ? Math.round(sleepLog.reduce((a, b) => a + b.quality, 0) / sleepLog.length) : '-'}
                </p>
                <p className="text-sm text-white/60">Avg Quality</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Sleep Log */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Sleep History</h3>
              <button
                onClick={() => setShowLogModal(true)}
                className="px-4 py-2 bg-indigo-500 rounded-lg text-white text-sm hover:bg-indigo-600 transition-colors flex items-center space-x-2"
              >
                <span>+</span>
                <span>Log Sleep</span>
              </button>
            </div>

            {sleepLog.length === 0 ? (
              <div className="text-center py-8">
                <Moon className="h-12 w-12 text-white/30 mx-auto mb-3" />
                <p className="text-white/60">No sleep data yet</p>
                <p className="text-white/40 text-sm">Start tracking your sleep</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sleepLog.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getQualityEmoji(entry.quality)}</span>
                      <div>
                        <p className="text-white font-medium">{entry.duration}</p>
                        <p className="text-white/60 text-xs">{formatDate(entry.date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-sm">{entry.bedtime} - {entry.waketime}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Sleep Sounds */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <Music className="h-5 w-5 mr-2" />
              Sleep Sounds
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {sleepSounds.map((sound, index) => (
                <button
                  key={index}
                  onClick={() => toggleSound(sound)}
                  className={`p-4 rounded-xl transition-all ${
                    playingSound === sound.name
                      ? 'bg-white/20 ring-2 ring-white/50'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${sound.color} flex items-center justify-center mb-2`}>
                    {playingSound === sound.name ? (
                      <Pause className="h-5 w-5 text-white" />
                    ) : (
                      <Play className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <p className="text-white font-medium text-sm">{sound.name}</p>
                  <p className="text-white/60 text-xs">{sound.duration}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sleep Tips */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Sleep Hygiene Tips
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {sleepTips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl"
              >
                <div className="p-3 bg-indigo-500/20 rounded-xl">
                  <tip.icon className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">{tip.title}</h4>
                  <p className="text-white/60 text-sm">{tip.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bedtime Routine */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Recommended Bedtime Routine
          </h3>
          <div className="space-y-3">
            {bedtimeRoutines.map((routine, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg"
              >
                <span className="text-2xl">{routine.icon}</span>
                <div className="flex-1">
                  <p className="text-white font-medium">{routine.activity}</p>
                </div>
                <span className="text-indigo-400 font-semibold">{routine.time}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Info Panel */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8"
            >
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                Why Sleep Matters
              </h3>
              <div className="text-white/80 space-y-4">
                <p>
                  Quality sleep is essential for mental and physical health. During sleep, your brain processes emotions,
                  consolidates memories, and repairs your body.
                </p>
                <p>
                  <strong className="text-white">Adults need 7-9 hours</strong> of sleep per night.
                  Consistent sleep schedules improve sleep quality and overall well-being.
                </p>
                <p>
                  <strong className="text-white">Poor sleep</strong> is linked to anxiety, depression, weight gain,
                  and weakened immune function. Prioritizing sleep is one of the best things you can do for your health.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Sleep Log Modal */}
      <AnimatePresence>
        {showLogModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLogModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Log Your Sleep</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedtime</label>
                  <input
                    type="time"
                    value={bedtime}
                    onChange={(e) => setBedtime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Wake Time</label>
                  <input
                    type="time"
                    value={waketime}
                    onChange={(e) => setWaketime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sleep Quality: {getQualityEmoji(sleepQuality)}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={sleepQuality}
                    onChange={(e) => setSleepQuality(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowLogModal(false)}
                    className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={logSleep}
                    className="flex-1 py-3 bg-indigo-500 rounded-xl text-white hover:bg-indigo-600 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sleep;