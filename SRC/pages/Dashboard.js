import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/auth';
import { getProducts } from '../services/products';
import { FiPackage, FiTarget, FiDollarSign, FiCrown } from 'react-icons/fi';

function Dashboard({ addNotification }) {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    productsTracked: 0,
    targetsReached: 0,
    totalSaved: 0,
    membership: 'Free'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const loadDashboardData = async () => {
    try {
      const productsData = await getProducts();
      if (productsData.success) {
        const products = productsData.products || [];
        const saved = products.reduce((sum, p) => sum + (p.current_price || 0) * 0.2, 0);
        const targets = products.filter(p => p.current_price <= p.target_price).length;
        
        setStats({
          productsTracked: products.length,
          targetsReached: targets,
          totalSaved: saved,
          membership: user?.plan || 'Free'
        });
      }
    } catch (error) {
      addNotification('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to Smart AI Price Tracker</h1>
          <p className="text-gray-400 mb-8">Please login to access your dashboard</p>
          <Link to="/login" className="luxury-btn primary">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="dashboard-hero mb-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Luxury Shopping Intelligence
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            AI-powered price tracking for the discerning shopper
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/products" className="luxury-btn secondary">
              <FiPackage className="mr-2" /> Track Products
            </Link>
            <Link to="/alternatives" className="luxury-btn outline">
              <FiTarget className="mr-2" /> Find Alternatives
            </Link>
            {user?.plan === 'free' && (
              <Link to="/payments" className="luxury-btn primary">
                <FiCrown className="mr-2" /> Upgrade Plan
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="stat-card">
          <div className="flex items-center justify-center mb-4">
            <FiPackage className="text-3xl text-premium-gold" />
          </div>
          <h3 className="text-3xl font-bold text-premium-gold mb-2">
            {stats.productsTracked}
          </h3>
          <p className="text-gray-400">Products Tracked</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-center mb-4">
            <FiTarget className="text-3xl text-electric-blue" />
          </div>
          <h3 className="text-3xl font-bold text-premium-gold mb-2">
            {stats.targetsReached}
          </h3>
          <p className="text-gray-400">Targets Reached</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-center mb-4">
            <FiDollarSign className="text-3xl text-success" />
          </div>
          <h3 className="text-3xl font-bold text-premium-gold mb-2">
            ${stats.totalSaved.toFixed(0)}
          </h3>
          <p className="text-gray-400">Total Saved</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-center mb-4">
            <FiCrown className="text-3xl text-royal-purple" />
          </div>
          <h3 className="text-3xl font-bold text-premium-gold mb-2">
            {stats.membership}
          </h3>
          <p className="text-gray-400">Membership Tier</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-8 border border-crystal">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/products" 
            className="p-6 bg-gray-800/50 rounded-xl border border-crystal hover:border-electric-blue transition-all hover:scale-[1.02] group"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-royal-purple/20 rounded-lg mr-4">
                <FiPackage className="text-xl text-royal-purple" />
              </div>
              <h3 className="text-lg font-semibold">Add Product</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Start tracking new luxury items
            </p>
          </Link>

          <Link 
            to="/alternatives" 
            className="p-6 bg-gray-800/50 rounded-xl border border-crystal hover:border-electric-blue transition-all hover:scale-[1.02] group"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-premium-gold/20 rounded-lg mr-4">
                <FiTarget className="text-xl text-premium-gold" />
              </div>
              <h3 className="text-lg font-semibold">Find Alternatives</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Discover better deals with AI
            </p>
          </Link>

          <Link 
            to="/payments" 
            className="p-6 bg-gray-800/50 rounded-xl border border-crystal hover:border-electric-blue transition-all hover:scale-[1.02] group"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-success/20 rounded-lg mr-4">
                <FiCrown className="text-xl text-success" />
              </div>
              <h3 className="text-lg font-semibold">Upgrade Plan</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Unlock premium features
            </p>
          </Link>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="mt-12 text-center">
        <p className="text-gray-400">
          Welcome back, <span className="text-premium-gold font-semibold">{user?.username || user?.email}</span>!
          You're on the <span className="text-premium-gold font-semibold">{user?.plan}</span> plan.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
