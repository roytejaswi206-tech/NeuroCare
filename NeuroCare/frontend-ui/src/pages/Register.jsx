import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastContext';
import { getCurrentUser, registerUser, isLoggedIn, generateId } from '../utils/storage';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [step, setStep] = useState(1); // 1: Account info, 2: Personal details
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'patient' // 'patient' or 'doctor'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\d\s\-+()]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);

    try {
      const userData = {
        username: formData.username.trim(),
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || null,
        password: formData.password,
        role: formData.role,
        profileImage: null,
        specialization: null,
        hospital: null,
        createdAt: new Date().toISOString(),
        lastLogin: null
      };

      const result = registerUser(userData);

      if (result.success) {
        // Auto-login after registration
        localStorage.setItem('neurocare_current_user', JSON.stringify(result.user));
        showToast('Account created successfully! Welcome to NeuroCare.', 'success');
        navigate('/dashboard', { replace: true });
      } else {
        setErrors({ general: result.error || 'Registration failed. Please try again.' });
        showToast(result.error, 'error');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setErrors({ general: 'An error occurred. Please try again.' });
      showToast('Registration failed. Please try again.', 'error');
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

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              step >= 1 ? 'bg-[#00BFA6] text-white' : 'bg-[#E2E8F0] text-[#64748B]'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-[#00BFA6]' : 'bg-[#E2E8F0]'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              step >= 2 ? 'bg-[#00BFA6] text-white' : 'bg-[#E2E8F0] text-[#64748B]'
            }`}>
              2
            </div>
          </div>
        </div>

        {/* Register Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-[#1E293B] mb-6">
            {step === 1 ? 'Create Your Account' : 'Tell Us About You'}
          </h2>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={step === 1 ? handleNextStep : handleSubmit} className="space-y-5">
            {/* Step 1: Account Information */}
            {step === 1 && (
              <>
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-2">
                    Username *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-[#64748B]" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Choose a username"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#00BFA6] focus:border-transparent outline-none transition-all text-[#1E293B] placeholder-[#94A3B8] ${
                        errors.username ? 'border-red-300' : 'border-[#E2E8F0]'
                      }`}
                    />
                  </div>
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                  )}
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-[#64748B]" />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#00BFA6] focus:border-transparent outline-none transition-all text-[#1E293B] placeholder-[#94A3B8] ${
                        errors.fullName ? 'border-red-300' : 'border-[#E2E8F0]'
                      }`}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-[#64748B]" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#00BFA6] focus:border-transparent outline-none transition-all text-[#1E293B] placeholder-[#94A3B8] ${
                        errors.email ? 'border-red-300' : 'border-[#E2E8F0]'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-2">
                    Password *
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
                      placeholder="Create a password (min 6 characters)"
                      className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-[#00BFA6] focus:border-transparent outline-none transition-all text-[#1E293B] placeholder-[#94A3B8] ${
                        errors.password ? 'border-red-300' : 'border-[#E2E8F0]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-[#64748B]" />
                      ) : (
                        <Eye className="h-5 w-5 text-[#64748B]" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-[#64748B]" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-[#00BFA6] focus:border-transparent outline-none transition-all text-[#1E293B] placeholder-[#94A3B8] ${
                        errors.confirmPassword ? 'border-red-300' : 'border-[#E2E8F0]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-[#64748B]" />
                      ) : (
                        <Eye className="h-5 w-5 text-[#64748B]" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Next Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-[#00BFA6] hover:bg-[#00A891] active:scale-[0.98] transition-all duration-200"
                >
                  Continue
                </button>
              </>
            )}

            {/* Step 2: Additional Details */}
            {step === 2 && (
              <>
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-2">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-[#64748B]" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#00BFA6] focus:border-transparent outline-none transition-all text-[#1E293B] placeholder-[#94A3B8] ${
                        errors.phone ? 'border-red-300' : 'border-[#E2E8F0]'
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-[#1E293B] mb-2">
                    I am a...
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'patient' })}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        formData.role === 'patient'
                          ? 'border-[#00BFA6] bg-[#00BFA6]/10'
                          : 'border-[#E2E8F0] hover:border-[#00BFA6]/50'
                      }`}
                    >
                      <div className="text-2xl mb-2">🧑‍🦰</div>
                      <div className="font-semibold text-[#1E293B]">Patient</div>
                      <div className="text-sm text-[#64748B]">Seeking support</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'doctor' })}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        formData.role === 'doctor'
                          ? 'border-[#00BFA6] bg-[#00BFA6]/10'
                          : 'border-[#E2E8F0] hover:border-[#00BFA6]/50'
                      }`}
                    >
                      <div className="text-2xl mb-2">👨‍⚕️</div>
                      <div className="font-semibold text-[#1E293B]">Doctor</div>
                      <div className="text-sm text-[#64748B]">Providing care</div>
                    </button>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 py-3 px-4 rounded-xl font-semibold text-[#64748B] border-2 border-[#E2E8F0] hover:border-[#00BFA6] hover:text-[#00BFA6] transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 ${
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
                        Creating...
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>
              </>
            )}
          </form>

          {/* Login Link */}
          <p className="text-center text-[#64748B] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#00BFA6] font-semibold hover:underline">
              Sign In
            </Link>
          </p>
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

export default Register;