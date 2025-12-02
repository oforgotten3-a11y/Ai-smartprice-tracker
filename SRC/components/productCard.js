import React, { useState } from 'react';
import { FiExternalLink, FiTrash2, FiTarget, FiDollarSign } from 'react-icons/fi';
import { deleteProduct } from '../services/products';

function ProductCard({ product, onDelete, addNotification }) {
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const result = await deleteProduct(product.id);
      if (result.success) {
        addNotification('Product removed successfully', 'success');
        onDelete();
      } else {
        addNotification(result.error, 'error');
      }
    } catch (error) {
      addNotification('Failed to delete product', 'error');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  const priceReached = product.current_price <= product.target_price;
  const savings = product.current_price ? (product.target_price - product.current_price) : 0;

  return (
    <div className="group bg-gradient-to-br from-gray-900/30 to-black/30 rounded-2xl p-6 border border-crystal hover:border-electric-blue transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1 truncate" title={product.product_name}>
            {product.product_name || 'Unknown Product'}
          </h3>
          <div className="flex items-center text-sm text-gray-400">
            <span className="bg-gray-800 px-2 py-1 rounded-md">{product.store || 'Unknown Store'}</span>
            <span className="mx-2">•</span>
            <span>{new Date(product.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-premium-gold">
            ${product.current_price || '0.00'}
          </div>
          <div className="text-sm text-gray-400">Current</div>
        </div>
      </div>

      {/* Price Info */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <FiTarget className="text-electric-blue mr-2" />
            <span className="text-gray-300">Target Price</span>
          </div>
          <div className="font-semibold text-electric-blue">${product.target_price}</div>
        </div>
        
        {priceReached ? (
          <div className="bg-success/10 text-success px-4 py-2 rounded-lg flex items-center justify-between">
            <span className="font-semibold">🎉 Target Reached!</span>
            <span className="font-bold">Save ${savings.toFixed(2)}</span>
          </div>
        ) : (
          <div className="bg-warning/10 text-warning px-4 py-2 rounded-lg text-center">
            ${(product.target_price - (product.current_price || 0)).toFixed(2)} to target
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 luxury-btn outline justify-center"
        >
          <FiExternalLink className="mr-2" /> View
        </a>
        
        <button
          onClick={() => setShowConfirm(true)}
          disabled={deleting}
          className="px-4 py-3 rounded-xl border border-error/30 text-error hover:bg-error/10 transition-colors"
        >
          {deleting ? (
            <div className="w-5 h-5 border-2 border-error border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <FiTrash2 />
          )}
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-md mx-4 border border-crystal">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to remove "{product.product_name}" from tracking?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 luxury-btn outline"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 luxury-btn primary bg-error hover:bg-error/90"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductCard;
