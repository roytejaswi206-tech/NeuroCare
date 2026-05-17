import { useState } from 'react';

const InputField = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  autoComplete,
  icon,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="input-field">
      {label && (
        <label className="block text-sm font-medium text-[var(--text-main)] mb-1.5">
          {label} {required && <span className="text-[var(--error)]">*</span>}
        </label>
      )}
      <div className={`input-group ${error ? 'has-error' : ''}`}>
        {icon && (
          <div className="input-icon">
            {icon}
          </div>
        )}
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={error ? 'error' : ''}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <p className="error-text">{error}</p>}
      
      <style jsx>{`
        .input-field {
          margin-bottom: 16px;
        }
        .input-group {
          position: relative;
        }
        .input-group input {
          ${icon ? 'padding-left: 40px;' : ''}
          ${isPassword ? 'padding-right: 40px;' : ''}
        }
        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-light);
          pointer-events: none;
          display: flex;
          align-items: center;
        }
        .input-group.has-error input {
          border-color: var(--error);
        }
        .input-group.has-error input:focus {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </div>
  );
};

export default InputField;