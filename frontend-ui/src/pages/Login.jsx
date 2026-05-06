import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Auto-redirect if already logged in
  useEffect(() => {
    const loggedIn = localStorage.getItem('neurocare_logged_in');
    if (loggedIn) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password.trim()) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const userStr = localStorage.getItem('neurocare_user');
      if (!userStr) {
        setSubmitError('No account found. Please register first.');
        setIsSubmitting(false);
        return;
      }

      const user = JSON.parse(userStr);
      if (user.email !== formData.email.trim()) {
        setSubmitError('No account found with this email.');
        setIsSubmitting(false);
        return;
      }

      // Check password
      if (user.password !== formData.password) {
        setSubmitError('Invalid password.');
        setIsSubmitting(false);
        return;
      }

      localStorage.setItem('neurocare_logged_in', 'true');
      navigate('/dashboard');
    } catch (err) {
      setSubmitError('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-[#121A2F] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-[#E6F1FF] mb-8 text-center">
            Welcome Back
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {submitError && (
              <div className="bg-[#FF6B6B]/20 border border-[#FF6B6B]/50 text-[#FF6B6B] text-sm p-3 rounded-xl">
                {submitError}
              </div>
            )}

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
                placeholder="Enter your password"
              />
              {errors.password && <p className="text-[#FF6B6B] text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#00C2A8] hover:-translate-y-[2px] text-[#0B1220] font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-[#8AA0B3] text-xs text-center mt-6">
            No account?{' '}
            <Link to="/register" className="text-[#00C2A8] hover:text-[#6C63FF] font-medium">
              Create one
            </Link>
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

export default Login;

