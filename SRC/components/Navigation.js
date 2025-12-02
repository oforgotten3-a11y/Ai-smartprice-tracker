import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/auth';
import { FiHome, FiPackage, FiTarget, FiMessageSquare, FiCrown, FiUser, FiLogOut } from 'react-icons/fi';

function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FiHome />, show: isAuthenticated },
    { path: '/products', label: 'Products', icon: <FiPackage />, show: isAuthenticated },
    { path: '/alternatives', label: 'AI Alternatives', icon: <FiTarget />, show: isAuthenticated },
    { path: '/chat', label: 'Luxury Chat', icon: <FiMessageSquare />, show: isAuthenticated && user?.chat_access },
    { path: '/payments', label: 'Membership', icon: <FiCrown />, show: isAuthenticated },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-lg border-b border-crystal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-royal-purple to-electric-blue rounded-lg">
              <span className="text-white text-xl">💎</span>
            </div>
            <span className="text-xl font-bold gradient-text">
              SmartAI Tracker
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.filter(item => item.show).map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  location.pathname === item.path
                    ? 'bg-royal-purple/20 text-royal-purple border border-royal-purple/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="hidden md:flex items-center space-x-3 bg-gray-900/50 px-4 py-2 rounded-lg">
                  <div className="p-1.5 bg-premium-gold/20 rounded-full">
                    <FiUser className="text-premium-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user?.username || user?.email?.split('@')[0]}</p>
                    <p className="text-xs text-gray-400 capitalize">{user?.plan} Plan</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white transition-all"
                >
                  <FiLogOut />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg border border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-royal-purple to-electric-blue text-white hover:opacity-90 transition-all"
                >
                  Join Elite
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-crystal">
        <div className="flex justify-around items-center h-16">
          {navItems.filter(item => item.show).map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center p-2 ${
                location.pathname === item.path
                  ? 'text-royal-purple'
                  : 'text-gray-400'
              }`}
            >
              <div className="text-xl">{item.icon}</div>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
