import React from 'react';
import { FiCheck, FiX, FiCrown } from 'react-icons/fi';

function PricingCard({ plan, onSelect, isCurrent }) {
  return (
    <div className={`relative rounded-2xl p-8 border-2 ${plan.popular ? 'border-premium-gold bg-gradient-to-b from-premium-gold/5 to-transparent' : 'border-crystal'} ${isCurrent ? 'ring-2 ring-electric-blue' : ''}`}>
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-premium-gold text-deep-black px-4 py-1 rounded-full text-sm font-bold flex items-center">
            <FiCrown className="mr-2" /> MOST POPULAR
          </div>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrent && (
        <div className="absolute -top-3 right-4">
          <div className="bg-electric-blue text-white px-3 py-1 rounded-full text-xs font-semibold">
            CURRENT PLAN
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
        <div className="mb-4">
          <span className="text-4xl font-bold gradient-text">${plan.price}</span>
          {plan.period && (
            <span className="text-gray-400 ml-2">{plan.period}</span>
          )}
        </div>
        <p className="text-gray-400">
          {plan.name === 'Free' ? 'Perfect for trying out' : 
           plan.name === 'Pro' ? 'For serious shoppers' : 
           'For luxury businesses'}
        </p>
      </div>

      {/* Features */}
      <div className="space-y-4 mb-8">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-center">
            {feature.included ? (
              <FiCheck className="text-success mr-3 flex-shrink-0" />
            ) : (
              <FiX className="text-gray-500 mr-3 flex-shrink-0" />
            )}
            <span className={feature.included ? 'text-white' : 'text-gray-500'}>
              {feature.text}
            </span>
          </div>
        ))}
      </div>

      {/* Button */}
      <button
        onClick={onSelect}
        disabled={plan.disabled || isCurrent}
        className={`w-full py-3 rounded-xl font-semibold transition-all ${plan.disabled || isCurrent
          ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
          : plan.popular
          ? 'bg-gradient-to-r from-premium-gold to-yellow-300 text-deep-black hover:opacity-90'
          : 'bg-gradient-to-r from-royal-purple to-electric-blue text-white hover:opacity-90'
        }`}
      >
        {isCurrent ? 'Current Plan' : plan.buttonText}
      </button>

      {/* Extra Info */}
      {plan.name === 'Free' && (
        <div className="mt-4 text-center text-sm text-gray-500">
          No payment required
        </div>
      )}
      {plan.name === 'Pro' && (
        <div className="mt-4 text-center text-sm text-success">
          🔥 50+ elite shoppers upgraded this month
        </div>
      )}
    </div>
  );
}

export default PricingCard;
