import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentUser } from '../utils/storage';
import { useToast } from '../components/ToastContext';
import {
  Wind, Heart, Moon, Sun, Sparkles, Play, Pause, RotateCcw,
  ChevronLeft, Info, BookOpen, Clock, Award
} from 'lucide-react';

const breathingTechniques = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: '4-4-4-4 technique for stress relief',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    color: 'from-blue-400 to-blue-600',
    bgGradient: 'from-blue-900/20 to-blue-800/20',
    benefits: ['Reduces stress', 'Improves focus', 'Calms nervous system']
  },
  {
    id: 'relax',
    name: '4-7-8 Relaxation',
    description: 'Natural tranquilizer for the nervous system',
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
    color: 'from-purple-400 to-purple-600',
    bgGradient: 'from-purple-900/20 to-purple-800/20',
    benefits: ['Reduces anxiety', 'Helps with sleep', 'Calms mind']
  },
  {
    id: 'energize',
    name: 'Energizing Breath',
    description: 'Quick energy boost technique',
    inhale: 2,
    hold1: 0,
    exhale: 2,
    hold2: 0,
    cycles: 30,
    color: 'from-orange-400 to-orange-600',
    bgGradient: 'from-orange-900/20 to-orange-800/20',
    benefits: ['Boosts energy', 'Increases alertness', 'Wakes up body']
  },
  {
    id: 'calm',
    name: 'Calming Breath',
    description: 'Extended exhale for deep relaxation',
    inhale: 4,
    hold1: 0,
    exhale: 6,
    hold2: 0,
    color: 'from-green-400 to-green-600',
    bgGradient: 'from-green-900/20 to-green-800/20',
    benefits: ['Deep relaxation', 'Reduces panic', 'Lowers heart rate']
  }
];

