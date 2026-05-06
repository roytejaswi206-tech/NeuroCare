import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { hospitalsAPI, appointmentsAPI } from '../services/api';
import { 
  Stethoscope, 
  MapPin, 
  Clock, 
  Phone, 
  Star, 
  Calendar,
  Search,
  Filter,
  Award
} from 'lucide-react';
import Navbar from '../components/Navbar';
import DoctorCard from '../components/DoctorCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { useToast } from '../components/ToastContext';

const specializations = [
  'All',
  'Psychiatrist',
  'Psychologist',
  'Anxiety Specialist',
  'Depression Specialist',
  'Trauma Therapist',
  'Child Psychologist',
  'Sleep Specialist',
];

const Doctors = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingData, setBookingData] = useState({ date: '', time: '', notes: '' });

  useEffect(() => {
    fetchDoctors();
  }, [selectedSpecialization]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = selectedSpecialization !== 'All' 
        ? { specialization: selectedSpecialization } 
        : {};
      const response = await hospitalsAPI.getAllDoctors(params);
      setDoctors(response.data.doctors || []);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
      showToast('Failed to load doctors', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(search.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const handleBookAppointment = async () => {
    if (!bookingData.date || !bookingData.time) {
      showToast('Please select date and time', 'warning');
      return;
    }

    try {
      const scheduledFor = `${bookingData.date}T${bookingData.time}`;
      await appointmentsAPI.createAppointment({
        doctor_id: selectedDoctor.id,
        hospital_id: selectedDoctor.hospital_id || selectedDoctor.hospital?.id,
        scheduled_for: scheduledFor,
        reason: bookingData.notes || 'Mental health consultation',
      });

      showToast('Appointment booked successfully.', 'success');
      setShowBooking(false);
      setSelectedDoctor(null);
      setBookingData({ date: '', time: '', notes: '' });
    } catch (err) {
      console.error('Booking failed:', err);
      showToast('Failed to book appointment. Please try again.', 'error');
    }
  };

  const handleCall = (phone) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  return (
    <div className="min-h-screen bg-neuro-dark pb-20 md:pb-4">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-4 pt-20 md:pt-4">
        <div className="flex items-center gap-2 mb-6">
          <Stethoscope className="text-neuro-accent" size={28} />
          <h1 className="text-2xl font-bold neon-text">Find a Doctor</h1>
        </div>

        {/* Search & Filter */}
        <div className="glass-card p-4 mb-6 rounded-3xl border border-white/10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or specialization..."
                className="w-full rounded-3xl bg-white/5 border border-white/10 px-12 py-3 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition"
              />
            </div>
            <div className="flex items-center gap-3">
              <Filter size={18} className="text-gray-400" />
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="rounded-3xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none transition"
              >
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="glass-card p-4 mb-6 rounded-3xl border border-white/10 text-sm text-gray-300 flex flex-wrap gap-4 items-center justify-between">
          <span>{filteredDoctors.length} doctors available</span>
          <span>Filter: {selectedSpecialization}</span>
        </div>

        {/* Doctor Cards */}
        {loading ? (
          <SkeletonLoader count={6} />
        ) : (
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {filteredDoctors.map((doctor, idx) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <DoctorCard 
                  doctor={doctor} 
                  onCall={handleCall} 
                  onBook={(doctor) => {
                    setSelectedDoctor(doctor);
                    setShowBooking(true);
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && filteredDoctors.length === 0 && (
          <div className="glass-card p-8 text-center">
            <Stethoscope size={48} className="mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400">No doctors found</p>
            <p className="text-sm text-gray-500 mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Booking Modal */}
        {showBooking && selectedDoctor && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="glass-card p-6 max-w-md w-full animate-fade-in">
              <h2 className="text-xl font-bold mb-4">Book Appointment</h2>
              
              <div className="bg-neuro-card/50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold">{selectedDoctor.name}</h3>
                <p className="text-neuro-accent text-sm">{selectedDoctor.specialization}</p>
                {selectedDoctor.timing && (
                  <p className="text-gray-400 text-sm">{selectedDoctor.timing}</p>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Preferred Date</label>
                  <input
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                    className="w-full"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Preferred Time</label>
                  <select
                    value={bookingData.time}
                    onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                    className="w-full"
                  >
                    <option value="">Select time</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="17:00">05:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Notes (optional)</label>
                  <textarea
                    value={bookingData.notes}
                    onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                    placeholder="Describe your symptoms or concerns..."
                    className="w-full h-24"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => {
                    setShowBooking(false);
                    setSelectedDoctor(null);
                  }}
                  className="flex-1 bg-neuro-card border border-white/10 py-3 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookAppointment}
                  className="flex-1 neon-button text-white py-3 rounded-lg"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
