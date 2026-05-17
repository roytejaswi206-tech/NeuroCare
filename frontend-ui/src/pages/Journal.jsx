import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getCurrentUser } from '../utils/storage';

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState('');
  const [mood, setMood] = useState('neutral');
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    // Load saved entries from localStorage
    const saved = localStorage.getItem('neurocare_journal');
    if (saved) {
      setEntries(JSON.parse(saved));
    } else {
      // Sample entries
      setEntries([
        {
          id: 1,
          text: "Today was a good day. I managed to complete my morning meditation and felt really centered.",
          mood: "happy",
          date: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 2,
          text: "Feeling a bit stressed about the upcoming presentation at work. Need to prepare better.",
          mood: "stressed",
          date: new Date(Date.now() - 172800000).toISOString()
        }
      ]);
    }
  }, []);

  const saveEntry = () => {
    if (!newEntry.trim()) return;

    const entry = {
      id: Date.now(),
      text: newEntry,
      mood,
      date: new Date().toISOString()
    };

    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem('neurocare_journal', JSON.stringify(updated));
    setNewEntry('');
    setShowForm(false);
  };

  const deleteEntry = (id) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('neurocare_journal', JSON.stringify(updated));
  };

  const getMoodEmoji = (m) => {
    const moods = {
      happy: '😊',
      calm: '😌',
      neutral: '😐',
      sad: '😢',
      stressed: '😰',
      anxious: '😟'
    };
    return moods[m] || '😐';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-bg-primary flex">
      <Navbar />
      
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pt-4 lg:pt-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-main">Journal</h1>
              <p className="text-text-muted text-sm">Track your thoughts and feelings</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary py-2 px-4 flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span className="hidden sm:inline">New Entry</span>
            </button>
          </div>

          {/* New Entry Form */}
          {showForm && (
            <div className="card p-4 sm:p-6 mb-6 fade-in">
              <h2 className="text-lg font-semibold text-text-main mb-4">Write your thoughts</h2>
              
              {/* Mood Selector */}
              <div className="mb-4">
                <label className="block text-text-muted text-sm mb-2">How are you feeling?</label>
                <div className="flex gap-2 flex-wrap">
                  {['happy', 'calm', 'neutral', 'sad', 'stressed', 'anxious'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMood(m)}
                      className={`px-3 py-2 rounded-xl border-2 transition-all ${
                        mood === m
                          ? 'border-primary bg-primary-light'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="text-xl">{getMoodEmoji(m)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                placeholder="What's on your mind today?"
                rows="4"
                className="w-full mb-4"
              />

              <div className="flex gap-3">
                <button onClick={saveEntry} className="btn-primary py-2 px-4">
                  Save Entry
                </button>
                <button 
                  onClick={() => setShowForm(false)} 
                  className="btn-secondary py-2 px-4"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Entries List */}
          <div className="space-y-4">
            {entries.length > 0 ? (
              entries.map((entry) => (
                <div key={entry.id} className="card p-4 sm:p-5 fade-in">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getMoodEmoji(entry.mood)}</span>
                      <span className="text-text-muted text-xs">{formatDate(entry.date)}</span>
                    </div>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="text-text-light hover:text-error transition-colors p-1"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                  <p className="text-text-main text-sm sm:text-base whitespace-pre-wrap">{entry.text}</p>
                </div>
              ))
            ) : (
              <div className="card p-8 text-center fade-in">
                <div className="text-4xl mb-3">📝</div>
                <h3 className="font-semibold text-text-main mb-1">No entries yet</h3>
                <p className="text-text-muted text-sm">Start journaling to track your mental health journey</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Journal;