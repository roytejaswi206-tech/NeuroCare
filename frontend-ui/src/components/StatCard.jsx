import React from 'react';

const StatCard = ({ label, value, icon }) => {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4">
      <span className="text-xl mb-1 block">{icon}</span>
      <p className="text-[var(--text-muted)] text-xs">{label}</p>
      <p className="text-xl font-semibold text-[var(--text-main)]">{value}</p>
    </div>
  );
};

export default StatCard;