import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0F' }}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: '#D4A853' }} />
          <p style={{ color: '#F5F0E6' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/user/dashboard" replace />;
  }

  if (user.role === 'admin') {
    const currentPath = location.pathname;
    
    if (!adminOnly) {
      if (currentPath.startsWith('/user/dashboard') || 
          currentPath === '/user' ||
          currentPath.startsWith('/user/')) {
        return <Navigate to="/admin/dashboard" replace />;
      }
    }
  }

  return children;
};

export default ProtectedRoute;
