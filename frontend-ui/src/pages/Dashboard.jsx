import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatCard from '../components/StatCard';
import QuickActionCard from '../components/QuickActionCard';
import HealthChart from '../components/HealthChart';
import AIBanner from '../components/AIBanner';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [mood, setMood] = useState('calm');
  const [sleepHours, setSleepHours] = useState(7);
  const [anxietyScore, setAnxietyScore] = useState(50);
  const [suggestion, setSuggestion] = useState('');

  useEffect(() => {
    const loggedIn = localStorage.getItem('neurocare_logged_in');
    if (!loggedIn) {
      window.location.href = '/login';
    }

    const userStr = localStorage.getItem('neurocare_user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const calculateAnxiety = () => {
    let score = 50;

    // Mood impact
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

    // Sleep impact
    if (sleepHours < 5) score += 20;
    else if (sleepHours <= 7) score += 5;
    else score -= 10;

    // Clamp 0-100
    score = Math.max(0, Math.min(100, score));

    setAnxietyScore(score);

    // Suggestion
    if (score > 70) {
      setSuggestion('Try 2-min breathing exercise now');
    } else if (score > 40) {
      setSuggestion('Consider short meditation session');
    } else {
      setSuggestion("You're doing great. Keep it up!");
    }
  };

  const handleCalc = () => {
    calculateAnxiety();
  };

  return (
    <div className="min-h-screen bg-[#0B1220] p-6 pb-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fade-in"
        >
          <h1 className="text-4xl font-bold text-[#E6F1FF] mb-2">
            Hi{user ? `, ${user.name}` : ''} 👋
          </h1>
          <p className="text-[#8AA0B3] text-lg">Here's your mental health overview</p>
        </motion.div>

        {/* AI Insight Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-8"
        >
          <h2 className="text-2xl font-bold text-[#E6F1FF] mb-6 flex items-center">
            AI Stress Insight <span className="text-sm text-[#8AA0B3] ml-2">(AnxietyNet v1.2)</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-[#E6F1FF] text-sm font-medium mb-2">Current Mood</label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full bg-[#0F172A] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-[#E6F1FF]"
              >
                <option value="calm">Calm</option>
                <option value="stressed">Stressed</option>
                <option value="panic">Panic</option>
              </select>
            </div>
            <div>
              <label className="block text-[#E6F1FF] text-sm font-medium mb-2">Sleep (hours)</label>
              <input
                type="number"
                min="0"
                max="12"
                value={sleepHours}
                onChange={(e) => setSleepHours(Number(e.target.value))}
                className="w-full bg-[#0F172A] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-[#E6F1FF]"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleCalc}
                className="ml-auto bg-[#00C2A8] hover:-translate-y-[2px] text-[#0B1220] font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Analyze
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#00C2A8]/10 to-[#6C63FF]/10 border border-[rgba(255,255,255,0.08)] rounded-2xl p-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-[#E6F1FF] mb-2">{Math.round(anxietyScore)}%</div>
              <div className="text-[#8AA0B3] mb-4">AI Stress Level</div>
              <div className="bg-[#121A2F] text-[#E6F1FF] px-4 py-2 rounded-xl inline-block text-sm font-medium">
                {anxietyScore > 70 ? 'High' : anxietyScore > 40 ? 'Medium' : 'Low'}
              </div>
              <p className="text-[#8AA0B3] mt-4 italic">{suggestion}</p>
            </div>
          </div>
        </motion.section>

        {/* Quick Stats */}
        <section className="grid md:grid-cols-4 gap-6">
          <StatCard title="Heart Rate" value="72 bpm" trend="stable" />
          <StatCard title="Sleep Score" value="82%" trend="up" />
          <StatCard title="Mood Score" value="76%" trend="down" />
          <StatCard title="Sessions" value="12 this week" trend="up" />
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 card p-8"
          >
            <h2 className="text-2xl font-bold text-[#E6F1FF] mb-6">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <QuickActionCard title="Breathing" icon="💨" to="/panic" />
              <QuickActionCard title="Chat AI" icon="💭" to="/chat" />
              <QuickActionCard title="Track Mood" icon="😊" to="/mood" />
              <QuickActionCard title="Find Doctor" icon="👨‍⚕️" to="/doctors" />
              <QuickActionCard title="Nearby Hospital" icon="🏥" to="/hospitals" />
              <QuickActionCard title="Book Appointment" icon="📅" to="/appointments" />
            </div>
          </motion.section>

          {/* Health Chart */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-8"
          >
            <h2 className="text-2xl font-bold text-[#E6F1FF] mb-6">Weekly Mood Trend</h2>
            <HealthChart />
          </motion.section>
        </div>

        {/* Recommendations */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-8"
        >
          <h2 className="text-2xl font-bold text-[#E6F1FF] mb-6">Recommendations</h2>
          <ul className="space-y-3 text-[#8AA0B3]">
            <li className="flex items-start">
              <span className="text-[#00C2A8] mr-3 font-bold text-lg">•</span>
              Practice daily breathing exercises (5 mins)
            </li>
            <li className="flex items-start">
              <span className="text-[#00C2A8] mr-3 font-bold text-lg">•</span>
              Aim for 7-8 hours of quality sleep
            </li>
            <li className="flex items-start">
              <span className="text-[#00C2A8] mr-3 font-bold text-lg">•</span>
              Journal your thoughts before bed
            </li>
          </ul>
        </motion.section>
      </div>
    </div>
  );
};

export default Dashboard;

