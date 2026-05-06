import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import Loader from '../components/Loader';
import { useToast } from '../components/ToastContext';

const Register = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    
    try {
      // Check if user already exists
      const existingUser = localStorage.getItem('neurocare_user');
      if (existingUser) {
        setError('User already registered. Please login.');
        setLoading(false);
        return;
      }

      const userData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('neurocare_user', JSON.stringify(userData));
      showToast("Registration successful!", "success");
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      setError('Registration failed. Please try again.');
      showToast('Registration failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neuro-dark">
        <Loader text="Creating account..." />
      </div>
    );
  }
  
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-neuro-dark p-4"
      style={{
        backgroundImage:
          'radial-gradient(circle at top, rgba(99, 102, 241, 0.16), transparent 22%), radial-gradient(circle at bottom right, rgba(16, 185, 129, 0.16), transparent 18%)',
      }}
    >
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10">
            <span className="text-3xl">🧠</span>
          </div>
          <h1 className="text-4xl font-bold text-neuro-accent neon-text">NeuroCare</h1>
          <p className="text-gray-400 mt-2">AI Mental Health Support</p>
        </div>
        
        {/* Register Form */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-6">Create Account</h2>
          
          {error && (
            <div className="bg-neuro-danger/20 border border-neuro-danger text-neuro-danger p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                required
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                className="w-full"
              />
            </div>
            
            <button
              type="submit"
              className="w-full neon-button text-white py-3"
            >
              Register
            </button>
          </form>
          
          <p className="text-center text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-neuro-accent hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
