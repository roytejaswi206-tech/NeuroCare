import React from 'react';
import { motion } from 'framer-motion';
import { Phone, CalendarDays, Star, Award, Clock, CheckCircle } from 'lucide-react';

const DoctorCard = ({ doctor, onCall, onBook }) => {
  const rating = doctor.rating ?? 4.8;
  const isAvailable = doctor.available !== false; // Default to available

  return (
    <motion.div
      className="glass-card p-8 rounded-3xl shadow-[0_0_30px_rgba(15,23,42,0.18)] hover:shadow-[0_0_50px_rgba(59,130,246,0.25)] transition-all duration-500 cursor-pointer group border border-white/15 hover:border-blue-400/30"
      whileHover={{ scale: 1.03, y: -8, rotateX: 2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onBook(doctor)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-6 mb-6">
        <div className="relative">
          <motion.div
            className={`w-24 h-24 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${
              isAvailable ? 'bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600' : 'bg-gradient-to-br from-slate-600 to-slate-700'
            }`}
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            {doctor.image_url ? (
              <img src={doctor.image_url} alt={doctor.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white">
                {doctor.name?.split(' ').map((n) => n[0]).join('')}
              </div>
            )}
          </motion.div>
          
          {/* Enhanced online indicator */}
          <motion.div 
            className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-white/20 shadow-lg flex items-center justify-center"
            animate={isAvailable ? { 
              backgroundColor: ['#10b981', '#34d399', '#10b981'],
              boxShadow: [
                '0 0 10px rgba(16, 185, 129, 0.5)',
                '0 0 20px rgba(16, 185, 129, 0.8)',
                '0 0 10px rgba(16, 185, 129, 0.5)'
              ]
            } : {}}
            transition={{ duration: 2, repeat: isAvailable ? Infinity : 0 }}
          >
            <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-white' : 'bg-gray-400'}`} />
          </motion.div>
          
          {isAvailable && (
            <motion.div 
              className="absolute -top-1 -left-1 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <CheckCircle className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="font-bold text-2xl truncate text-white leading-tight">{doctor.name}</h3>
            <motion.span 
              className={`text-sm font-bold uppercase px-4 py-2 rounded-2xl shadow-lg ${
                isAvailable 
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border border-gray-500/30'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              {isAvailable ? '● Online' : '○ Offline'}
            </motion.span>
          </div>
          
          <p className="text-blue-300 text-lg font-semibold mb-2">{doctor.specialization}</p>
          {doctor.qualification && <p className="text-gray-300 text-base mb-4 font-medium">{doctor.qualification}</p>}

          {/* Enhanced rating stars */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Star
                    size={18}
                    className={`transition-all duration-300 ${
                      i < Math.floor(rating) 
                        ? 'text-yellow-400 fill-current drop-shadow-lg' 
                        : i < rating 
                          ? 'text-yellow-400/70 fill-current' 
                          : 'text-slate-600'
                    }`}
                  />
                </motion.div>
              ))}
              <span className="text-white font-bold text-lg ml-2">{rating.toFixed(1)}</span>
            </div>
            
            {doctor.experience && (
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 px-3 py-1 rounded-xl border border-purple-500/20">
                <Award className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300 font-semibold">{doctor.experience} yrs</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-white/10 to-white/5 px-4 py-3 border border-white/15">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">{doctor.timing || '9AM - 9PM'}</span>
            </div>
            <div className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-4 py-3 border border-emerald-500/20">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-300 font-bold">${doctor.fees || '99'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 pt-6 border-t border-white/15">
        {doctor.phone && (
          <motion.button
            className="w-full rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 py-4 text-base text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400/60 transition-all duration-300 flex items-center justify-center gap-3 font-semibold shadow-lg hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              onCall(doctor.phone);
            }}
          >
            <Phone className="w-5 h-5" />
            📞 Call Doctor
          </motion.button>
        )}
        <motion.button
          className="w-full neon-button rounded-3xl py-4 text-white font-bold text-lg shadow-2xl hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] transition-all duration-300 flex items-center justify-center gap-3"
          whileHover={{ scale: 1.03, y: -3 }}
          whileTap={{ scale: 0.97 }}
        >
          <CalendarDays className="w-5 h-5" />
          🎯 Book Appointment
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DoctorCard;

