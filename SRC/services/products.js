import api from './api';

export const getProducts = async () => {
  try {
    return await api.get('/products');
  } catch (error) {
    return { success: false, error: error.error || 'Failed to fetch products' };
  }
};

export const trackProduct = async (url, targetPrice) => {
  try {
    return await api.post('/products/track', { url, target_price: targetPrice });
  } catch (error) {
    return { success: false, error: error.error || 'Failed to track product' };
  }
};

export const findAlternatives = async (productId) => {
  try {
    return await api.post('/products/find-alternatives', { product_id: productId });
  } catch (error) {
    return { success: false, error: error.error || 'Failed to find alternatives' };
  }
};

export const deleteProduct = async (productId) => {
  try {
    return await api.delete(`/products/${productId}`);
  } catch (error) {
    return { success: false, error: error.error || 'Failed to delete product' };
  }
};

export const updateProductPrice = async (productId, price) => {
  try {
    return await api.put(`/products/${productId}/price`, { price });
  } catch (error) {
    return { success: false, error: error.error || 'Failed to update price' };
  }
};
