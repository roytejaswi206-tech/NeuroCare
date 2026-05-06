import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { adminAPI } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const [statsRes, usersRes, hospitalsRes, doctorsRes, alertsRes] = await Promise.all([
          adminAPI.getStats(),
          adminAPI.getUsers(),
          adminAPI.getHospitals(),
          adminAPI.getDoctors(),
          adminAPI.getPanicAlerts(),
        ]);

        setStats(statsRes.data || {});
        setUsers(usersRes.data.users || usersRes.data || []);
        setHospitals(hospitalsRes.data.hospitals || hospitalsRes.data || []);
        setDoctors(doctorsRes.data.doctors || doctorsRes.data || []);
        setAlerts(alertsRes.data.alerts || alertsRes.data || []);
      } catch (err) {
        console.error('Admin data fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  return (
    <div className="min-h-screen bg-neuro-dark pb-20 md:pb-4">
      <Navbar />
      <div className="max-w-6xl mx-auto p-4 pt-20 md:pt-4">
        <div className="glass-card p-6 mb-6">
          <h1 className="text-3xl font-bold neon-text">Super Admin Control Panel</h1>
          <p className="text-gray-400 mt-2">Manage users, hospitals, doctors, and emergency operations from one central console.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-4 mb-6">
          <div className="glass-card p-6">
            <p className="text-sm text-gray-400">Total Users</p>
            <p className="text-4xl font-semibold mt-3">{stats?.total_users ?? users.length}</p>
          </div>
          <div className="glass-card p-6">
            <p className="text-sm text-gray-400">Hospitals</p>
            <p className="text-4xl font-semibold mt-3">{stats?.total_hospitals ?? hospitals.length}</p>
          </div>
          <div className="glass-card p-6">
            <p className="text-sm text-gray-400">Doctors</p>
            <p className="text-4xl font-semibold mt-3">{stats?.total_doctors ?? doctors.length}</p>
          </div>
          <div className="glass-card p-6">
            <p className="text-sm text-gray-400">Panic Alerts</p>
            <p className="text-4xl font-semibold mt-3">{stats?.total_alerts ?? alerts.length}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 mb-6">
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Panic Alerts</h2>
            {loading ? (
              <p className="text-gray-400">Loading alerts...</p>
            ) : alerts.length === 0 ? (
              <p className="text-gray-400">No panic alerts recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {alerts.slice(0, 5).map((alert) => (
                  <div key={alert.id} className="rounded-3xl border border-white/10 p-4">
                    <p className="text-sm text-gray-400">{new Date(alert.created_at).toLocaleString()}</p>
                    <p className="font-semibold">{alert.location_description || 'Unknown location'}</p>
                    <p className="text-sm text-gray-300">Severity: {alert.severity}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Active Doctors</h2>
            {loading ? (
              <p className="text-gray-400">Loading doctors...</p>
            ) : doctors.length === 0 ? (
              <p className="text-gray-400">No doctor records available.</p>
            ) : (
              <ul className="space-y-3">
                {doctors.slice(0, 6).map((doctor) => (
                  <li key={doctor.id} className="rounded-3xl border border-white/10 p-4">
                    <p className="font-semibold">Dr. {doctor.name}</p>
                    <p className="text-sm text-gray-400">{doctor.specialization || 'Mental Health'}</p>
                    <p className="text-sm text-gray-300">{doctor.hospital?.name || 'Partner Hospital'}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4">Top Users</h2>
          {loading ? (
            <p className="text-gray-400">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="text-gray-400">No user accounts were found.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {users.slice(0, 6).map((user) => (
                <div key={user.id} className="rounded-3xl border border-white/10 p-4">
                  <p className="font-semibold">{user.username || user.email}</p>
                  <p className="text-sm text-gray-400">{user.role || 'user'}</p>
                  <p className="text-sm text-gray-300">{user.is_active ? 'Active' : 'Inactive'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
