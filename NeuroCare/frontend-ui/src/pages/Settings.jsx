import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Phone, Moon, Sun, Shield, Save, Mail } from 'lucide-react';
import Navbar from '../components/Navbar';
import SkeletonLoader from '../components/SkeletonLoader';
import { useToast } from '../components/ToastContext';

const SettingsPage = () => {
  const { showToast } = useToast();
  const [profile, setProfile] = useState({ name: '', email: '', emergencyContact: '' });
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem('neurocare-settings') || '{}');
    if (savedProfile.name) setProfile(savedProfile);
    const savedTheme = localStorage.getItem('neurocare-theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const handleSave = () => {
    localStorage.setItem('neurocare-settings', JSON.stringify(profile));
    showToast('Profile settings saved.', 'success');
  };

  const handleThemeToggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('neurocare-theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    showToast(`Switched to ${next} theme.`, 'success');
  };

  return (
    <div className="min-h-screen bg-neuro-dark pb-20 md:pb-4">
      <Navbar />
      <div className="max-w-5xl mx-auto p-4 pt-20 md:pt-4">
        <motion.div 
          className="glass-card p-8 mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Settings className="w-20 h-20 text-blue-400 mx-auto mb-6 neon-text animate-spin-slow" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-transparent bg-clip-text text-transparent mb-4">
            Settings
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Manage your profile, emergency contacts, notification preferences, and customize your app experience.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Profile Card */}
          <motion.div 
            className="glass-card p-8 rounded-3xl border border-white/15"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Personal Profile</h2>
                <p className="text-gray-400">Update your personal information</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-200 mb-3 flex items-center gap-2 uppercase tracking-wide">
                  <User className="w-5 h-5 text-blue-400" />
                  Full Name
                </label>
                <input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full px-6 py-5 bg-gradient-to-r from-white/8 to-white/5 border border-white/20 rounded-3xl text-lg placeholder-gray-400 focus:border-blue-400 focus:shadow-[0_0_25px_rgba(59,130,246,0.3)] focus:bg-white/10 transition-all duration-300 hover:border-white/30"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-200 mb-3 flex items-center gap-2 uppercase tracking-wide">
                  <Mail className="w-5 h-5 text-purple-400" />
                  Email Address
                </label>
                <input
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="w-full px-6 py-5 bg-gradient-to-r from-white/8 to-white/5 border border-white/20 rounded-3xl text-lg placeholder-gray-400 focus:border-purple-400 focus:shadow-[0_0_25px_rgba(147,51,234,0.3)] focus:bg-white/10 transition-all duration-300 hover:border-white/30"
                />
              </div>
            </div>
          </motion.div>

          {/* Emergency Contact */}
          <motion.div
            className="glass-card p-8 rounded-3xl border border-white/15"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
              <div className="p-4 bg-gradient-to-br from-red-500 to-orange-600 rounded-3xl shadow-2xl">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Emergency Contact</h2>
                <p className="text-gray-400">Critical support information</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-200 mb-3 flex items-center gap-2 uppercase tracking-wide">
                  <Phone className="w-5 h-5 text-red-400" />
                  Emergency Phone Number
                </label>
                <input
                  value={profile.emergencyContact}
                  onChange={(e) => setProfile({ ...profile, emergencyContact: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-6 py-5 bg-gradient-to-r from-white/8 to-white/5 border border-white/20 rounded-3xl text-lg placeholder-gray-400 focus:border-red-400 focus:shadow-[0_0_25px_rgba(239,68,68,0.3)] focus:bg-white/10 transition-all duration-300 hover:border-white/30"
                />
              </div>
              
              <motion.div 
                className="p-6 bg-gradient-to-r from-red-500/15 to-orange-500/10 border border-red-500/25 rounded-3xl"
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-base text-gray-200 mb-3 flex items-center gap-3 font-semibold">
                  <Shield className="w-6 h-6 text-red-400" />
                  Safety & Privacy
                </p>
                <p className="text-sm text-gray-300 leading-relaxed">
                  This contact is stored <strong>locally only</strong> on your device and is automatically accessible during emergency situations or when using Panic Mode features.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
        <motion.div 
          className="glass-card p-8 max-w-3xl mx-auto text-center border border-white/15"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-center gap-6 mb-8">
            <motion.div 
              className={`p-5 rounded-3xl shadow-2xl transition-all duration-500 ${theme === 'dark' ? 'bg-gradient-to-br from-slate-800 to-gray-900 shadow-slate-500/30' : 'bg-gradient-to-br from-orange-400 to-yellow-500 shadow-orange-500/50'}`}
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              {theme === 'dark' ? <Moon className="w-12 h-12 text-blue-400" /> : <Sun className="w-12 h-12 text-yellow-400" />}
            </motion.div>
            <div className="text-left">
              <h3 className="text-2xl font-bold text-white mb-2">App Theme</h3>
              <p className="text-gray-400">Customize your visual experience</p>
            </div>
          </div>
          
          <p className="text-gray-300 mb-8 max-w-lg mx-auto leading-relaxed">
            Choose between Dark mode for eye comfort during late-night sessions or Light mode for a brighter, more energetic feel.
          </p>

          {/* Enhanced Toggle Switch */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <span className={`text-lg font-semibold transition-colors duration-300 ${theme === 'dark' ? 'text-blue-400' : 'text-gray-400'}`}>
              🌙 Dark
            </span>
            
            <motion.div 
              className="relative w-20 h-12 bg-gradient-to-r from-white/10 to-white/5 border-2 border-white/20 rounded-full cursor-pointer overflow-hidden"
              onClick={handleThemeToggle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className={`absolute top-1 w-8 h-8 rounded-full shadow-lg transition-all duration-300 ${theme === 'dark' ? 'left-1 bg-gradient-to-br from-slate-700 to-gray-800' : 'left-11 bg-gradient-to-br from-orange-400 to-yellow-500'}`}
                layout
              >
                <div className={`w-full h-full rounded-full flex items-center justify-center ${theme === 'dark' ? 'text-blue-400' : 'text-yellow-600'}`}>
                  {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </div>
              </motion.div>
              
              {/* Animated background glow */}
              <motion.div 
                className={`absolute inset-0 rounded-full transition-all duration-300 ${theme === 'dark' ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20' : 'bg-gradient-to-r from-orange-500/20 to-yellow-500/20'}`}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            
            <span className={`text-lg font-semibold transition-colors duration-300 ${theme === 'light' ? 'text-yellow-400' : 'text-gray-400'}`}>
              ☀️ Light
            </span>
          </div>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-sm text-gray-400 mb-4">
              Current theme: <span className="font-semibold text-white">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </p>
            <motion.button
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-white/10 to-white/5 border border-white/20 text-gray-300 hover:border-white/40 hover:bg-white/15 transition-all duration-300 text-sm font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleThemeToggle}
            >
              🔄 Quick Toggle
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Save Button */}
        <motion.div 
          className="text-center pt-12 pb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            className="group relative neon-button text-white px-16 py-6 rounded-3xl text-xl font-bold shadow-2xl overflow-hidden"
            onClick={handleSave}
            whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(99,102,241,0.7)' }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Save className="w-7 h-7" />
              </motion.div>
              💾 Save All Changes
            </div>
          </motion.button>
          
          <motion.p 
            className="text-sm text-gray-400 mt-4 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Your settings are saved locally on your device for privacy and security
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
