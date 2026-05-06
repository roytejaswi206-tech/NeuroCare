import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, MapPin, Phone } from 'lucide-react';

const AppointmentCard = ({ appointment, onCancel }) => {
  const statusConfig = {
    approved: { icon: CheckCircle, label: 'Confirmed', badge: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25' },
    pending: { icon: AlertCircle, label: 'Pending', badge: 'bg-amber-500/15 text-amber-300 border border-amber-500/25' },
    cancelled: { icon: XCircle, label: 'Cancelled', badge: 'bg-red-500/15 text-red-300 border border-red-500/25' },
  };
  const status = statusConfig[appointment.status] || statusConfig.pending;
  const Icon = status.icon;

  const scheduled = new Date(appointment.scheduled_for);
  const timeLeft = scheduled - new Date();
  const hoursLeft = Math.max(Math.floor(timeLeft / (1000 * 60 * 60)), 0);
  const minsLeft = Math.max(Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)), 0);

  return (
    <motion.div
      className="glass-card p-8 rounded-3xl shadow-[0_0_40px_rgba(15,23,42,0.2)] hover:shadow-[0_0_60px_rgba(59,130,246,0.3)] transition-all duration-500 border border-white/15 hover:border-blue-400/30"
      whileHover={{ scale: 1.02, y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between gap-6 mb-6">
        <div className="flex items-center gap-5">
          <motion.div 
            className={`p-4 rounded-3xl shadow-lg ${status.badge}`}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Icon className="w-8 h-8" />
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold text-white leading-tight">Dr. {appointment.doctor?.name || 'Specialist'}</h3>
            <p className="text-base text-gray-300 font-medium">{appointment.doctor?.specialization || 'Mental Health Consultation'}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-3 py-1 rounded-2xl text-sm font-bold ${status.badge} shadow-sm`}>
                {status.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-gradient-to-br from-white/8 to-white/4 rounded-3xl border border-white/15">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-blue-400/30">
            <Calendar className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400 font-semibold mb-1">Appointment Date</p>
            <p className="text-lg font-bold text-white">{scheduled.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-400/30">
            <Clock className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400 font-semibold mb-1">Scheduled Time</p>
            <p className="text-lg font-bold text-white">{scheduled.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
          </div>
        </div>
      </div>

      {timeLeft > 0 && appointment.status === 'approved' && (
        <motion.div
          className="mb-8 rounded-3xl border-2 border-orange-500/30 bg-gradient-to-r from-orange-500/15 via-red-500/10 to-pink-500/15 p-6 relative overflow-hidden"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 animate-pulse" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div 
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg"
                animate={{ 
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 20px rgba(249, 115, 22, 0.4)',
                    '0 0 30px rgba(249, 115, 22, 0.8)',
                    '0 0 20px rgba(249, 115, 22, 0.4)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Clock className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-orange-300 font-bold mb-1">⏰ Time Until Appointment</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{hoursLeft}</span>
                  <span className="text-xl font-bold text-gray-300">h</span>
                  <span className="text-3xl font-black text-white">{minsLeft}</span>
                  <span className="text-xl font-bold text-gray-300">m</span>
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="flex-1 max-w-32 ml-6">
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                  initial={{ width: '100%' }}
                  animate={{ width: `${Math.max(10, (timeLeft / (24 * 60 * 60 * 1000)) * 100)}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1 text-center">Progress</p>
            </div>
          </div>
        </motion.div>
      )}

      {appointment.reason && (
        <div className="mb-8 rounded-3xl border border-white/15 bg-gradient-to-r from-white/5 to-white/3 p-6">
          <p className="text-base text-gray-200 italic font-medium leading-relaxed">"{appointment.reason}"</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {appointment.doctor?.phone && (
          <motion.button
            className="flex items-center justify-center gap-3 rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 py-4 text-base text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400/60 transition-all duration-300 font-semibold shadow-lg hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => window.location.href = `tel:${appointment.doctor.phone}`}
          >
            <Phone className="w-5 h-5" />
            📞 Call Doctor
          </motion.button>
        )}
        <motion.button
          className="flex items-center justify-center gap-3 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-600 py-4 text-base font-bold text-white shadow-2xl hover:shadow-[0_0_40px_rgba(59,102,241,0.6)] transition-all duration-300"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          <MapPin className="w-5 h-5" />
          🗺️ View Location
        </motion.button>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 text-center">
        <p className="text-sm text-gray-400">
          📅 Booked on {new Date(appointment.created_at || appointment.createdAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
      </div>
    </motion.div>
  );
};

export default AppointmentCard;

