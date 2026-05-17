import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastContext';
import { getCurrentUser, loginUser, isLoggedIn } from '../utils/storage';
import { Mail, Lock, User, Phone } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    identifier: '', // Can be username, email, or phone
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.identifier.trim()) {
      setError('Please enter your email, phone, or username');
      setLoading(false);
      return;
    }

    if (!formData.password) {
      setError('Please enter your password');
      setLoading(false);
      return;
    }

    try {
      const result = loginUser(formData.identifier, formData.password);

      if (result.success) {
        showToast(`Welcome back, ${result.user.fullName || result.user.username}!`, 'success');
        navigate('/dashboard', { replace: true });
      } else {
        setError(result.error || 'Invalid credentials. Please try again.');
        showToast('Login failed', 'error');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
      showToast('Login failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7FB] p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
            <span className="text-3xl">🧠</span>
          </div>
          <h1 className="text-3xl font-bold text-[#1E293B]">NeuroCare</h1>
          <p className="text-[#64748B] mt-2">AI Mental Health Support</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-[#1E293B] mb-6">Welcome Back</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Identifier Input */}
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-2">
                Email, Phone, or Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-[#64748B]" />
                </div>
                <input
                  type="text"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  placeholder="Enter your email, phone, or username"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#00BFA6] focus:border-transparent outline-none transition-all text-[#1E293B] placeholder-[#94A3B8]"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#64748B]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-12 py-3 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#00BFA6] focus:border-transparent outline-none transition-all text-[#1E293B] placeholder-[#94A3B8]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <span className="text-[#64748B] text-sm">
                    {showPassword ? 'Hide' : 'Show'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 ${
                loading
                  ? 'bg-[#00BFA6] opacity-70 cursor-not-allowed'
                  : 'bg-[#00BFA6] hover:bg-[#00A891] active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E2E8F0]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-[#64748B]">Don't have an account?</span>
            </div>
          </div>

          {/* Register Link */}
          <Link
            to="/register"
            className="block w-full py-3 px-4 rounded-xl font-semibold text-[#00BFA6] border-2 border-[#00BFA6] text-center hover:bg-[#00BFA6] hover:text-white transition-all duration-200 active:scale-[0.98]"
          >
            Create Account
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-[#94A3B8] text-sm mt-6">
          By continuing, you agree to our{' '}
          <a href="#" className="text-[#00BFA6] hover:underline">Terms of Service</a>{' '}
          and{' '}
          <a href="#" className="text-[#00BFA6] hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default Login;