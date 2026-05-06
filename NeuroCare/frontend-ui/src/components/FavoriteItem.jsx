import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Phone, Navigation, Trash2, Clock } from 'lucide-react';

const FavoriteItem = ({ item, onNavigate, onCall, onRemove }) => {
  return (
    <motion.div
      className="glass-card p-6 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-all duration-300 group"
      whileHover={{ scale: 1.02, y: -4 }}
    >
      <div className="flex items-start gap-4">
        {/* Icon/Type Badge */}
        <div className={`p-3 rounded-2xl shadow-lg flex-shrink-0 ${
          item.type === 'hospital' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
          item.type === 'pharmacy' ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
          'bg-gradient-to-br from-purple-500 to-pink-600'
        }`}>
          <MapPin className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-xl">{item.name}</h3>
            <motion.button
              className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-all opacity-0 group-hover:opacity-100 ml-4"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onRemove(item.id);
              }}
            >
              <Trash2 className="w-5 h-5" />
            </motion.button>
          </div>
          
          <p className="text-gray-300 text-sm mb-4">{item.address}</p>
          
          <div className="grid grid-cols-2 gap-2 text-xs mb-6">
            <div className="flex items-center gap-1 text-emerald-400">
              <Clock className="w-3 h-3" />
              <span>Saved</span>
            </div>
            {item.distance && (
              <div className="flex items-center gap-1 justify-self-end text-blue-400">
                <MapPin className="w-3 h-3" />
                <span>{item.distance}km</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col gap-2 ml-auto">
          <motion.button
            className="p-3 glass-card hover:bg-white/20 rounded-2xl border-white/20 hover:border-blue-400/50 transition-all flex items-center justify-center text-blue-400 hover:text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(item);
            }}
          >
            <Navigation className="w-5 h-5" />
          </motion.button>
          {item.phone && (
            <motion.button
              className="p-3 glass-card hover:bg-green-500/20 rounded-2xl border-white/20 hover:border-green-400/50 transition-all flex items-center justify-center text-green-400 hover:text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                onCall(item);
              }}
            >
              <Phone className="w-5 h-5" />
            </motion.button>
          )}
          <motion.button
            className="p-3 bg-gradient-to-br from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-2xl shadow-lg hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all self-start"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Heart className="w-5 h-5 fill-current" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default FavoriteItem;

