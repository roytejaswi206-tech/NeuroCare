import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageCircle, AlertTriangle, MapPin, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  const isActive = (path) => location.pathname === path;
  
  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/chat', icon: MessageCircle, label: 'Chat' },
    { path: '/panic', icon: AlertTriangle, label: 'Panic' },
    { path: '/hospitals', icon: MapPin, label: 'Hospitals' },
  ];
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <nav className="glass-card fixed top-0 left-0 right-0 z-50 border border-white/10 shadow-xl backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/dashboard" className="flex items-center gap-3 text-white">
          <span className="text-2xl font-bold neon-text">NeuroCare</span>
          <span className="hidden sm:inline text-sm text-gray-400">AI mental health companion</span>
        </Link>

        <div className="hidden md:flex items-center gap-2 bg-white/5 px-3 py-2 rounded-2xl border border-white/10 shadow-sm">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-2xl transition ${
                isActive(item.path)
                  ? 'bg-neuro-accent/15 text-neuro-accent'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} />
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/5 border border-white/10 text-gray-200">
            <User size={16} />
            <span className="text-sm">{user.username || 'User'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-2xl bg-neuro-danger/10 text-neuro-danger hover:bg-neuro-danger/20 transition"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
