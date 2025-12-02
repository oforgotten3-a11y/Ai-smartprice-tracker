import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/auth';
import { getProducts, findAlternatives } from '../services/products';
import AlternativeCard from '../components/AlternativeCard';
import { FiSearch, FiFilter, FiTrendingUp, FiPackage } from 'react-icons/fi';

function Alternatives({ addNotification }) {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAlternatives, setLoadingAlternatives] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleFindAlternatives = async (productId) => {
    setLoadingAlternatives(true);
    try {
      const result = await findAlternatives(productId);
      if (result.success) {
        setSelectedProduct(result.original_product);
        setAlternatives(result.alternatives || []);
        addNotification(`Found ${result.alternatives.length} alternatives`, 'success');
      } else {
        addNotification(result.error, 'error');
      }
    } catch (error) {
      addNotification('Failed to find alternatives', 'error');
    } finally {
      setLoadingAlternatives(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.url?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">AI Alternatives</h1>
          <p className="text-gray-400 mb-8">Please login to access AI alternatives</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold gradient-text mb-2">AI Alternatives</h1>
        <p className="text-gray-400">Smart suggestions for better deals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Products */}
        <div className="lg:col-span-1">
          <div className="glass-effect rounded-2xl p-6 border border-crystal">
            <div className="mb-6">
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search your products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-crystal rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent"
                />
              </div>
              <h3 className="font-semibold mb-4">Your Products ({products.length})</h3>
            </div>

            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block w-8 h-8 border-2 border-electric-blue border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedProduct?.id === product.id ? 'bg-electric-blue/10 border-electric-blue' : 'border-crystal hover:border-gray-500'}`}
                    onClick={() => handleFindAlternatives(product.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium truncate">{product.product_name || 'Unknown Product'}</h4>
                      <span className="text-premium-gold font-bold">${product.current_price || '0'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span className="truncate">{product.store || 'Unknown Store'}</span>
                      <span>Target: ${product.target_price}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <FiPackage className="text-4xl text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No products found</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Alternatives */}
        <div className="lg:col-span-2">
          {selectedProduct ? (
            <div className="space-y-6">
              {/* Original Product */}
              <div className="glass-effect rounded-2xl p-6 border border-crystal">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold flex items-center">
                      <FiTrendingUp className="mr-2 text-premium-gold" />
                      Original Product
                    </h3>
                    <p className="text-gray-400 text-sm">We found alternatives for this item</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-premium-gold">${selectedProduct.current_price || '0'}</div>
                    <div className="text-sm text-gray-400">Current Price</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-gray-900/30 rounded-xl">
                    <div className="text-sm text-gray-400 mb-1">Product</div>
                    <div className="font-medium truncate">{selectedProduct.product_name || 'Unknown'}</div>
                  </div>
                  <div className="p-4 bg-gray-900/30 rounded-xl">
                    <div className="text-sm text-gray-400 mb-1">Store</div>
                    <div className="font-medium">{selectedProduct.store || 'Unknown'}</div>
                  </div>
                  <div className="p-4 bg-gray-900/30 rounded-xl">
                    <div className="text-sm text-gray-400 mb-1">Your Target</div>
                    <div className="font-medium text-electric-blue">${selectedProduct.target_price}</div>
                  </div>
                </div>

                <a
                  href={selectedProduct.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="luxury-btn outline w-full"
                >
                  View Original Product
                </a>
              </div>

              {/* Alternatives */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold">AI Suggestions</h3>
                    <p className="text-gray-400 text-sm">
                      {loadingAlternatives ? 'Finding alternatives...' : `${alternatives.length} alternatives found`}
                    </p>
                  </div>
                  <button
                    onClick={() => handleFindAlternatives(selectedProduct.id)}
                    disabled={loadingAlternatives}
                    className="luxury-btn outline"
                  >
                    {loadingAlternatives ? 'Searching...' : 'Find More'}
                  </button>
                </div>

                {loadingAlternatives ? (
                  <div className="text-center py-20">
                    <div className="inline-block w-12 h-12 border-4 border-electric-blue border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-400">AI is finding the best alternatives...</p>
                  </div>
                ) : alternatives.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {alternatives.map(alt => (
                      <AlternativeCard
                        key={alt.id}
                        alternative={alt}
                        originalPrice={selectedProduct.current_price}
                        addNotification={addNotification}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 border-2 border-dashed border-crystal rounded-2xl">
                    <FiSearch className="text-4xl text-gray-500 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold mb-2">No Alternatives Found</h4>
                    <p className="text-gray-400 max-w-md mx-auto">
                      Try selecting a different product or check back later for new suggestions
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 glass-effect rounded-2xl border border-crystal">
              <FiSearch className="text-5xl text-gray-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-3">Select a Product</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Choose a product from your collection to find AI-powered alternatives and better deals
              </p>
              <div className="inline-flex items-center space-x-2 text-premium-gold">
                <FiTrendingUp />
                <span>Find up to 70% savings with AI alternatives</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Alternatives;
