import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
    else if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Check if user already exists
      const existingUser = localStorage.getItem('neurocare_user');
      if (existingUser) {
        setSubmitError('User already registered. Please login.');
        setIsSubmitting(false);
        return;
      }

      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,  // Save password for demo
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('neurocare_user', JSON.stringify(userData));
      navigate('/dashboard');
    } catch (err) {
      setSubmitError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-[#121A2F] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-[#E6F1FF] mb-8 text-center">
            Join NeuroCare
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {submitError && (
              <div className="bg-[#FF6B6B]/20 border border-[#FF6B6B]/50 text-[#FF6B6B] text-sm p-3 rounded-xl">
                {submitError}
              </div>
            )}

            <div>
              <label className="block text-[#E6F1FF] text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full bg-[#0F172A] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-[#E6F1FF] placeholder-[#8AA0B3] focus:border-[#00C2A8] focus:outline-none transition-colors ${
                  errors.name ? 'border-[#FF6B6B]' : ''
                }`}
                placeholder="Enter your name"
              />
              {errors.name && <p className="text-[#FF6B6B] text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-[#E6F1FF] text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-[#0F172A] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-[#E6F1FF] placeholder-[#8AA0B3] focus:border-[#00C2A8] focus:outline-none transition-colors ${
                  errors.email ? 'border-[#FF6B6B]' : ''
                }`}
                placeholder="your@email.com"
              />
              {errors.email && <p className="text-[#FF6B6B] text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-[#E6F1FF] text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full bg-[#0F172A] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-[#E6F1FF] placeholder-[#8AA0B3] focus:border-[#00C2A8] focus:outline-none transition-colors ${
                  errors.password ? 'border-[#FF6B6B]' : ''
                }`}
                placeholder="At least 6 characters"
              />
              {errors.password && <p className="text-[#FF6B6B] text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-[#E6F1FF] text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full bg-[#0F172A] border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-3 text-[#E6F1FF] placeholder-[#8AA0B3] focus:border-[#00C2A8] focus:outline-none transition-colors ${
                  errors.confirmPassword ? 'border-[#FF6B6B]' : ''
                }`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <p className="text-[#FF6B6B] text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#00C2A8] hover:-translate-y-[2px] text-[#0B1220] font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-[#8AA0B3] text-xs text-center mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-[#00C2A8] hover:text-[#6C63FF] font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Register;

