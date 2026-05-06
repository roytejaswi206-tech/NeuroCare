import React from 'react';

const StatCard = ({ title, value, icon: Icon, className = '' }) => {
  return (
    <div className={`glass-card p-5 ${className}`}>
      <div className="flex items-center justify-between gap-4 hover:scale-105 transition-all duration-300 group">
        <div>
          <p className="text-sm text-gray-400 uppercase tracking-[0.2em]">{title}</p>
          <p className="text-3xl font-semibold mt-3 text-white">{value}</p>
        </div>
        {Icon && (
          <div className="w-14 h-14 rounded-3xl bg-white/10 flex items-center justify-center shadow-lg group-hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-all duration-300">
            <Icon size={24} className="text-neuro-accent" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
