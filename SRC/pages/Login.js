import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth';
import { FiLock, FiMail, FiArrowRight } from 'react-icons/fi';

function Login({ addNotification }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      addNotification('Welcome back!', 'success');
      navigate('/dashboard');
    } else {
      addNotification(result.error || 'Login failed', 'error');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Luxury Glass Card */}
        <div className="glass-effect rounded-3xl p-8 md:p-12 border border-crystal shadow-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-royal-purple/20 to-electric-blue/20 mb-6">
              <FiLock className="text-3xl text-premium-gold" />
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
            <p className="text-gray-400">Access your luxury shopping intelligence</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-crystal rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-crystal rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full luxury-btn primary py-4 text-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Sign In <FiArrowRight className="ml-2" />
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-crystal"></div>
            <span className="px-4 text-gray-500 text-sm">New to luxury?</span>
            <div className="flex-1 border-t border-crystal"></div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <Link
              to="/register"
              className="inline-flex items-center text-premium-gold hover:text-yellow-300 transition-colors"
            >
              Create an Elite Account
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Demo: test@example.com / password123
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
