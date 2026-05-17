 import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser, getDoctors, getHospitals } from '../utils/storage';
import StatCard from '../components/StatCard';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [mood, setMood] = useState('calm');
  const [sleepHours, setSleepHours] = useState(7);
  const [anxietyScore, setAnxietyScore] = useState(null);
  const [suggestion, setSuggestion] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    
    // Load sample data
    setDoctors(getDoctors());
    setHospitals(getHospitals());
  }, [navigate]);

  const calculateAnxiety = () => {
    let score = 50;

    switch (mood) {
      case 'panic':
        score += 30;
        break;
      case 'stressed':
        score += 15;
        break;
      case 'calm':
        score -= 20;
        break;
      default:
        break;
    }

    if (sleepHours < 5) score += 20;
    else if (sleepHours <= 7) score += 5;
    else score -= 10;

    score = Math.max(0, Math.min(100, score));
    setAnxietyScore(score);
    setAnalyzed(true);

    if (score > 70) {
      setSuggestion('High stress detected. Try the 2-minute breathing exercise.');
    } else if (score > 40) {
      setSuggestion('Moderate stress. A short meditation could help.');
    } else {
      setSuggestion("You're in a good place. Keep maintaining healthy habits.");
    }
  };

  const getAnxietyLevel = (score) => {
    if (score > 70) return { label: 'High', color: '#EF4444' };
    if (score > 40) return { label: 'Medium', color: '#F59E0B' };
    return { label: 'Low', color: '#10B981' };
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="loader loader-lg mx-auto mb-4"></div>
          <p className="text-[var(--text-muted)] text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="bg-[var(--bg-card)] border-b border-[var(--border)] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <span className="text-[var(--text-main)] font-semibold">NeuroCare</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                <span className="text-[var(--primary)] text-sm font-medium">
                  {user.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-[var(--text-muted)] text-sm">{user.fullName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-[var(--text-muted)] hover:text-[var(--text-main)] text-sm font-medium transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Greeting */}
        <section className="fade-in">
          <h1 className="text-2xl font-bold text-[var(--text-main)] mb-1">
            Hello, {user.fullName.split(' ')[0]} 👋
          </h1>
          <p className="text-[var(--text-muted)] text-sm">
            Here's your mental health overview for today
          </p>
        </section>

        {/* AI Stress Analysis */}
        <section className="card p-6 fade-in">
          <div className="flex items-center gap-2 mb-5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
            <h2 className="text-lg font-semibold text-[var(--text-main)]">AI Stress Insight</h2>
            <span className="text-[var(--text-light)] text-xs font-mono bg-[var(--bg-input)] px-2 py-0.5 rounded ml-auto">
              AnxietyNet v1.2
            </span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-5">
            <div>
              <label className="block text-[var(--text-muted)] text-xs mb-1.5">Current Mood</label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full"
              >
                <option value="calm">Calm</option>
                <option value="stressed">Stressed</option>
                <option value="panic">Panic</option>
              </select>
            </div>
            <div>
              <label className="block text-[var(--text-muted)] text-xs mb-1.5">Sleep (hours)</label>
              <input
                type="number"
                min="0"
                max="12"
                value={sleepHours}
                onChange={(e) => setSleepHours(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={calculateAnxiety}
                className="w-full btn-primary py-2.5"
              >
                Analyze
              </button>
            </div>
          </div>

          {analyzed && anxietyScore !== null && (
            <div className="bg-[var(--bg-input)] border border-[var(--border)] rounded-xl p-5 fade-in">
              <div className="text-center">
                <div 
                  className="text-4xl font-bold mb-1"
                  style={{ color: getAnxietyLevel(anxietyScore).color }}
                >
                  {Math.round(anxietyScore)}%
                </div>
                <div className="text-[var(--text-muted)] text-xs mb-2">AI Stress Level</div>
                <span 
                  className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: `${getAnxietyLevel(anxietyScore).color}15`,
                    color: getAnxietyLevel(anxietyScore).color 
                  }}
                >
                  {getAnxietyLevel(anxietyScore).label}
                </span>
                <p className="text-[var(--text-muted)] text-sm mt-3 max-w-md mx-auto">
                  {suggestion}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 fade-in">
          <StatCard label="Heart Rate" value="72 bpm" icon="❤️" />
          <StatCard label="Sleep Score" value="82%" icon="😴" />
          <StatCard label="Mood Score" value="76%" icon="😊" />
          <StatCard label="Sessions" value="12" icon="📊" />
        </section>

        {/* Quick Actions */}
        <section className="card p-5 fade-in">
          <h2 className="text-lg font-semibold text-[var(--text-main)] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            <QuickAction icon="💨" label="Breathing" />
            <QuickAction icon="💭" label="Chat AI" />
            <QuickAction icon="😊" label="Track Mood" />
            <QuickAction icon="👨‍⚕️" label="Doctors" />
            <QuickAction icon="🏥" label="Hospitals" />
            <QuickAction icon="📅" label="Appointments" />
          </div>
        </section>

        {/* Recommended Doctors */}
        <section className="card p-5 fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--text-main)]">Recommended Doctors</h2>
            <a href="#" className="text-sm text-[var(--primary)] font-medium hover:text-[var(--primary-dark)]">View all</a>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {doctors.slice(0, 3).map((doctor) => (
              <div key={doctor.id} className="border border-[var(--border)] rounded-xl p-3 hover:border-[var(--primary)] transition-colors">
                <div className="flex items-start gap-3">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[var(--text-main)] text-sm truncate">{doctor.name}</h4>
                    <p className="text-[var(--text-muted)] text-xs">{doctor.specialization}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[var(--warning)] text-xs">★</span>
                      <span className="text-[var(--text-muted)] text-xs">{doctor.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Nearby Hospitals */}
        <section className="card p-5 fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--text-main)]">Nearby Hospitals</h2>
            <a href="#" className="text-sm text-[var(--primary)] font-medium hover:text-[var(--primary-dark)]">View all</a>
          </div>
          <div className="space-y-2">
            {hospitals.slice(0, 2).map((hospital) => (
              <div key={hospital.id} className="border border-[var(--border)] rounded-xl p-4 hover:border-[var(--primary)] transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-[var(--text-main)]">{hospital.name}</h4>
                    <p className="text-[var(--text-muted)] text-sm mt-0.5">{hospital.location}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                        <span className="text-[var(--warning)]">★</span>{hospital.rating}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">{hospital.distance}</span>
                      <span className={`badge ${hospital.open ? 'badge-success' : 'badge-error'} text-xs`}>
                        {hospital.open ? 'Open' : 'Closed'}
                      </span>
                    </div>
                  </div>
                  {hospital.emergency && (
                    <span className="badge badge-error text-xs">Emergency</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recommendations */}
        <section className="card p-5 fade-in">
          <h2 className="text-lg font-semibold text-[var(--text-main)] mb-3">Recommendations</h2>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-0.5">•</span>
              <span className="text-[var(--text-muted)] text-sm">Practice daily breathing exercises (5 mins)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-0.5">•</span>
              <span className="text-[var(--text-muted)] text-sm">Aim for 7-8 hours of quality sleep</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--primary)] mt-0.5">•</span>
              <span className="text-[var(--text-muted)] text-sm">Journal your thoughts before bed</span>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

// Quick Action Button
const QuickAction = ({ icon, label }) => (
  <button className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-[var(--bg-input)] transition-colors group">
    <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
    <span className="text-[var(--text-muted)] text-xs group-hover:text-[var(--text-main)] transition-colors">
      {label}
    </span>
  </button>
);

export default Dashboard;