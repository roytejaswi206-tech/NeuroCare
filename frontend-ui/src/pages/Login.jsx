import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { loginUser, isLoggedIn, initializeSampleData } from '../utils/storage';
import InputField from '../components/InputField';

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    initializeSampleData();
    
    if (isLoggedIn()) {
      navigate('/dashboard');
    }

    if (location.state?.registered) {
      setSuccessMessage('Account created successfully! Please sign in.');
      window.history.replaceState({}, document.title);
    }
  }, [navigate, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setSubmitError('');
    setSuccessMessage('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.identifier.trim()) newErrors.identifier = 'Email or phone is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSuccessMessage('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = loginUser(formData.identifier.trim(), formData.password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setSubmitError(result.error);
      }
    } catch (err) {
      setSubmitError('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-bg-primary">
        <div className="w-full max-w-md fade-in">
          {/* Logo */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-primary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <span className="text-2xl font-bold text-text-main">NeuroCare</span>
            </div>
          </div>

          {/* Form Card */}
          <div className="card p-6 sm:p-8">
            <h1 className="text-xl sm:text-2xl font-bold text-text-main mb-2 text-center">
              Welcome back
            </h1>
            <p className="text-text-muted text-sm text-center mb-6">
              Sign in to continue your mental health journey
            </p>

            <form onSubmit={handleSubmit}>
              {submitError && (
                <div className="bg-error-light border border-error/20 text-error text-sm p-3 rounded-lg mb-4 fade-in">
                  {submitError}
                </div>
              )}

              {successMessage && (
                <div className="bg-success-light border border-success/20 text-success text-sm p-3 rounded-lg mb-4 fade-in">
                  {successMessage}
                </div>
              )}

              <InputField
                label="Email or Phone"
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="Enter your email or phone"
                error={errors.identifier}
                required
                autoComplete="username"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                }
              />

              <InputField
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                error={errors.password}
                required
                autoComplete="current-password"
              />

              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-text-muted">Remember me</span>
                </label>
                <a href="#" className="text-sm text-primary hover:text-primary-dark font-medium">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-3 text-base font-semibold"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="loader" style={{ width: '18px', height: '18px' }}></div>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-text-muted text-sm text-center">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:text-primary-dark font-medium">
                  Create one
                </Link>
              </p>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-6 text-center">
            <p className="text-text-light text-xs">
              Trusted by 10,000+ users worldwide
            </p>
            <div className="flex items-center justify-center gap-4 mt-3">
              <div className="flex items-center gap-1 text-text-light text-xs">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Secure
              </div>
              <div className="flex items-center gap-1 text-text-light text-xs">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                Private
              </div>
              <div className="flex items-center gap-1 text-text-light text-xs">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                24/7 Support
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Image (Desktop only) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&h=800&fit=crop" 
          alt="Mental health care"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/85 to-accent/85 mix-blend-multiply" />
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Your Mental Health Matters</h2>
          <p className="text-lg text-white/90 max-w-md mb-8">
            Join thousands of users who are taking control of their mental wellbeing with NeuroCare.
          </p>
          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-sm text-white/80 mt-1">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm text-white/80 mt-1">Expert Doctors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm text-white/80 mt-1">AI Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;