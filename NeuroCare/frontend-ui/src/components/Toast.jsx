import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  const icons = {
    success: <CheckCircle className="text-neuro-success" size={20} />,
    error: <AlertCircle className="text-neuro-danger" size={20} />,
    info: <Info className="text-neuro-accent" size={20} />,
  };
  
  const bgColors = {
    success: 'border-neuro-success',
    error: 'border-neuro-danger',
    info: 'border-neuro-accent',
  };
  
  return (
    <div className={`fixed top-4 right-4 z-50 glass-card p-4 flex items-center gap-3 border-l-4 ${bgColors[type]} animate-slide-in max-w-sm`}>
      {icons[type]}
      <p className="text-sm flex-1">{message}</p>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
