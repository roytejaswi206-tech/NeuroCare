import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Phone, MapPin, Wind, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useToast } from '../components/ToastContext';

const PanicMode = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const [breathePhase, setBreathePhase] = useState('inhale');
  const [count, setCount] = useState(4);
  
  const steps = [
    {
      title: 'You Are Safe',
      content: "Take a moment to remind yourself: You are safe right now. This feeling will pass.",
      icon: CheckCircle,
    },
    {
      title: 'Breathing Exercise',
      content: 'Follow the circle - breathe in for 4 seconds, hold for 4 seconds, breathe out for 4 seconds.',
      icon: Wind,
      action: 'breathing',
    },
    {
      title: 'Grounding',
      content: 'Look around and name: 5 things you can see, 4 things you can touch, 3 things you can hear.',
      icon: CheckCircle,
    },
    {
      title: 'You Are Strong',
      content: 'Remember: Panic attacks are not dangerous. They pass. You are stronger than you think.',
      icon: CheckCircle,
    },
  ];
  
  useEffect(() => {
    if (step === 1) {
      // Breathing exercise
      const interval = setInterval(() => {
        setCount((prev) => {
          if (prev === 1) {
            // Switch phase
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
  
  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      setCount(4);
      showToast('Moving to the next calming step.', 'info');
    }
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

  return (
    <div className="min-h-screen bg-neuro-dark pb-20 md:pb-4">
      <Navbar />
      
      <div className="max-w-2xl mx-auto p-4 pt-20 md:pt-4">
        <div className="flex items-center gap-2 mb-6">
          <AlertTriangle className="text-neuro-danger" size={28} />
          <h1 className="text-2xl font-bold text-neuro-danger">Panic Mode</h1>
        </div>
        
        {/* Main Panic Button */}
        {step === 0 && (
          <div className="glass-card p-8 text-center animate-fade-in">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center animate-pulse-slow">
              <AlertTriangle size={48} className="text-white" />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">I Need Help Now</h2>
            <p className="text-gray-400 mb-6">
              It's okay to ask for help. Let's work through this together.
            </p>
            
            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-8 rounded-lg text-lg font-bold mb-4"
            >
              Start Breathing Exercise
            </button>
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleEmergencyCall}
                className="flex-1 bg-neuro-card border border-neuro-danger text-neuro-danger py-3 px-4 rounded-lg flex items-center justify-center gap-2"
              >
                <Phone size={18} />
                Call 988
              </button>
              <button
                onClick={handleFindHospital}
                className="flex-1 bg-neuro-card border border-neuro-accent text-neuro-accent py-3 px-4 rounded-lg flex items-center justify-center gap-2"
              >
                <MapPin size={18} />
                Find Hospital
              </button>
            </div>
          </div>
        )}
        
        {/* Steps */}
        {step > 0 && (
          <div className="glass-card p-8 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <StepIcon size={24} className="text-neuro-accent" />
              <h2 className="text-xl font-bold">{steps[step].title}</h2>
            </div>
            
            <p className="text-gray-300 mb-6">{steps[step].content}</p>
            
            {/* Breathing Animation */}
            {step === 1 && (
              <div className="flex justify-center my-8">
                <div
                  className={`breathing-circle flex items-center justify-center ${
                    breathePhase === 'inhale'
                      ? 'scale-110'
                      : breathePhase === 'hold'
                      ? 'scale-110'
                      : 'scale-100'
                  }`}
                >
                  <span className="text-white text-2xl font-bold">{count}</span>
                </div>
              </div>
            )}
            
            {/* Progress */}
            <div className="flex justify-between mb-6">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index <= step ? 'bg-neuro-accent' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
            
            {step < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="w-full neon-button text-white py-3"
              >
                Next Step
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => setStep(0)}
                  className="w-full bg-neuro-accent text-white py-3 rounded-lg"
                >
                  Start Over
                </button>
                <button
                  onClick={handleFindHospital}
                  className="w-full bg-neuro-card border border-neuro-accent text-neuro-accent py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <MapPin size={18} />
                  Find Nearby Hospital
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Quick Help */}
        <div className="mt-6 glass-card p-6">
          <h3 className="font-semibold mb-4">Quick Help</h3>
          <div className="space-y-2">
            <button
              onClick={handleEmergencyCall}
              className="w-full bg-neuro-card border-l-4 border-neuro-danger p-4 rounded-r-lg text-left flex items-center gap-3"
            >
              <Phone className="text-neuro-danger" />
              <div>
                <p className="font-semibold text-neuro-danger">Crisis Helpline</p>
                <p className="text-sm text-gray-400">Call 988 (Suicide & Crisis Lifeline)</p>
              </div>
            </button>
            
            <a
              href="sms:741741?body=HOME"
              className="block w-full bg-neuro-card border-l-4 border-neuro-warning p-4 rounded-r-lg flex items-center gap-3"
            >
              <span className="text-neuro-warning">💬</span>
              <div>
                <p className="font-semibold text-neuro-warning">Crisis Text Line</p>
                <p className="text-sm text-gray-400">Text HOME to 741741</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanicMode;
