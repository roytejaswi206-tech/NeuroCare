import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  MessageCircle, 
  AlertTriangle, 
  MapPin, 
  LogOut, 
  User,
  Stethoscope,
  Calendar,
  Shield,
  Globe,
  Heart,
  Settings
} from 'lucide-react';
import { useTranslation } from '../i18n.jsx';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { language, setLanguage, t } = useTranslation();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  const isActive = (path) => location.pathname === path;
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'super_admin' || user.role === 'admin';
  
  const navItems = [
    { path: '/dashboard', icon: Home, label: t('dashboard') },
    { path: '/chat', icon: MessageCircle, label: t('chat') },
    { path: '/panic', icon: AlertTriangle, label: t('panic') },
    { path: '/hospitals', icon: MapPin, label: t('hospitals') },
    { path: '/doctors', icon: Stethoscope, label: t('doctors') },
    { path: '/favorites', icon: Heart, label: 'Favorites' },
    { path: '/appointments', icon: Calendar, label: t('myAppointments') },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];
  
  const adminItems = [
    { path: '/admin', icon: Shield, label: t('adminPanel') },
  ];

  return (
    <nav className="glass-card fixed top-0 left-0 right-0 z-50 border border-white/10 shadow-xl backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/dashboard" className="flex items-center gap-3 text-white">
          <img src="/logo.svg" alt="NeuroCare" className="w-8 h-8" />
          <div>
            <span className="text-lg font-bold">NeuroCare</span>
            <p className="text-xs text-gray-400 hidden sm:block">Premium mental health support</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-2 bg-white/5 px-3 py-2 rounded-2xl border border-white/10 shadow-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-2xl transition ${
                  isActive(item.path)
                    ? 'bg-neuro-accent/15 text-neuro-accent'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
          
          {/* Admin Link */}
          {isAdmin && adminItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-2xl transition ${
                  isActive(item.path)
                    ? 'bg-neuro-danger/15 text-neuro-danger'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="p-2 rounded-lg hover:bg-white/5 transition flex items-center gap-1"
            >
              <Globe size={18} className="text-gray-300" />
              <span className="text-xs text-gray-300 uppercase">{language}</span>
            </button>
            
            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-neuro-card border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
                <button
                  onClick={() => {
                    setLanguage('en');
                    setShowLangMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-white/5 text-sm flex items-center gap-2 ${
                    language === 'en' ? 'text-neuro-accent' : 'text-gray-300'
                  }`}
                >
                  🇺🇸 English
                </button>
                <button
                  onClick={() => {
                    setLanguage('hi');
                    setShowLangMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-white/5 text-sm flex items-center gap-2 ${
                    language === 'hi' ? 'text-neuro-accent' : 'text-gray-300'
                  }`}
                >
                  🇮🇳 हिंदी
                </button>
              </div>
            )}
          </div>
          
          {/* User Profile */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/5 border border-white/10 text-gray-200">
            <User size={16} />
            <span className="text-sm">{user.username || 'User'}</span>
          </div>
          
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-2xl bg-neuro-danger/10 text-neuro-danger hover:bg-neuro-danger/20 transition"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
