import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Trash2, MapPin, Phone, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FavoriteItem from '../components/FavoriteItem';
import SkeletonLoader from '../components/SkeletonLoader';
import { placesAPI } from '../services/api';
import { useToast } from '../components/ToastContext';

const Favorites = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const response = await placesAPI.getFavorites();
      setFavorites(response.data.favorites || []);
    } catch (err) {
      console.error('Failed to load favorites:', err);
      showToast('Unable to load saved places.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleRemove = async (favoriteId) => {
    try {
      await placesAPI.deleteFavorite(favoriteId);
      setFavorites((prev) => prev.filter((item) => item.id !== favoriteId));
      showToast('Saved place removed.', 'success');
    } catch (err) {
      console.error('Failed to delete favorite:', err);
      showToast('Unable to remove saved place.', 'error');
    }
  };

  const handleNavigate = (item) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lon}`;
    window.open(url, '_blank');
  };

  const handleCall = (item) => {
    if (item.phone) {
      window.location.href = `tel:${item.phone}`;
    } else {
      showToast('Phone number unavailable for this location.', 'warning');
    }
  };

  return (
    <div className="min-h-screen bg-neuro-dark pb-20 md:pb-4">
      <Navbar />
      <div className="max-w-6xl mx-auto p-4 pt-20 md:pt-4">
        <div className="glass-card p-6 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Heart className="text-neuro-accent" size={26} />
              <h1 className="text-3xl font-bold neon-text">Saved Places</h1>
            </div>
            <p className="text-gray-400">Quick access to your favorite hospitals, clinics and pharmacies.</p>
          </div>
          <span className="inline-flex items-center gap-2 bg-neuro-card border border-white/10 py-2 px-4 rounded-3xl">
            <Heart size={16} className="text-neuro-accent" />
            {favorites.length} saved
          </span>
        </div>

        {loading ? (
          <SkeletonLoader count={3} className="pt-12" />
        ) : favorites.length === 0 ? (
          <motion.div 
            className="glass-card p-16 text-center rounded-3xl border border-white/10 relative overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5">
              <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full blur-xl animate-pulse" />
              <div className="absolute bottom-10 right-10 w-16 h-16 bg-purple-500 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-pink-500 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>
            
            <div className="relative z-10">
              {/* Animated heart icon */}
              <motion.div 
                className="mx-auto mb-8 inline-flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-pink-500/20 via-purple-500/15 to-blue-500/15 shadow-[0_0_50px_rgba(99,102,241,0.2)] border border-white/10"
                animate={{ 
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    '0 0 50px rgba(99,102,241,0.2)',
                    '0 0 70px rgba(99,102,241,0.4)',
                    '0 0 50px rgba(99,102,241,0.2)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="w-20 h-20 text-pink-400 drop-shadow-lg" />
                </motion.div>
              </motion.div>
              
              <motion.h2 
                className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Your Care Journey Starts Here
              </motion.h2>
              
              <motion.p 
                className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Build your personal network of trusted healthcare providers. Save hospitals, clinics, and pharmacies for instant access during moments when you need support most.
              </motion.p>
              
              {/* Feature highlights */}
              <motion.div 
                className="grid md:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <div className="glass-card p-6 rounded-2xl border border-white/5">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <MapPin className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Quick Navigation</h3>
                  <p className="text-sm text-gray-400">Get directions instantly to your saved locations</p>
                </div>
                
                <div className="glass-card p-6 rounded-2xl border border-white/5">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <Phone className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Direct Contact</h3>
                  <p className="text-sm text-gray-400">Call your preferred providers with one tap</p>
                </div>
                
                <div className="glass-card p-6 rounded-2xl border border-white/5">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <Navigation className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Emergency Ready</h3>
                  <p className="text-sm text-gray-400">Access your care network when you need it most</p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                <motion.button 
                  className="neon-button px-12 py-5 rounded-3xl text-xl font-bold shadow-2xl hover:shadow-[0_0_50px_rgba(99,102,241,0.6)]"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/hospitals')}
                >
                  🏥 Explore Healthcare Providers
                </motion.button>
                
                <motion.p 
                  className="text-sm text-gray-500 mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  Start by browsing nearby hospitals and clinics
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <div className="grid gap-4">
        <motion.div 
          className="grid gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {favorites.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <FavoriteItem
                item={item}
                onNavigate={handleNavigate}
                onCall={handleCall}
                onRemove={handleRemove}
              />
            </motion.div>
          ))}
        </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