const Breathing = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [user, setUser] = useState(null);
  const [selectedTechnique, setSelectedTechnique] = useState(breathingTechniques[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState('idle'); // idle, inhale, hold, exhale
  const [timer, setTimer] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [totalCycles, setTotalCycles] = useState(5);
  const [sessionTime, setSessionTime] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const intervalRef = useRef(null);
  const sessionTimerRef = useRef(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login', { replace: true });
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  useEffect(() => {
    if (isRunning) {
      runBreathingCycle();
      sessionTimerRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
      setPhase('idle');
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    };
  }, [isRunning, selectedTechnique]);

  const runBreathingCycle = () => {
    const { inhale, hold1, exhale, hold2 } = selectedTechnique;
    let currentPhase = 0;
    const phases = [];

    if (inhale > 0) phases.push({ name: 'inhale', duration: inhale });
    if (hold1 > 0) phases.push({ name: 'hold', duration: hold1 });
    if (exhale > 0) phases.push({ name: 'exhale', duration: exhale });
    if (hold2 > 0) phases.push({ name: 'hold', duration: hold2 });

    let phaseIndex = 0;
    let phaseTimer = 0;

    const runPhase = () => {
      if (phaseIndex >= phases.length) {
        setCycle(prev => {
          const newCycle = prev + 1;
          if (newCycle >= totalCycles) {
            setIsRunning(false);
            showToast('🎉 Breathing session completed!', 'success');
            saveSessionData();
            return 0;
          }
          return newCycle;
        });
        phaseIndex = 0;
      }

      const current = phases[phaseIndex];
      setPhase(current.name);
      setTimer(current.duration);

      intervalRef.current = setInterval(() => {
        phaseTimer++;
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            phaseTimer = 0;
            phaseIndex++;
            setTimeout(runPhase, 100);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    runPhase();
  };

  const saveSessionData = () => {
    const sessions = JSON.parse(localStorage.getItem('breathingSessions') || '[]');
    sessions.push({
      id: Date.now(),
      technique: selectedTechnique.id,
      techniqueName: selectedTechnique.name,
      duration: sessionTime,
      cycles: totalCycles,
      date: new Date().toISOString()
    });
    localStorage.setItem('breathingSessions', JSON.stringify(sessions.slice(-50)));
  };

  const handleStart = () => {
    setIsRunning(true);
    setCycle(0);
    setSessionTime(0);
  };

  const handlePause = () => {
    setIsRunning(false);
    setPhase('idle');
  };

  const handleReset = () => {
    setIsRunning(false);
    setPhase('idle');
    setCycle(0);
    setTimer(0);
    setSessionTime(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      default: return 'Ready';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'text-blue-400';
      case 'hold': return 'text-purple-400';
      case 'exhale': return 'text-green-400';
      default: return 'text-white';
    }
  };

  const getCircleScale = () => {
    if (phase === 'inhale') return 1.3;
    if (phase === 'exhale') return 0.8;
    return 1;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7FB]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00BFA6] mx-auto mb-4"></div>
          <p className="text-[#64748B]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${selectedTechnique.bgGradient} transition-all duration-1000`}>
      {/* Header */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-white hover:text-white/80 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="font-semibold">Back</span>
            </button>
            <div className="flex items-center space-x-2">
              <Wind className="h-6 w-6 text-white" />
              <span className="text-xl font-bold text-white">Breathing</span>
            </div>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 text-white hover:text-white/80 transition-colors"
            >
              <Info className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Technique Selector */}
        <div className="mb-8">
          <h2 className="text-white/80 text-sm font-semibold mb-4 uppercase tracking-wider">Choose Technique</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {breathingTechniques.map((tech) => (
              <button
                key={tech.id}
                onClick={() => {
                  if (!isRunning) {
                    setSelectedTechnique(tech);
                    handleReset();
                  }
                }}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  selectedTechnique.id === tech.id
                    ? `border-white/30 bg-white/10`
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${tech.color} flex items-center justify-center mb-3 mx-auto`}>
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-white font-semibold text-sm">{tech.name}</h3>
                <p className="text-white/60 text-xs mt-1">{tech.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Breathing Circle */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative">
            {/* Outer glow */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl"
              animate={{
                scale: isRunning ? [1, 1.2, 1] : 1,
                opacity: isRunning ? [0.3, 0.5, 0.3] : 0.2
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            {/* Main circle */}
            <motion.div
              className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 backdrop-blur-md border border-white/20 flex items-center justify-center"
              animate={{ scale: getCircleScale() }}
              transition={{ duration: selectedTechnique.inhale || 4, ease: "easeInOut" }}
            >
              {/* Inner circle */}
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <div className="text-center">
                  <motion.p
                    className={`text-4xl md:text-5xl font-bold ${getPhaseColor()} mb-2`}
                    key={phase}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {isRunning ? getPhaseText() : 'Ready'}
                  </motion.p>
                  {isRunning && (
                    <p className="text-white/60 text-lg">{timer}s</p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Orbiting particles */}
            {isRunning && (
              <>
                {[0, 120, 240].map((delay, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-full bg-white/60"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `translate(-50%, -50%)`
                    }}
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 3,
                      delay: delay * 0.1,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                ))}
              </>
            )}
          </div>

          {/* Cycle counter */}
          {isRunning && (
            <div className="mt-6 text-center">
              <p className="text-white/60">
                Cycle <span className="text-white font-bold text-xl">{cycle + 1}</span> of{' '}
                <span className="text-white font-bold text-xl">{totalCycles}</span>
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-6 mb-8">
          <button
            onClick={handleReset}
            className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <RotateCcw className="h-6 w-6 text-white" />
          </button>

          <button
            onClick={isRunning ? handlePause : handleStart}
            className={`p-6 rounded-full bg-gradient-to-r ${selectedTechnique.color} shadow-lg hover:shadow-xl transition-all hover:scale-105`}
          >
            {isRunning ? (
              <Pause className="h-8 w-8 text-white" />
            ) : (
              <Play className="h-8 w-8 text-white ml-1" />
            )}
          </button>

          <button
            onClick={() => setTotalCycles(prev => Math.min(prev + 1, 20))}
            className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center space-x-2"
          >
            <Clock className="h-5 w-5 text-white" />
            <span className="text-white font-semibold">{totalCycles}</span>
          </button>
        </div>

        {/* Session stats */}
        {sessionTime > 0 && (
          <div className="text-center mb-8">
            <p className="text-white/60">
              Session time: <span className="text-white font-semibold">{formatTime(sessionTime)}</span>
            </p>
          </div>
        )}

        {/* Benefits */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Benefits of {selectedTechnique.name}
          </h3>
          <ul className="space-y-2">
            {selectedTechnique.benefits.map((benefit, i) => (
              <li key={i} className="flex items-center text-white/80">
                <Sparkles className="h-4 w-4 mr-2 text-green-400" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {/* Info Panel */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8"
            >
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                About Breathing Exercises
              </h3>
              <div className="text-white/80 space-y-4">
                <p>
                  Controlled breathing exercises have been practiced for thousands of years in various cultures.
                  Modern science confirms their benefits for mental and physical health.
                </p>
                <p>
                  <strong className="text-white">How it works:</strong> Slow, deep breathing activates your
                  parasympathetic nervous system (the "rest and digest" system), reducing stress hormones
                  and promoting relaxation.
                </p>
                <p>
                  <strong className="text-white">Benefits:</strong> Regular practice can help reduce anxiety,
                  improve sleep quality, lower blood pressure, enhance focus, and promote overall emotional well-being.
                </p>
                <p className="text-sm text-white/60 italic">
                  ⚠️ Note: If you feel dizzy or uncomfortable, stop the exercise and breathe normally.
                  These exercises are not a substitute for medical treatment.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Previous sessions */}
        <PreviousSessions />
      </main>
    </div>
  );
};

// Previous Sessions Component
const PreviousSessions = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('breathingSessions') || '[]');
    setSessions(saved.reverse().slice(0, 5));
  }, []);

  if (sessions.length === 0) return null;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
      <h3 className="text-white font-semibold mb-4 flex items-center">
        <Clock className="h-5 w-5 mr-2" />
        Recent Sessions
      </h3>
      <div className="space-y-3">
        {sessions.map((session) => (
          <div key={session.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <p className="text-white font-medium">{session.techniqueName}</p>
              <p className="text-white/60 text-sm">
                {new Date(session.date).toLocaleDateString()} • {session.cycles} cycles
              </p>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">
                {Math.floor(session.duration / 60)}:{(session.duration % 60).toString().padStart(2, '0')}
              </p>
              <p className="text-white/60 text-sm">minutes</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Breathing;