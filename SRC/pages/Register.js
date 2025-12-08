import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth';
import { FiUser, FiMail, FiLock, FiArrowRight, FiStar, FiGift } from 'react-icons/fi';

function Register({ addNotification }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    promoCode: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [validatingPromo, setValidatingPromo] = useState(false);
  const [promoBenefits, setPromoBenefits] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Validate promo code
  const validatePromoCode = async () => {
    if (!formData.promoCode.trim()) {
      addNotification('Please enter a promo code', 'info');
      return;
    }

    setValidatingPromo(true);
    try {
      // Call your backend to validate promo code
      const response = await fetch(`/api/donations/validate-promo/${formData.promoCode}`);
      const data = await response.json();
      
      if (data.valid) {
        setPromoBenefits(data.benefits);
        addNotification(`Promo code valid! Benefits: ${data.benefits.months > 0 ? 
          `${data.benefits.months} month free ${data.benefits.plan} plan` : 
          `${data.benefits.discount}% discount on ${data.benefits.plan} plan`}`, 'success');
      } else {
        setPromoBenefits(null);
        addNotification(data.error || 'Invalid promo code', 'error');
      }
    } catch (error) {
      addNotification('Failed to validate promo code', 'error');
    } finally {
      setValidatingPromo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Call registration API with promo code
    const result = await register(
      formData.username, 
      formData.email, 
      formData.password,
      formData.promoCode || null
    );
    
    if (result.success) {
      addNotification('Welcome to luxury shopping! ' + (result.appliedBenefits ? 
        `Your ${result.appliedBenefits.months > 0 ? 'free month' : 'discount'} has been applied.` : ''), 'success');
      navigate('/dashboard');
    } else {
      addNotification(result.error || 'Registration failed', 'error');
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
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-premium-gold/20 to-yellow-300/20 mb-6">
              <FiStar className="text-3xl text-premium-gold" />
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Join the Elite</h1>
            <p className="text-gray-400">Begin your luxury shopping journey</p>
          </div>

          {/* Promo Code Benefits Display */}
          {promoBenefits && (
            <div className="mb-6 p-4 bg-gradient-to-r from-premium-gold/10 to-yellow-300/10 rounded-xl border border-premium-gold/30">
              <div className="flex items-center mb-2">
                <FiGift className="text-premium-gold mr-2" />
                <h3 className="font-semibold text-premium-gold">Promo Code Applied!</h3>
              </div>
              <p className="text-sm text-gray-300">
                {promoBenefits.months > 0 ? 
                  `You'll receive ${promoBenefits.months} month free ${promoBenefits.plan} plan` :
                  `You'll receive ${promoBenefits.discount}% discount on ${promoBenefits.plan} plan`}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-500" />
                </div>
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-crystal rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all"
                  placeholder="Your display name"
                />
              </div>
            </div>

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
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-crystal rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Minimum 8 characters with letters and numbers
              </p>
            </div>

            {/* Promo Code Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Promo Code (Optional)
                </label>
                <button
                  type="button"
                  onClick={validatePromoCode}
                  disabled={!formData.promoCode.trim() || validatingPromo}
                  className="text-xs text-premium-gold hover:text-yellow-300 transition-colors"
                >
                  {validatingPromo ? 'Validating...' : 'Validate Code'}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiGift className="text-gray-500" />
                </div>
                <input
                  type="text"
                  name="promoCode"
                  value={formData.promoCode}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-crystal rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-premium-gold focus:border-transparent transition-all"
                  placeholder="DONATE-XXXX-XXXXXX"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Enter promo code from your donation to get discounts or free months
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full luxury-btn primary py-4 text-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Create Elite Account <FiArrowRight className="ml-2" />
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-crystal"></div>
            <span className="px-4 text-gray-500 text-sm">Already have an account?</span>
            <div className="flex-1 border-t border-crystal"></div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-premium-gold hover:text-yellow-300 transition-colors"
            >
              Sign in to your account
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900/30 p-4 rounded-xl border border-crystal">
            <h4 className="font-semibold text-premium-gold mb-2">💎 AI Alternatives</h4>
            <p className="text-sm text-gray-400">Smart product suggestions</p>
          </div>
          <div className="bg-gray-900/30 p-4 rounded-xl border border-crystal">
            <h4 className="font-semibold text-premium-gold mb-2">🎯 Price Tracking</h4>
            <p className="text-sm text-gray-400">Automatic price alerts</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
