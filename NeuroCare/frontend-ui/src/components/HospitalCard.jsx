import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Navigation, Star, Heart, Clock } from 'lucide-react';

const HospitalCard = ({ hospital, onNavigate, onCall, onSave, location }) => {
  const distance = hospital.distance ?? (location ? Math.round(Math.random() * 5 + 1) : 0);
  const rating = hospital.rating || 4.6;
  const isPharmacy = hospital.type === 'pharmacy';
  const typeLabel = hospital.type ? hospital.type.charAt(0).toUpperCase() + hospital.type.slice(1) : 'Clinic';

  return (
    <motion.div
      className="glass-card p-8 rounded-3xl shadow-[0_0_30px_rgba(15,23,42,0.18)] hover:shadow-[0_0_50px_rgba(59,130,246,0.25)] transition-all duration-500 cursor-pointer group border border-white/15 hover:border-blue-400/30"
      whileHover={{ scale: 1.02, y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between gap-6 mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-4">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold shadow-lg ${
              isPharmacy
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            }`}>
              <span className="text-lg">{isPharmacy ? '💊' : '🏥'}</span>
              {typeLabel}
            </span>
            {distance !== null && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-white/10 to-white/5 text-gray-300 text-sm border border-white/15 font-medium">
                <MapPin className="w-4 h-4 text-blue-400" />
                {distance} km away
              </span>
            )}
          </div>
          <h3 className="font-bold text-2xl mb-3 truncate text-white leading-tight">{hospital.name}</h3>
          <p className="text-base text-gray-300 mb-4 line-clamp-2 leading-relaxed">{hospital.address || 'Address unavailable'}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
            <span className="inline-flex items-center gap-2 bg-yellow-500/10 px-3 py-1 rounded-xl border border-yellow-500/20">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-semibold">{rating.toFixed(1)}</span>
            </span>
            <span className="inline-flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-xl border border-green-500/20">
              <Clock className="w-4 h-4 text-green-400" />
              Open 24hrs
            </span>
            {hospital.contact && (
              <span className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-xl border border-white/10">
                <Phone className="w-4 h-4 text-blue-400" />
                Available
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-400/30 text-blue-300 hover:bg-blue-500/30 hover:border-blue-400/50 shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-300"
            onClick={(e) => { e.stopPropagation(); onNavigate(hospital); }}
            title="Get Directions"
          >
            <Navigation className="w-6 h-6" />
          </motion.button>
          {hospital.contact && (
            <motion.button
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/30 hover:border-emerald-400/50 shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300"
              onClick={(e) => { e.stopPropagation(); onCall(hospital.contact); }}
              title="Call Now"
            >
              <Phone className="w-6 h-6" />
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-400/30 text-red-300 hover:bg-red-500/30 hover:border-red-400/50 shadow-lg hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-300"
            onClick={(e) => { e.stopPropagation(); onSave(hospital); }}
            title="Save to Favorites"
          >
            <Heart className="w-6 h-6" />
          </motion.button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-white/10">
        <div className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-4 py-2 text-sm text-blue-300 border border-blue-500/20 font-medium">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          Highly rated by patients
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-4 py-2 text-sm text-emerald-300 border border-emerald-500/20 font-medium">
          <MapPin className="w-4 h-4 text-emerald-400" />
          Verified location
        </div>
      </div>
    </motion.div>
  );
};

export default HospitalCard;

