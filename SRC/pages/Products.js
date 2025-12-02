import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/auth';
import { getProducts, trackProduct } from '../services/products';
import ProductCard from '../components/ProductCard';
import Modal from '../components/Modal';
import { FiPackage, FiPlus, FiSearch, FiFilter } from 'react-icons/fi';

function Products({ addNotification }) {
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    url: '',
    targetPrice: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
    }
  }, [isAuthenticated]);

  const loadProducts = async () => {
    try {
      const result = await getProducts();
      if (result.success) {
        setProducts(result.products || []);
      }
    } catch (error) {
      addNotification('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!formData.url || !formData.targetPrice) {
      addNotification('Please fill all fields', 'error');
      return;
    }

    try {
      const result = await trackProduct(formData.url, parseFloat(formData.targetPrice));
      if (result.success) {
        addNotification('Product added successfully!', 'success');
        setShowAddModal(false);
        setFormData({ url: '', targetPrice: '' });
        loadProducts();
      } else {
        if (result.upgradeRequired) {
          addNotification(result.error, 'error');
          // Optionally redirect to payments page
        } else {
          addNotification(result.error, 'error');
        }
      }
    } catch (error) {
      addNotification('Failed to add product', 'error');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.url?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'reached') return matchesSearch && product.current_price <= product.target_price;
    if (filter === 'active') return matchesSearch && product.current_price > product.target_price;
    return matchesSearch;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Product Collection</h1>
          <p className="text-gray-400 mb-8">Please login to view your products</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Your Luxury Collection</h1>
            <p className="text-gray-400 mt-2">Track and monitor your desired items</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="luxury-btn primary"
          >
            <FiPlus className="mr-2" /> Add Product
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="stat-card">
            <div className="text-2xl font-bold text-premium-gold">{products.length}</div>
            <p className="text-gray-400">Total Products</p>
          </div>
          <div className="stat-card">
            <div className="text-2xl font-bold text-electric-blue">
              {products.filter(p => p.current_price <= p.target_price).length}
            </div>
            <p className="text-gray-400">Targets Reached</p>
          </div>
          <div className="stat-card">
            <div className="text-2xl font-bold text-success">
              {user?.plan === 'free' ? 3 : user?.plan === 'pro' ? 50 : 200}
            </div>
            <p className="text-gray-400">Plan Limit</p>
          </div>
          <div className="stat-card">
            <div className="text-2xl font-bold text-royal-purple capitalize">{user?.plan}</div>
            <p className="text-gray-400">Current Plan</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-crystal rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-3 rounded-xl border ${filter === 'all' ? 'bg-electric-blue/20 border-electric-blue text-electric-blue' : 'border-crystal text-gray-400 hover:border-gray-500'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-3 rounded-xl border ${filter === 'active' ? 'bg-electric-blue/20 border-electric-blue text-electric-blue' : 'border-crystal text-gray-400 hover:border-gray-500'}`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('reached')}
              className={`px-4 py-3 rounded-xl border ${filter === 'reached' ? 'bg-electric-blue/20 border-electric-blue text-electric-blue' : 'border-crystal text-gray-400 hover:border-gray-500'}`}
            >
              Reached
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-12 h-12 border-4 border-electric-blue border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading your collection...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={() => loadProducts()}
              addNotification={addNotification}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-crystal rounded-3xl">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-900/50 to-black/50 mb-6">
            <FiPackage className="text-3xl text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Products Yet</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Start adding luxury items to monitor their prices and get smart alternatives
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="luxury-btn primary"
          >
            <FiPlus className="mr-2" /> Add Your First Product
          </button>
        </div>
      )}

      {/* Add Product Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Luxury Product"
      >
        <form onSubmit={handleAddProduct} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product URL
            </label>
            <input
              type="url"
              required
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
              className="w-full px-4 py-3 bg-gray-900/50 border border-crystal rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent"
              placeholder="https://example.com/product"
            />
            <p className="mt-2 text-xs text-gray-500">
              Paste the URL of the product you want to track
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Target Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.targetPrice}
              onChange={(e) => setFormData({...formData, targetPrice: e.target.value})}
              className="w-full px-4 py-3 bg-gray-900/50 border border-crystal rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent"
              placeholder="99.99"
            />
            <p className="mt-2 text-xs text-gray-500">
              We'll notify you when the price drops to this amount
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="flex-1 luxury-btn outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 luxury-btn primary"
            >
              <FiPlus className="mr-2" /> Track Product
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Products;
