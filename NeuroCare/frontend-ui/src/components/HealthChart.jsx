import React from 'react';
import { LineChart, Line, BarChart, Bar, RadialBarChart, RadialBar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const HealthChart = ({ type = 'mood', data = [], height = 300 }) => {
  // Dummy data if empty (per spec)
  const dummyData = [
    { name: 'Mon', value: 4, sleep: 7 },
    { name: 'Tue', value: 3.5, sleep: 6.5 },
    { name: 'Wed', value: 4.2, sleep: 7.2 },
    { name: 'Thu', value: 3.8, sleep: 6.8 },
    { name: 'Fri', value: 4.5, sleep: 7.5 },
    { name: 'Sat', value: 4.0, sleep: 7.0 },
    { name: 'Sun', value: 4.8, sleep: 8.0 },
  ];

  const chartData = data.length > 0 ? data : dummyData;

  if (type === 'mood') {
    return (
      <div className="glass-card p-6 h-full">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span>🧠</span> Mood Trend
        </h3>
        <ResponsiveContainer height={height}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} domain={['dataMin - 1', 'dataMax + 1']} />
            <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }} />
            <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', strokeWidth: 2 }} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'sleep') {
    return (
      <div className="glass-card p-6 h-full">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span>😴</span> Sleep Quality
        </h3>
        <ResponsiveContainer height={height}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }} />
            <Bar dataKey="sleep" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'stress') {
    const radialData = [{ name: 'Stress', value: 65, fill: '#ef4444' }];
    return (
      <div className="glass-card p-6 h-full flex flex-col items-center justify-center text-center">
        <h3 className="text-lg font-bold mb-6">⚡ Stress Level</h3>
        <ResponsiveContainer width="100%" height={200}>
          <RadialBarChart data={radialData} startAngle={-180} endAngle={180}>
            <RadialBar dataKey="value" cornerRadius={50} background fill="#6366f1" />
            <Tooltip />
            <text x="50%" y="40%" textAnchor="middle" className="fill-white text-3xl font-bold">
              {Math.round(Math.random() * 40 + 20)}%
            </text>
            <text x="50%" y="55%" textAnchor="middle" className="fill-gray-400 text-sm">
              Medium
            </text>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
};

export default HealthChart;

