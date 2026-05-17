import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import Hospitals from './pages/Hospitals';
import Chat from './pages/Chat';
import Journal from './pages/Journal';
import Sleep from './pages/Sleep';
import Breathing from './pages/Breathing';
import Settings from './pages/Settings';
import Appointments from './pages/Appointments';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/sleep" element={<Sleep />} />
          <Route path="/breathing" element={<Breathing />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/appointments" element={<Appointments />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;