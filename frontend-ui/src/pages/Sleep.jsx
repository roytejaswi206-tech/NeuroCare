import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Sleep = () => {
  const [sleepData, setSleepData] = useState([]);
  const [showLog, setShowLog] = useState(false);
  const [hours, setHours] = useState(7);
  const [quality, setQuality] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('neurocare_sleep');
    if (saved) {
      setSleepData(JSON.parse(saved));
    } else {
      // Sample data
      const today = new Date();
      const sampleData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        sampleData.push({
          id: i,
          date: date.toISOString(),
          hours: 6 + Math.random() * 3,
          quality: Math.floor(Math.random() * 3) + 2
        });
      }
      setSleepData(sampleData);
    }
  }, []);

  const saveSleepLog = () => {
    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      hours: parseFloat(hours),
      quality
    };

    const updated = [entry, ...sleepData.slice(0, 6)];
    setSleepData(updated);
    localStorage.setItem('neurocare_sleep', JSON.stringify(updated));
    setShowLog(false);
  };

  const getQualityStars = (q) => {
    return '★'.repeat(q) + '☆'.repeat(5 - q);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const avgHours = sleepData.length > 0 
    ? (sleepData.reduce((sum, d) => sum + d.hours, 0) / sleepData.length).toFixed(1)
    : 0;

  const avgQuality = sleepData.length > 0
    ? (sleepData.reduce((sum, d) => sum + d.quality, 0) / sleepData.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-bg-primary flex">
      <Navbar />
      
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pt-4 lg:pt-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-main">Sleep Tracker</h1>
              <p className="text-text-muted text-sm">Monitor your sleep patterns</p>
            </div>
            <button
              onClick={() => setShowLog(!showLog)}
              className="btn-primary py-2 px-4 flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span className="hidden sm:inline">Log Sleep</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="card p-4">
              <div className="text-3xl font-bold text-primary mb-1">{avgHours}h</div>
              <p className="text-text-muted text-xs">Avg. Sleep Duration</p>
            </div>
            <div className="card p-4">
              <div className="text-3xl font-bold text-warning mb-1">{avgQuality}</div>
              <p className="text-text-muted text-xs">Avg. Sleep Quality</p>
            </div>
          </div>

          {/* Sleep Log Form */}
          {showLog && (
            <div className="card p-4 sm:p-6 mb-6 fade-in">
              <h2 className="text-lg font-semibold text-text-main mb-4">Log Your Sleep</h2>
              
              <div className="mb-4">
                <label className="block text-text-muted text-sm mb-2">
                  Hours of sleep: <span className="font-semibold text-text-main">{hours}h</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="0.5"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block text-text-muted text-sm mb-2">Sleep Quality</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuality(q)}
                      className={`text-2xl transition-all ${
                        quality >= q ? 'text-warning' : 'text-border'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={saveSleepLog} className="btn-primary py-2 px-4">
                  Save
                </button>
                <button 
                  onClick={() => setShowLog(false)} 
                  className="btn-secondary py-2 px-4"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Sleep History */}
          <div className="card p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-text-main mb-4">Sleep History</h2>
            
            <div className="space-y-3">
              {sleepData.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-text-main">{formatDate(entry.date)}</p>
                    <div className="text-warning text-sm mt-1">
                      {getQualityStars(entry.quality)}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">{entry.hours}h</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <div className="card p-4 sm:p-6 mt-6">
            <h2 className="text-lg font-semibold text-text-main mb-4">Sleep Tips</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
                <span className="text-text-muted text-sm">Maintain a consistent sleep schedule, even on weekends</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
                <span className="text-text-muted text-sm">Avoid screens at least 1 hour before bedtime</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
                <span className="text-text-muted text-sm">Keep your bedroom cool, dark, and quiet</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
                <span className="text-text-muted text-sm">Limit caffeine intake after 2 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Sleep;