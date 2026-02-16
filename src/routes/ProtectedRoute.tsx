import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '@/utils/auth-storage';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
