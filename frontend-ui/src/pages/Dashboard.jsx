import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getDoctors, getHospitals } from '../utils/storage';
import Navbar from '../components/Navbar';
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

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="loader loader-lg mx-auto mb-4"></div>
          <p className="text-text-muted text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary flex">
      <Navbar />
      
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Greeting Section */}
          <section className="fade-in pt-4 lg:pt-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-main mb-1">
              Hello, {user.fullName.split(' ')[0]} 👋
            </h1>
            <p className="text-text-muted text-sm sm:text-base">
              Here's your mental health overview for today
            </p>
          </section>

          {/* AI Stress Analysis */}
          <section className="card p-4 sm:p-5 lg:p-6 fade-in">
            <div className="flex items-center gap-2 mb-4 sm:mb-5">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-accent-light flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                </svg>
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-text-main">AI Stress Insight</h2>
              <span className="text-text-light text-xs font-mono bg-bg-input px-2 py-0.5 rounded-full ml-auto flex-shrink-0">
                AnxietyNet v1.2
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-5">
              <div>
                <label className="block text-text-muted text-xs mb-1.5">Current Mood</label>
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
                <label className="block text-text-muted text-xs mb-1.5">Sleep (hours)</label>
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
                  className="w-full btn-primary py-2.5 sm:py-3 text-sm sm:text-base font-semibold"
                >
                  Analyze
                </button>
              </div>
            </div>

            {analyzed && anxietyScore !== null && (
              <div className="bg-bg-input border border-border rounded-xl p-4 sm:p-5 fade-in">
                <div className="text-center">
                  <div 
                    className="text-3xl sm:text-4xl font-bold mb-1"
                    style={{ color: getAnxietyLevel(anxietyScore).color }}
                  >
                    {Math.round(anxietyScore)}%
                  </div>
                  <div className="text-text-muted text-xs sm:text-sm mb-2">AI Stress Level</div>
                  <span 
                    className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
                    style={{ 
                      backgroundColor: `${getAnxietyLevel(anxietyScore).color}15`,
                      color: getAnxietyLevel(anxietyScore).color 
                    }}
                  >
                    {getAnxietyLevel(anxietyScore).label}
                  </span>
                  <p className="text-text-muted text-sm mt-2 max-w-md mx-auto">
                    {suggestion}
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Quick Stats */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 fade-in">
            <StatCard label="Heart Rate" value="72 bpm" icon="❤️" />
            <StatCard label="Sleep Score" value="82%" icon="😴" />
            <StatCard label="Mood Score" value="76%" icon="😊" />
            <StatCard label="Sessions" value="12" icon="📊" />
          </section>

          {/* Quick Actions */}
          <section className="card p-4 sm:p-5 fade-in">
            <h2 className="text-base sm:text-lg font-semibold text-text-main mb-4">Quick Actions</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
              <QuickAction icon="💨" label="Breathing" onClick={() => navigate('/breathing')} />
              <QuickAction icon="💭" label="Chat AI" onClick={() => navigate('/chat')} />
              <QuickAction icon="😊" label="Track Mood" onClick={() => navigate('/journal')} />
              <QuickAction icon="👨‍⚕️" label="Doctors" onClick={() => navigate('/doctors')} />
              <QuickAction icon="🏥" label="Hospitals" onClick={() => navigate('/hospitals')} />
              <QuickAction icon="📅" label="Appointments" onClick={() => navigate('/appointments')} />
            </div>
          </section>

          {/* Recommended Doctors */}
          <section className="card p-4 sm:p-5 fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-text-main">Recommended Doctors</h2>
              <button 
                onClick={() => navigate('/doctors')}
                className="text-sm text-primary font-medium hover:text-primary-dark flex items-center gap-1"
              >
                View all
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {doctors.slice(0, 3).map((doctor) => (
                <div 
                  key={doctor.id} 
                  className="border border-border rounded-xl p-3 hover:border-primary hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => navigate('/doctors')}
                >
                  <div className="flex items-start gap-3">
                    <img 
                      src={doctor.image} 
                      alt={doctor.name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-text-main text-sm truncate group-hover:text-primary transition-colors">
                        {doctor.name}
                      </h4>
                      <p className="text-text-muted text-xs truncate">{doctor.specialization}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-warning text-xs">★</span>
                        <span className="text-text-muted text-xs">{doctor.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Nearby Hospitals */}
          <section className="card p-4 sm:p-5 fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-text-main">Nearby Hospitals</h2>
              <button 
                onClick={() => navigate('/hospitals')}
                className="text-sm text-primary font-medium hover:text-primary-dark flex items-center gap-1"
              >
                View all
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              {hospitals.slice(0, 2).map((hospital) => (
                <div 
                  key={hospital.id} 
                  className="border border-border rounded-xl p-4 hover:border-primary hover:shadow-md transition-all cursor-pointer"
                  onClick={() => navigate('/hospitals')}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-text-main">{hospital.name}</h4>
                      <p className="text-text-muted text-sm mt-0.5 truncate">{hospital.location}</p>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-text-muted">
                          <span className="text-warning">★</span>{hospital.rating}
                        </span>
                        <span className="text-xs text-text-muted">{hospital.distance}</span>
                        <span className={`badge ${hospital.open ? 'badge-success' : 'badge-error'} text-xs`}>
                          {hospital.open ? 'Open' : 'Closed'}
                        </span>
                      </div>
                    </div>
                    {hospital.emergency && (
                      <span className="badge badge-error text-xs flex-shrink-0">Emergency</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recommendations */}
          <section className="card p-4 sm:p-5 fade-in">
            <h2 className="text-base sm:text-lg font-semibold text-text-main mb-3">Recommendations</h2>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5">
                <span className="text-primary mt-0.5 flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
                <span className="text-text-muted text-sm">Practice daily breathing exercises (5 mins)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-primary mt-0.5 flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
                <span className="text-text-muted text-sm">Aim for 7-8 hours of quality sleep</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-primary mt-0.5 flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
                <span className="text-text-muted text-sm">Journal your thoughts before bed</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-primary mt-0.5 flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
                <span className="text-text-muted text-sm">Stay hydrated and limit caffeine intake</span>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
};

// Quick Action Button
const QuickAction = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-1.5 p-3 sm:p-4 rounded-xl hover:bg-bg-input transition-all group active:scale-95"
  >
    <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">{icon}</span>
    <span className="text-text-muted text-xs sm:text-sm group-hover:text-text-main transition-colors text-center">
      {label}
    </span>
  </button>
);

export default Dashboard;