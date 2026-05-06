import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import AppointmentCard from '../components/AppointmentCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { useToast } from '../components/ToastContext';
import { appointmentsAPI } from '../services/api';

const Appointments = () => {
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await appointmentsAPI.getAppointments();
      const fetched = response.data.appointments || response.data;
      setAppointments(fetched.sort((a, b) => new Date(b.scheduled_for) - new Date(a.scheduled_for)));
    } catch (err) {
      console.error('Unable to load appointments:', err);
      showToast('Unable to load appointments.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      await appointmentsAPI.updateAppointment(appointmentId, { status: 'cancelled' });
      setAppointments((prev) => prev.map((item) => item.id === appointmentId ? { ...item, status: 'cancelled' } : item));
      showToast('Appointment cancelled.', 'success');
    } catch (err) {
      console.error('Unable to cancel appointment:', err);
      showToast('Unable to cancel appointment.', 'error');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={18} className="text-neuro-success" />;
      case 'cancelled':
        return <XCircle size={18} className="text-neuro-danger" />;
      default:
        return <AlertCircle size={18} className="text-neuro-warning" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-neuro-success/20 text-neuro-success';
      case 'cancelled':
        return 'bg-neuro-danger/20 text-neuro-danger';
      default:
        return 'bg-neuro-warning/20 text-neuro-warning';
    }
  };

  return (
    <div className="min-h-screen bg-neuro-dark pb-20 md:pb-4">
      <Navbar />
      
      <div className="max-w-4xl mx-auto p-4 pt-20 md:pt-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="text-neuro-accent" size={28} />
            <div>
              <h1 className="text-2xl font-bold neon-text">My Appointments</h1>
              <p className="text-sm text-gray-400">Track upcoming visits and get quick access to your care details.</p>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300">
            {appointments.length} scheduled
          </div>
        </div>

        {loading ? (
          <SkeletonLoader count={3} />
        ) : appointments.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Calendar size={48} className="mx-auto mb-4 text-gray-500" />
            <p className="text-xl font-semibold mb-2">No Appointments</p>
            <p className="text-gray-400 mb-4">
              You haven't booked any appointments yet.
            </p>
            <a
              href="/doctors"
              className="inline-block neon-button text-white px-6 py-3 rounded-lg"
            >
              Find a Doctor
            </a>
          </div>
        ) : (
          <div className="space-y-4">
        <motion.div
          className="space-y-6"
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {appointments.map((appointment, idx) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <AppointmentCard 
                appointment={appointment}
                onCancel={handleCancel}
              />
            </motion.div>
          ))}
        </motion.div>
          </div>
        )}

        {/* Info Section */}
        <div className="glass-card p-6 mt-6">
          <h2 className="font-semibold mb-3">Appointment Policy</h2>
          <ul className="text-sm text-gray-400 space-y-2">
            <li>• Please arrive 15 minutes before your scheduled time</li>
            <li>• Bring your ID and any relevant medical records</li>
            <li>• Cancellation is free up to 24 hours before appointment</li>
            <li>• For emergencies, please call 988 or visit nearest hospital</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
