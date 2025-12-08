import api from './api';

export const generateBitcoinPayment = async (plan) => {
  try {
    return await api.post('/payment/generate-bitcoin', { plan });
  } catch (error) {
    return { success: false, error: error.error || 'Failed to generate Bitcoin payment' };
  }
};

export const createOpayPayment = async (plan) => {
  try {
    return await api.post('/payment/create-opay', { plan });
  } catch (error) {
    return { success: false, error: error.error || 'Failed to create OPay payment' };
  }
};

export const uploadOpayProof = async (paymentId, file) => {
  try {
    const formData = new FormData();
    formData.append('proof', file);
    formData.append('payment_id', paymentId);

    const response = await api.post('/payment/upload-opay-proof', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response;
  } catch (error) {
    return { success: false, error: error.error || 'Failed to upload proof' };
  }
};

export const checkPaymentStatus = async (paymentId) => {
  try {
    return await api.get(`/payment/status/${paymentId}`);
  } catch (error) {
    return { success: false, error: error.error || 'Failed to check payment status' };
  }
};

export const createTip = async (alternativeId, amount) => {
  try {
    return await api.post('/tips/create', {
      alternative_product_id: alternativeId,
      amount,
      payment_method: 'bitcoin'
    });
  } catch (error) {
    return { success: false, error: error.error || 'Failed to create tip' };
  }
};

export const getPaymentHistory = async () => {
  try {
    return await api.get('/payment/history');
  } catch (error) {
    return { success: false, error: error.error || 'Failed to fetch payment history' };
  }
};
export const validatePromoCode = async (promoCode) => {
  try {
    return await api.get(`/donations/validate-promo/${promoCode}`);
  } catch (error) {
    return { success: false, error: error.error || 'Failed to validate promo code' };
  }
};

export const usePromoCode = async (promoCode) => {
  try {
    return await api.post(`/donations/use-promo/${promoCode}`);
  } catch (error) {
    return { success: false, error: error.error || 'Failed to use promo code' };
  }
};
