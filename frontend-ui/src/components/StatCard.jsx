import React from 'react';

const StatCard = ({ label, value, icon }) => {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all duration-300 hover:border-primary/30 group">
      <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform duration-300">{icon}</span>
      <p className="text-text-muted text-xs">{label}</p>
      <p className="text-xl font-semibold text-text-main">{value}</p>
    </div>
  );
};

export default StatCard;