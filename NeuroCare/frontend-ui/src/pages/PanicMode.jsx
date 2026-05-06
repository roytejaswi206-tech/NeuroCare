import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Phone, MapPin, Wind, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { useToast } from '../components/ToastContext';
import { hospitalsAPI } from '../services/api';

const PanicMode = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const [breathePhase, setBreathePhase] = useState('inhale');
  const [count, setCount] = useState(4);
  const [location, setLocation] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [sendingAlert, setSendingAlert] = useState(false);

  const steps = [
    {
      title: 'You Are Safe',
      content: "Take a moment to remind yourself: You are safe right now. This feeling will pass.",
      icon: CheckCircle,
    },
    {
      title: 'Breathing Exercise',
      content: 'Follow the circle: breathe in for 4 sec, hold for 4 sec, breathe out for 4 sec.',
      icon: Wind,
    },
    {
      title: 'Grounding',
      content: 'Name 5 things you see, 4 things you can touch, and 3 things you hear.',
      icon: CheckCircle,
    },
    {
      title: 'You Are Strong',
      content: 'Remember: panic attacks are not dangerous. They pass. You are stronger than you think.',
      icon: CheckCircle,
    },
  ];

  useEffect(() => {
    if (step === 1) {
      const interval = setInterval(() => {
        setCount((prev) => {
          if (prev === 1) {
            setBreathePhase((phase) => {
              if (phase === 'inhale') return 'hold';
              if (phase === 'hold') return 'exhale';
              return 'inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step]);

  useEffect(() => {
    if (!location && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          setLocation({ lat: 40.7128, lng: -74.0060 });
        }
      );
    }
  }, [location]);

  useEffect(() => {
    if (step > 0 && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => Math.max(prev - 1, 0));
      }, 60000);
      return () => clearTimeout(timer);
    }
  }, [step, countdown]);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      setCount(4);
      setBreathePhase('inhale');
      showToast('Moving to the next calming step.', 'info');
    }
  };

  const handleStartPanic = async () => {
    setSendingAlert(true);
    if (!navigator.geolocation) {
      showToast('Geolocation not supported.', 'error');
      setSendingAlert(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const payload = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            location_description: 'User triggered panic mode',
            severity: 'critical',
            notes: 'Emergency support requested from Panic Mode',
          };
          await hospitalsAPI.createPanicAlert(payload);
          setCountdown(5);
          setStep(1);
          showToast('Emergency alert sent. Ambulance is on its way.', 'success');
        } catch (error) {
          console.error(error);
          showToast('Unable to send emergency alert.', 'error');
        } finally {
          setSendingAlert(false);
        }
      },
      () => {
        showToast('Location permission denied. Unable to send alert.', 'error');
        setSendingAlert(false);
      }
    );
  };

  const handleEmergencyCall = () => {
    showToast('Connecting you to emergency support.', 'success');
    window.location.href = 'tel:988';
  };

  const handleFindHospital = () => {
    showToast('Opening nearby hospitals for support.', 'success');
    navigate('/hospitals');
  };

  const StepIcon = steps[step]?.icon || CheckCircle;
  const statusText = countdown > 0 ? `${countdown} min` : 'Arriving now';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900/20 via-gray-900 to-black pb-20 md:pb-4 relative overflow-hidden">
      {/* Background pulsing effect */}
      <div className="absolute inset-0 bg-red-500/5 animate-pulse" style={{ animationDuration: '3s' }} />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />
      
      <Navbar />

      <div className="max-w-2xl mx-auto p-4 pt-20 md:pt-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 mb-6"
        >
          <motion.div 
            className="w-12 h-12 rounded-3xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-2xl"
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(239, 68, 68, 0.4)',
                '0 0 40px rgba(239, 68, 68, 0.8)',
                '0 0 20px rgba(239, 68, 68, 0.4)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <AlertTriangle className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold text-white">Panic Mode</h1>
            <p className="text-gray-400">Activate urgent support and guided calm steps instantly.</p>
          </div>
        </motion.div>

        {step === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 rounded-3xl shadow-[0_0_50px_rgba(248,113,113,0.25)] border border-red-500/20"
          >
            <motion.div 
              className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 via-orange-500 to-pink-500 flex items-center justify-center shadow-2xl"
              animate={{ 
                scale: [1, 1.1, 1],
                boxShadow: [
                  '0 0 30px rgba(239, 68, 68, 0.6)',
                  '0 0 60px rgba(239, 68, 68, 1)',
                  '0 0 30px rgba(239, 68, 68, 0.6)'
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <AlertTriangle size={50} className="text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-3">I Need Help Now</h2>
            <p className="text-gray-400 mb-6">You're not alone. Let's send an alert and start a grounding routine to help you feel more centered.</p>

            <motion.button
              onClick={handleStartPanic}
              disabled={sendingAlert}
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-8 rounded-3xl text-lg font-bold mb-4 shadow-lg hover:shadow-[0_0_50px_rgba(248,113,113,0.6)] transition-all disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              animate={sendingAlert ? {} : { 
                boxShadow: [
                  '0 0 20px rgba(239, 68, 68, 0.4)',
                  '0 0 40px rgba(239, 68, 68, 0.8)',
                  '0 0 20px rgba(239, 68, 68, 0.4)'
                ]
              }}
              transition={sendingAlert ? {} : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {sendingAlert ? 'Sending emergency alert...' : '🚨 Send Alert & Start Support'}
            </motion.button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <motion.button
                onClick={handleEmergencyCall}
                className="flex items-center justify-center gap-2 rounded-3xl border border-red-500/30 bg-white/5 py-3 text-red-300 hover:bg-red-500/10 transition-all hover:border-red-400/50"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone size={18} />
                Call 988
              </motion.button>
              <motion.button
                onClick={handleFindHospital}
                className="flex items-center justify-center gap-2 rounded-3xl border border-blue-500/30 bg-white/5 py-3 text-blue-300 hover:bg-blue-500/10 transition-all hover:border-blue-400/50"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <MapPin size={18} />
                Find Hospital
              </motion.button>
            </div>
          </motion.div>
        )}

        {step > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 rounded-3xl shadow-[0_0_50px_rgba(59,130,246,0.2)] border border-blue-500/20"
          >
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center gap-3">
                <motion.span 
                  className="inline-flex items-center justify-center w-12 h-12 rounded-3xl bg-blue-500/15 text-blue-300 shadow-md"
                  whileHover={{ scale: 1.1 }}
                >
                  <StepIcon size={24} />
                </motion.span>
                <div>
                  <h2 className="text-2xl font-bold text-white">{steps[step].title}</h2>
                  <p className="text-sm text-gray-400">{steps[step].content}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <motion.div 
                  className="rounded-3xl border border-white/15 bg-gradient-to-br from-red-500/10 to-red-600/5 p-5 relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/20 rounded-full blur-xl" />
                  <p className="text-xs uppercase tracking-[0.2em] text-red-300 mb-2 font-semibold">🚑 Ambulance Status</p>
                  <p className="text-2xl font-bold text-white">{statusText}</p>
                  <div className="mt-2 w-full bg-white/20 rounded-full h-2">
                    <motion.div 
                      className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full"
                      initial={{ width: '100%' }}
                      animate={{ width: countdown > 0 ? `${(countdown / 5) * 100}%` : '0%' }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </motion.div>
                <motion.div 
                  className="rounded-3xl border border-white/15 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 p-5"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-blue-300 mb-2 font-semibold">🫁 Breathing Phase</p>
                  <p className="text-2xl font-bold text-white capitalize">{breathePhase}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${breathePhase === 'inhale' ? 'bg-green-400 animate-pulse' : breathePhase === 'hold' ? 'bg-yellow-400' : 'bg-blue-400'}`} />
                    <span className="text-sm text-gray-400">{count}s</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {step === 1 && (
              <div className="flex justify-center mb-8">
                <motion.div
                  animate={{ 
                    scale: breathePhase === 'inhale' ? 1.3 : breathePhase === 'hold' ? 1.15 : 0.9,
                    borderColor: breathePhase === 'inhale' ? 'rgba(34, 197, 94, 0.5)' : breathePhase === 'hold' ? 'rgba(251, 191, 36, 0.5)' : 'rgba(59, 130, 246, 0.5)'
                  }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                  className="flex items-center justify-center rounded-full border-4 border-white/20 bg-gradient-to-br from-blue-500/20 to-white/10 w-64 h-64 shadow-2xl relative"
                >
                  <div className="absolute inset-2 rounded-full bg-white/5 flex items-center justify-center">
                    <motion.div 
                      className="flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-br from-white/10 to-white/5 text-6xl font-bold text-white shadow-inner border border-white/10"
                      animate={{ 
                        backgroundColor: breathePhase === 'inhale' ? 'rgba(34, 197, 94, 0.1)' : breathePhase === 'hold' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(59, 130, 246, 0.1)'
                      }}
                    >
                      {count}
                    </motion.div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-center">
                    <p className="text-lg font-semibold text-white capitalize">{breathePhase}</p>
                    <p className="text-sm text-gray-400">Follow the circle</p>
                  </div>
                </motion.div>
              </div>
            )}

            <div className="flex items-center justify-between gap-2 mb-6">
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-3 flex-1 rounded-full ${index <= step ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-white/10'}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                />
              ))}
            </div>

            <motion.button
              onClick={step < steps.length - 1 ? handleNext : () => setStep(0)}
              className="w-full neon-button text-white py-4 rounded-3xl shadow-lg hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] transition-all text-lg font-semibold"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {step < steps.length - 1 ? 'Next Step →' : 'Start Over ↻'}
            </motion.button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 glass-card rounded-3xl p-6 border border-white/10"
        >
          <h3 className="font-semibold text-white mb-4 text-lg">Quick Help Resources</h3>
          <div className="space-y-3">
            <motion.button
              onClick={handleEmergencyCall}
              className="w-full rounded-3xl border-l-4 border-red-500/70 bg-white/5 p-4 text-left flex items-center gap-3 hover:bg-red-500/10 transition-all hover:border-red-400/80"
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Phone className="text-red-400" />
              <div>
                <p className="font-semibold text-white">Crisis Helpline</p>
                <p className="text-sm text-gray-400">Call 988 for immediate support.</p>
              </div>
            </motion.button>
            <motion.a
              href="sms:741741?body=HOME"
              className="block w-full rounded-3xl border-l-4 border-amber-400/70 bg-white/5 p-4 flex items-center gap-3 hover:bg-amber-500/10 transition-all hover:border-amber-300/80"
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-amber-300 text-xl">💬</span>
              <div>
                <p className="font-semibold text-white">Crisis Text Line</p>
                <p className="text-sm text-gray-400">Text HOME to 741741.</p>
              </div>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PanicMode;
