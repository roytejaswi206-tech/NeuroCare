import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import Loader from '../components/Loader';
import { useToast } from '../components/ToastContext';
import { useTranslation } from '../i18n.jsx';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authAPI.verifyEmail({ email, code });
      showToast('Email verified successfully.', 'success');
      navigate('/login');
    } catch (err) {
      const message = err.response?.data?.error || t('verifyEmail') + ' failed';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError('Please enter your email to resend the code.');
      return;
    }

    setResendLoading(true);
    setResendMessage('');
    setError('');

    try {
      const response = await authAPI.sendVerificationCode({ email });
      setResendMessage(response.data.message || 'Verification code resent.');
      showToast(response.data.message || 'Verification code resent.', 'success');
    } catch (err) {
      const message = err.response?.data?.error || 'Unable to resend verification code.';
      setError(message);
      showToast(message, 'error');
    } finally {
      setResendLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neuro-dark">
        <Loader text={t('loading')} />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-neuro-dark p-4"
      style={{
        backgroundImage:
          'radial-gradient(circle at top, rgba(99, 102, 241, 0.18), transparent 22%), radial-gradient(circle at bottom right, rgba(16, 185, 129, 0.18), transparent 18%)',
      }}
    >
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10">
            <span className="text-3xl">✉️</span>
          </div>
          <h1 className="text-4xl font-bold text-neuro-accent neon-text">{t('verifyEmail')}</h1>
          <p className="text-gray-400 mt-2">{t('verifyNow')}</p>
        </div>

        <div className="glass-card p-8">
          {error && (
            <div className="bg-neuro-danger/20 border border-neuro-danger text-neuro-danger p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {resendMessage && (
            <div className="bg-neuro-success/10 border border-neuro-success text-neuro-success p-3 rounded-lg mb-4">
              {resendMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">{t('email')}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="w-full">
                <label className="block text-sm text-gray-400 mb-2">{t('verificationCode')}</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  required
                  className="w-full"
                />
              </div>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="mt-6 px-4 py-3 rounded-lg bg-white/10 text-sm text-white hover:bg-white/20 transition"
              >
                {resendLoading ? 'Sending...' : 'Resend'}
              </button>
            </div>

            <button type="submit" className="w-full neon-button text-white py-3">
              {t('verifyNow')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
