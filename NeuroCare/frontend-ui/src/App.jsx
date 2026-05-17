import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import PanicMode from './pages/PanicMode';
import Hospitals from './pages/Hospitals';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Favorites from './pages/Favorites';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';
import Breathing from './pages/Breathing';
import Journal from './pages/Journal';
import Sleep from './pages/Sleep';
import { ToastProvider } from './components/ToastContext';
import { TranslationProvider } from './i18n.jsx';
import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  return (
    <TranslationProvider>
      <ToastProvider>
        <ErrorBoundary>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes - User */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/panic"
                element={
                  <ProtectedRoute>
                    <PanicMode />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hospitals"
                element={
                  <ProtectedRoute>
                    <Hospitals />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctors"
                element={
                  <ProtectedRoute>
                    <Doctors />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments"
                element={
                  <ProtectedRoute>
                    <Appointments />
                  </ProtectedRoute>
                }
              />              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute roles={[ 'super_admin' ]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Wellness Routes */}
              <Route
                path="/breathing"
                element={
                  <ProtectedRoute>
                    <Breathing />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/journal"
                element={
                  <ProtectedRoute>
                    <Journal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sleep"
                element={
                  <ProtectedRoute>
                    <Sleep />
                  </ProtectedRoute>
                }
              />

              {/* Redirects */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </ErrorBoundary>
      </ToastProvider>
    </TranslationProvider>
  );
};

export default App;
