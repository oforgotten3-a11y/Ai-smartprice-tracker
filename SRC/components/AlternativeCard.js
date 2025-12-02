import React, { useState } from 'react';
import { FiExternalLink, FiGift, FiDollarSign, FiShoppingBag } from 'react-icons/fi';
import { createTip } from '../services/payments';

function AlternativeCard({ alternative, originalPrice, addNotification }) {
  const [tipping, setTipping] = useState(false);

  const savingsAmount = originalPrice - alternative.price;
  const savingsPercent = (savingsAmount / originalPrice) * 100;
  const isBigSavings = savingsPercent >= 30;

  const handleTip = async () => {
    const amount = prompt('Enter tip amount (minimum $1):', '5');
    if (!amount || parseFloat(amount) < 1) {
      addNotification('Minimum tip is $1', 'error');
      return;
    }

    setTipping(true);
    try {
      const result = await createTip(alternative.id, parseFloat(amount));
      if (result.success) {
        addNotification(
          `Tip created! Send ${result.amount} BTC to: ${result.crypto_address}`,
          'success'
        );
      } else {
        addNotification(result.error, 'error');
      }
    } catch (error) {
      addNotification('Failed to create tip', 'error');
    } finally {
      setTipping(false);
    }
  };

  return (
    <div className={`bg-gradient-to-br from-gray-900/30 to-black/30 rounded-2xl p-6 border-2 ${alternative.tip_eligible ? 'border-premium-gold' : 'border-crystal'} hover:scale-[1.02] transition-all duration-300`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1 truncate" title={alternative.name}>
            {alternative.name}
          </h3>
          <div className="flex items-center text-sm text-gray-400">
            <FiShoppingBag className="mr-2" />
            <span>{alternative.store}</span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-premium-gold">
            ${alternative.price.toFixed(2)}
          </div>
          <div className="text-sm text-gray-400">Price</div>
        </div>
      </div>

      {/* Savings */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <FiDollarSign className="text-success mr-2" />
            <span className="text-gray-300">You Save</span>
          </div>
          <div className={`font-bold ${isBigSavings ? 'text-success' : 'text-premium-gold'}`}>
            ${savingsAmount.toFixed(2)} ({savingsPercent.toFixed(1)}%)
          </div>
        </div>
        
        {isBigSavings && (
          <div className="bg-success/10 text-success px-4 py-2 rounded-lg text-center font-semibold">
            ⚡ HUGE SAVINGS!
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <a
          href={alternative.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full luxury-btn primary justify-center"
        >
          <FiExternalLink className="mr-2" /> View Product
        </a>
        
        {alternative.tip_eligible && (
          <button
            onClick={handleTip}
            disabled={tipping}
            className="w-full luxury-btn secondary justify-center"
          >
            {tipping ? (
              <div className="w-5 h-5 border-2 border-deep-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <FiGift className="mr-2" /> Tip Finder ${savingsAmount.toFixed(0)}+
              </>
            )}
          </button>
        )}
      </div>

      {/* Tip Eligibility Badge */}
      {alternative.tip_eligible && (
        <div className="mt-4 pt-4 border-t border-crystal">
          <div className="flex items-center justify-center text-sm text-premium-gold">
            <FiGift className="mr-2" />
            <span>Eligible for tipping (15%+ savings)</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default AlternativeCard;
