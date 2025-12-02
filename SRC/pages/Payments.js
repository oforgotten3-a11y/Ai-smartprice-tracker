import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/auth';
import PricingCard from '../components/PricingCard';
import PaymentModal from '../components/PaymentModal';
import { FiCheck, FiX, FiCrown, FiCreditCard, FiBitcoin, FiSmartphone } from 'react-icons/fi';

function Payments({ addNotification }) {
  const { user, isAuthenticated } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      features: [
        { text: 'Track 3 Products', included: true },
        { text: 'Basic Price Alerts', included: true },
        { text: 'Luxury Chat Access', included: false },
        { text: 'AI Alternatives', included: false },
        { text: 'Priority Support', included: false },
        { text: 'Advanced Analytics', included: false }
      ],
      buttonText: 'Current Plan',
      disabled: true,
      current: user?.plan === 'free'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 7.99,
      period: '/month',
      popular: true,
      features: [
        { text: 'Track 50 Products', included: true },
        { text: 'Smart Price Alerts', included: true },
        { text: 'Luxury Chat Access', included: true },
        { text: 'AI Alternatives', included: true },
        { text: 'Priority Support', included: false },
        { text: 'Advanced Analytics', included: false }
      ],
      buttonText: 'Upgrade to Pro',
      current: user?.plan === 'pro'
    },
    {
      id: 'business',
      name: 'Business',
      price: 29.99,
      period: '/month',
      features: [
        { text: 'Track 200 Products', included: true },
        { text: 'Instant Price Alerts', included: true },
        { text: 'Luxury Chat Access', included: true },
        { text: 'AI Alternatives', included: true },
        { text: 'Priority Support', included: true },
        { text: 'Advanced Analytics', included: true }
      ],
      buttonText: 'Go Business',
      current: user?.plan === 'business'
    }
  ];

  const paymentMethods = [
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      icon: <FiBitcoin />,
      description: 'Cryptocurrency payment',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      id: 'opay',
      name: 'OPay',
      icon: <FiSmartphone />,
      description: 'Mobile money transfer',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    }
  ];

  const handlePlanSelect = (planId) => {
    if (planId === user?.plan) {
      addNotification(`You're already on the ${planId} plan`, 'info');
      return;
    }
    
    setSelectedPlan(planId);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setSelectedPlan(null);
    addNotification('Payment successful! Your account has been upgraded.', 'success');
    // In real app, refresh user data
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Elite Membership</h1>
          <p className="text-gray-400 mb-8">Please login to view plans</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-premium-gold/20 to-yellow-300/20 mb-6">
          <FiCrown className="text-3xl text-premium-gold" />
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-4">Elite Membership</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Upgrade your shopping experience with premium features designed for luxury shoppers
        </p>
        
        {/* Current Plan Badge */}
        <div className="inline-flex items-center mt-6 px-6 py-3 bg-gray-900/50 rounded-full border border-crystal">
          <span className="text-gray-400 mr-2">Current plan:</span>
          <span className="font-semibold text-premium-gold capitalize">{user?.plan}</span>
          {user?.subscription_end && (
            <span className="ml-4 text-sm text-gray-500">
              Renews: {new Date(user.subscription_end).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {plans.map(plan => (
          <PricingCard
            key={plan.id}
            plan={plan}
            onSelect={() => handlePlanSelect(plan.id)}
            isCurrent={plan.current}
          />
        ))}
      </div>

      {/* Payment Methods */}
      <div className="glass-effect rounded-2xl p-8 border border-crystal mb-12">
        <h2 className="text-2xl font-bold mb-6">Accepted Payment Methods</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paymentMethods.map(method => (
            <div
              key={method.id}
              className="p-6 rounded-xl border border-crystal hover:border-gray-500 transition-colors"
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg ${method.bgColor} mr-4`}>
                  <div className={`text-2xl ${method.color}`}>{method.icon}</div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{method.name}</h3>
                  <p className="text-gray-400 text-sm">{method.description}</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-gray-300">
                  <FiCheck className="text-success mr-2" />
                  Secure payment processing
                </li>
                <li className="flex items-center text-gray-300">
                  <FiCheck className="text-success mr-2" />
                  Instant activation
                </li>
                <li className="flex items-center text-gray-300">
                  <FiCheck className="text-success mr-2" />
                  Automatic renewal
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              q: "How do Bitcoin payments work?",
              a: "We generate a unique Bitcoin address for each payment. Send the exact amount to receive instant activation."
            },
            {
              q: "What about OPay payments?",
              a: "Send payment to our OPay number with the provided reference, then upload proof for manual verification."
            },
            {
              q: "Can I cancel anytime?",
              a: "Yes, all paid plans can be canceled anytime. You'll keep access until the end of your billing period."
            },
            {
              q: "Is there a free trial?",
              a: "The Free plan is always available. Paid plans start immediately upon payment confirmation."
            }
          ].map((faq, index) => (
            <div key={index} className="p-6 bg-gray-900/30 rounded-xl border border-crystal">
              <h3 className="font-semibold mb-2 text-premium-gold">{faq.q}</h3>
              <p className="text-gray-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        plan={selectedPlan}
        paymentMethods={paymentMethods}
        onPaymentSuccess={handlePaymentSuccess}
        addNotification={addNotification}
      />
    </div>
  );
}

export default Payments;
