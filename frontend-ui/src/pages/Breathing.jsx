import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Breathing = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('idle'); // idle, inhale, hold, exhale
  const [cycles, setCycles] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState('box');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const exercises = {
    box: { name: 'Box Breathing', inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
    relaxing: { name: '4-7-8 Relaxing', inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
    energizing: { name: 'Energizing Breath', inhale: 6, hold1: 0, exhale: 3, hold2: 0 },
    calm: { name: 'Calming Breath', inhale: 4, hold1: 2, exhale: 6, hold2: 2 }
  };

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeElapsed(t => t + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) {
      setPhase('idle');
      return;
    }

    const exercise = exercises[selectedExercise];
    let currentPhase = 'inhale';
    let phaseTime = 0;

    const runCycle = () => {
      switch (currentPhase) {
        case 'inhale':
          setPhase('inhale');
          phaseTime = exercise.inhale;
          break;
        case 'hold1':
          setPhase('hold');
          phaseTime = exercise.hold1;
          break;
        case 'exhale':
          setPhase('exhale');
          phaseTime = exercise.exhale;
          break;
        case 'hold2':
          if (exercise.hold2 > 0) {
            setPhase('hold');
            phaseTime = exercise.hold2;
          } else {
            currentPhase = 'inhale';
            setCycles(c => c + 1);
            runCycle();
            return;
          }
          break;
      }

      setTimeout(() => {
        switch (currentPhase) {
          case 'inhale':
            currentPhase = exercise.hold1 > 0 ? 'hold1' : 'exhale';
            break;
          case 'hold1':
            currentPhase = 'exhale';
            break;
          case 'exhale':
            currentPhase = exercise.hold2 > 0 ? 'hold2' : 'inhale';
            if (exercise.hold2 === 0) {
              setCycles(c => c + 1);
            }
            break;
          case 'hold2':
            currentPhase = 'inhale';
            setCycles(c => c + 1);
            break;
        }
        runCycle();
      }, phaseTime * 1000);
    };

    runCycle();

    return () => {
      // Cleanup timeouts
    };
  }, [isActive, selectedExercise]);

  const toggleBreathing = () => {
    if (isActive) {
      setIsActive(false);
      setPhase('idle');
    } else {
      setIsActive(true);
      setCycles(0);
      setTimeElapsed(0);
    }
  };

  const resetExercise = () => {
    setIsActive(false);
    setPhase('idle');
    setCycles(0);
    setTimeElapsed(0);
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

  const getCircleSize = () => {
    switch (phase) {
      case 'inhale': return 'scale-125';
      case 'exhale': return 'scale-75';
      default: return 'scale-100';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'from-primary to-accent';
      case 'hold': return 'from-accent to-primary';
      case 'exhale': return 'from-primary to-accent';
      default: return 'from-text-light to-border';
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex">
      <Navbar />
      
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="pt-4 lg:pt-8 mb-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-main mb-2">Breathing Exercises</h1>
            <p className="text-text-muted text-sm">Calm your mind with guided breathing</p>
          </div>

          {/* Exercise Selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {Object.entries(exercises).map(([key, exercise]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedExercise(key);
                  resetExercise();
                }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedExercise === key
                    ? 'border-primary bg-primary-light'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <p className="font-semibold text-text-main text-sm">{exercise.name}</p>
                <p className="text-text-muted text-xs mt-1">
                  {exercise.inhale}-{exercise.hold1 > 0 ? exercise.hold1 + '-' : ''}{exercise.exhale}
                  {exercise.hold2 > 0 ? `-${exercise.hold2}` : ''}
                </p>
              </button>
            ))}
          </div>

          {/* Breathing Circle */}
          <div className="card p-6 sm:p-10 flex flex-col items-center justify-center mb-6 min-h-[300px]">
            <div className="relative flex items-center justify-center">
              {/* Animated Circle */}
              <div 
                className={`w-40 h-40 sm:w-52 sm:h-52 rounded-full bg-gradient-to-br transition-all duration-1000 ease-in-out ${getPhaseColor()} ${isActive ? getCircleSize() : ''} flex items-center justify-center`}
              >
                <div className="text-center">
                  <p className="text-white text-2xl sm:text-3xl font-bold">
                    {getPhaseText()}
                  </p>
                  {isActive && (
                    <p className="text-white/80 text-sm mt-1">
                      Cycle {cycles + 1}
                    </p>
                  )}
                </div>
              </div>

              {/* Outer rings */}
              {isActive && (
                <>
                  <div className="absolute w-48 h-48 sm:w-60 sm:h-60 rounded-full border-2 border-primary/30 animate-pulse"></div>
                  <div className="absolute w-56 h-56 sm:w-68 sm:h-68 rounded-full border-2 border-primary/20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                </>
              )}
            </div>

            {/* Timer */}
            <div className="mt-6 text-center">
              <p className="text-text-muted text-sm">Duration</p>
              <p className="text-2xl font-bold text-text-main">{formatTime(timeElapsed)}</p>
            </div>

            {/* Controls */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={toggleBreathing}
                className={`btn-primary py-3 px-8 text-lg ${isActive ? 'btn-danger' : ''}`}
              >
                {isActive ? 'Stop' : 'Start'}
              </button>
              <button
                onClick={resetExercise}
                className="btn-secondary py-3 px-6"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Benefits */}
          <div className="card p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-text-main mb-4">Benefits of Breathing Exercises</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
                <span className="text-text-muted text-sm">Reduces stress and anxiety levels</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
                <span className="text-text-muted text-sm">Improves focus and concentration</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
                <span className="text-text-muted text-sm">Lowers blood pressure and heart rate</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
                <span className="text-text-muted text-sm">Promotes better sleep quality</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
                <span className="text-text-muted text-sm">Increases self-awareness and mindfulness</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Breathing;