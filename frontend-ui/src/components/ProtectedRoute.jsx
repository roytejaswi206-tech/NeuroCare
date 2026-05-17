import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { isLoggedIn } from '../utils/storage';

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    // Small delay to ensure localStorage is ready
    const checkAuth = () => {
      if (!isLoggedIn()) {
        navigate('/login', { replace: true });
      } else {
        setIsAuthorized(true);
      }
    };

    checkAuth();
  }, [navigate]);

  // Show loading state while checking auth
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="loader loader-lg mx-auto mb-4"></div>
          <p className="text-[var(--text-muted)] text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;