import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentUser } from '../utils/storage';
import { useToast } from '../components/ToastContext';
import {
  BookOpen, Pen, Calendar, Search, Trash2, Edit3, Save,
  ChevronLeft, Heart, Sun, Cloud, Moon, Frown, Meh, Smile,
  Plus, X, BarChart3, TrendingUp
} from 'lucide-react';

const moodOptions = [
  { id: 'happy', emoji: '😊', label: 'Happy', color: 'bg-green-500' },
  { id: 'calm', emoji: '😌', label: 'Calm', color: 'bg-blue-500' },
  { id: 'neutral', emoji: '😐', label: 'Neutral', color: 'bg-gray-500' },
  { id: 'sad', emoji: '😢', label: 'Sad', color: 'bg-purple-500' },
  { id: 'anxious', emoji: '😰', label: 'Anxious', color: 'bg-orange-500' },
  { id: 'stressed', emoji: '😣', label: 'Stressed', color: 'bg-red-500' }
];

const Journal = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: null
  });
  const [selectedMoodFilter, setSelectedMoodFilter] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login', { replace: true });
      return;
    }
    setUser(currentUser);
    loadEntries();
  }, [navigate]);

  useEffect(() => {
    let filtered = [...entries];

    if (searchQuery) {
      filtered = filtered.filter(
        entry =>
          entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedMoodFilter) {
      filtered = filtered.filter(entry => entry.mood?.id === selectedMoodFilter);
    }

    setFilteredEntries(filtered);
  }, [entries, searchQuery, selectedMoodFilter]);

  const loadEntries = () => {
    const saved = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    setEntries(saved.reverse());
  };

  const saveEntry = () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) {
      showToast('Please add a title and content', 'warning');
      return;
    }

    const entry = {
      id: editingId || Date.now(),
      title: newEntry.title,
      content: newEntry.content,
      mood: newEntry.mood,
      createdAt: editingId
        ? entries.find(e => e.id === editingId)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let updatedEntries;
    if (editingId) {
      updatedEntries = entries.map(e => (e.id === editingId ? entry : e));
      showToast('Entry updated successfully', 'success');
    } else {
      updatedEntries = [entry, ...entries];
      showToast('Entry saved successfully', 'success');
    }

    setEntries(updatedEntries);
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    resetForm();
  };

  const deleteEntry = (id) => {
    const updatedEntries = entries.filter(e => e.id !== id);
    setEntries(updatedEntries);
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    setShowDeleteConfirm(null);
    showToast('Entry deleted', 'success');
  };

  const editEntry = (entry) => {
    setNewEntry({
      title: entry.title,
      content: entry.content,
      mood: entry.mood
    });
    setEditingId(entry.id);
    setIsWriting(true);
  };

  const resetForm = () => {
    setNewEntry({ title: '', content: '', mood: null });
    setEditingId(null);
    setIsWriting(false);
  };

  const getMoodStats = () => {
    const stats = {};
    entries.forEach(entry => {
      if (entry.mood) {
        stats[entry.mood.id] = (stats[entry.mood.id] || 0) + 1;
      }
    });
    return stats;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7FB]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00BFA6] mx-auto mb-4"></div>
          <p className="text-[#64748B]">Loading...</p>
        </div>
      </div>
    );
  }

  const moodStats = getMoodStats();
  const totalEntries = entries.length;
  const streakDays = calculateStreak(entries);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-green-900/20">
      {/* Header */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-white hover:text-white/80 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="font-semibold">Back</span>
            </button>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-white" />
              <span className="text-xl font-bold text-white">Mood Journal</span>
            </div>
            <button
              onClick={() => setIsWriting(!isWriting)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
            >
              <Pen className="h-4 w-4" />
              <span>{isWriting ? 'Cancel' : 'Write'}</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalEntries}</p>
                <p className="text-sm text-white/60">Total Entries</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{streakDays}</p>
                <p className="text-sm text-white/60">Day Streak</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Smile className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{moodStats.happy || 0}</p>
                <p className="text-sm text-white/60">Happy Days</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <BarChart3 className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {totalEntries > 0 ? Math.round((moodStats.happy || 0) / totalEntries * 100) : 0}%
                </p>
                <p className="text-sm text-white/60">Positive Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mood Distribution */}
        {Object.keys(moodStats).length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8">
            <h3 className="text-white font-semibold mb-4">Mood Distribution</h3>
            <div className="flex flex-wrap gap-3">
              {moodOptions.map(mood => (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMoodFilter(selectedMoodFilter === mood.id ? null : mood.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                    selectedMoodFilter === mood.id
                      ? 'bg-white/20 ring-2 ring-white/50'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <span className="text-xl">{mood.emoji}</span>
                  <span className="text-white text-sm">{mood.label}</span>
                  <span className="text-white/60 text-sm">({moodStats[mood.id] || 0})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search entries..."
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-white/30 focus:border-transparent outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Write/Edit Panel */}
          <AnimatePresence>
            {isWriting && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="md:col-span-1"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 sticky top-24">
                  <h3 className="text-white font-semibold mb-4">
                    {editingId ? 'Edit Entry' : 'New Entry'}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-white/60 mb-2">Title</label>
                      <input
                        type="text"
                        value={newEntry.title}
                        onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                        placeholder="What's on your mind?"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-white/30 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-white/60 mb-2">How are you feeling?</label>
                      <div className="grid grid-cols-3 gap-2">
                        {moodOptions.map(mood => (
                          <button
                            key={mood.id}
                            onClick={() => setNewEntry({ ...newEntry, mood })}
                            className={`p-3 rounded-xl transition-all ${
                              newEntry.mood?.id === mood.id
                                ? `${mood.color} ring-2 ring-white/50`
                                : 'bg-white/5 hover:bg-white/10'
                            }`}
                          >
                            <div className="text-2xl mb-1">{mood.emoji}</div>
                            <div className="text-xs text-white">{mood.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-white/60 mb-2">Write your thoughts...</label>
                      <textarea
                        value={newEntry.content}
                        onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                        placeholder="Dear journal..."
                        rows={6}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-white/30 outline-none resize-none"
                      />
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={saveEntry}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                      >
                        <Save className="h-4 w-4" />
                        <span>{editingId ? 'Update' : 'Save'}</span>
                      </button>
                      <button
                        onClick={resetForm}
                        className="px-4 py-3 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Entries List */}
          <div className={isWriting ? 'md:col-span-2' : 'md:col-span-3'}>
            {filteredEntries.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-12 text-center">
                <BookOpen className="h-16 w-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No entries yet</h3>
                <p className="text-white/60 mb-6">
                  {searchQuery || selectedMoodFilter
                    ? 'No entries match your search'
                    : 'Start writing your thoughts and feelings'}
                </p>
                {!searchQuery && !selectedMoodFilter && (
                  <button
                    onClick={() => setIsWriting(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
                  >
                    Write your first entry
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEntries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/15 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {entry.mood && (
                          <span className="text-2xl" title={entry.mood.label}>
                            {entry.mood.emoji}
                          </span>
                        )}
                        <div>
                          <h3 className="text-lg font-semibold text-white">{entry.title}</h3>
                          <p className="text-sm text-white/60 flex items-center space-x-2">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(entry.createdAt)}</span>
                            {entry.updatedAt !== entry.createdAt && (
                              <span className="text-white/40">(edited)</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => editEntry(entry)}
                          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(entry.id)}
                          className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-white/80 whitespace-pre-wrap">{entry.content}</p>

                    {/* Delete confirmation */}
                    {showDeleteConfirm === entry.id && (
                      <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-white/80 mb-3">Are you sure you want to delete this entry?</p>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => deleteEntry(entry.id)}
                            className="px-4 py-2 bg-red-500 rounded-lg text-white text-sm hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="px-4 py-2 bg-white/10 rounded-lg text-white text-sm hover:bg-white/20 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mental Health Resources */}
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <Heart className="h-5 w-5 mr-2" />
            Mental Health Resources
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 rounded-xl">
              <h4 className="text-white font-semibold mb-2">Understanding Anxiety</h4>
              <p className="text-white/60 text-sm mb-3">
                Anxiety is a natural response to stress. It's important to recognize triggers and develop coping strategies.
              </p>
              <a href="#" className="text-blue-400 text-sm hover:underline">Learn more →</a>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <h4 className="text-white font-semibold mb-2">Managing Depression</h4>
              <p className="text-white/60 text-sm mb-3">
                Small steps can make a big difference. Regular exercise, social connection, and professional help can be beneficial.
              </p>
              <a href="#" className="text-blue-400 text-sm hover:underline">Learn more →</a>
            </div>
            <div className="p-4 bg-white/5 rounded-xl">
              <h4 className="text-white font-semibold mb-2">Stress Management</h4>
              <p className="text-white/60 text-sm mb-3">
                Effective stress management includes mindfulness, time management, and setting healthy boundaries.
              </p>
              <a href="#" className="text-blue-400 text-sm hover:underline">Learn more →</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const calculateStreak = (entries) => {
  if (entries.length === 0) return 0;

  const sortedEntries = [...entries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  let streak = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let currentDate = new Date(sortedEntries[0].createdAt);
  currentDate.setHours(0, 0, 0, 0);

  // Check if the most recent entry is from today or yesterday
  const diffDays = Math.floor((today - currentDate) / (1000 * 60 * 60 * 24));
  if (diffDays > 1) return 0;

  for (let i = 1; i < sortedEntries.length; i++) {
    const prevDate = new Date(sortedEntries[i].createdAt);
    prevDate.setHours(0, 0, 0, 0);
    const dayDiff = Math.floor((currentDate - prevDate) / (1000 * 60 * 60 * 24));

    if (dayDiff <= 1) {
      streak++;
      currentDate = prevDate;
    } else {
      break;
    }
  }

  return streak;
};

export default Journal;