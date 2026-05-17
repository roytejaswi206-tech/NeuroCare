import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getCurrentUser, logoutUser } from '../utils/storage';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    reminders: true,
    newsletter: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'user' },
    { id: 'notifications', label: 'Notifications', icon: 'bell' },
    { id: 'privacy', label: 'Privacy', icon: 'lock' },
    { id: 'account', label: 'Account', icon: 'settings' }
  ];

  const renderIcon = (type, className = "w-5 h-5") => {
    const icons = {
      user: (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
      bell: (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      ),
      lock: (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      ),
      settings: (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      )
    };
    return icons[type] || null;
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="pt-4 lg:pt-8 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-main mb-2">Settings</h1>
            <p className="text-text-muted text-sm">Manage your account and preferences</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Tabs - Desktop Sidebar */}
            <div className="hidden lg:block w-48 flex-shrink-0">
              <nav className="space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary-light text-primary'
                        : 'text-text-muted hover:bg-bg-hover hover:text-text-main'
                    }`}
                  >
                    {renderIcon(tab.icon, "w-4 h-4")}
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Mobile Tabs */}
            <div className="lg:hidden">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary text-white'
                        : 'bg-bg-input text-text-muted hover:bg-border'
                    }`}
                  >
                    {renderIcon(tab.icon, "w-4 h-4")}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              {activeTab === 'profile' && (
                <div className="card p-4 sm:p-6 fade-in">
                  <h2 className="text-lg font-semibold text-text-main mb-4">Profile Information</h2>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-2xl sm:text-3xl text-white font-bold">
                        {user.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-main">{user.fullName}</h3>
                      <p className="text-text-muted text-sm capitalize">{user.role}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-text-muted text-sm mb-1.5">Full Name</label>
                      <input type="text" value={user.fullName} disabled className="bg-bg-input" />
                    </div>
                    <div>
                      <label className="block text-text-muted text-sm mb-1.5">Email</label>
                      <input type="email" value={user.email} disabled className="bg-bg-input" />
                    </div>
                    <div>
                      <label className="block text-text-muted text-sm mb-1.5">Role</label>
                      <input type="text" value={user.role} disabled className="bg-bg-input capitalize" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="card p-4 sm:p-6 fade-in">
                  <h2 className="text-lg font-semibold text-text-main mb-4">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    {[
                      { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                      { key: 'push', label: 'Push Notifications', desc: 'Receive push notifications on your device' },
                      { key: 'reminders', label: 'Session Reminders', desc: 'Get reminded about your scheduled sessions' },
                      { key: 'newsletter', label: 'Newsletter', desc: 'Receive our weekly mental health newsletter' }
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                        <div>
                          <p className="font-medium text-text-main">{item.label}</p>
                          <p className="text-text-muted text-sm">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            notifications[item.key] ? 'bg-primary' : 'bg-border'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                            notifications[item.key] ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="card p-4 sm:p-6 fade-in">
                  <h2 className="text-lg font-semibold text-text-main mb-4">Privacy Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-bg-input rounded-xl">
                      <h3 className="font-medium text-text-main mb-2">Data Privacy</h3>
                      <p className="text-text-muted text-sm">Your data is encrypted and stored securely. We never share your personal information with third parties.</p>
                    </div>
                    
                    <div className="p-4 bg-bg-input rounded-xl">
                      <h3 className="font-medium text-text-main mb-2">Session History</h3>
                      <p className="text-text-muted text-sm mb-3">Your session history is stored locally on your device for your privacy.</p>
                      <button className="btn-secondary py-2 px-4 text-sm">
                        Clear Local Data
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'account' && (
                <div className="card p-4 sm:p-6 fade-in">
                  <h2 className="text-lg font-semibold text-text-main mb-4">Account Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-bg-input rounded-xl">
                      <h3 className="font-medium text-text-main mb-2">Change Password</h3>
                      <p className="text-text-muted text-sm mb-3">Update your password regularly for better security.</p>
                      <button className="btn-secondary py-2 px-4 text-sm">
                        Change Password
                      </button>
                    </div>

                    <div className="p-4 bg-error-light rounded-xl border border-error/20">
                      <h3 className="font-medium text-error mb-2">Danger Zone</h3>
                      <p className="text-text-muted text-sm mb-3">Permanently delete your account and all associated data.</p>
                      <button className="btn-danger py-2 px-4 text-sm">
                        Delete Account
                      </button>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <button
                        onClick={handleLogout}
                        className="w-full btn-secondary py-3 text-error border-error hover:bg-error-light"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;