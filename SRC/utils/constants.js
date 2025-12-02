export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  TIMEOUT: 10000,
};

export const SOCKET_CONFIG = {
  URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
  RECONNECTION_ATTEMPTS: 5,
  RECONNECTION_DELAY: 1000,
};

export const PRICING_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    features: {
      productLimit: 3,
      checkFrequency: 24,
      chatAccess: false,
      aiAccess: false,
    }
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 7.99,
    features: {
      productLimit: 50,
      checkFrequency: 6,
      chatAccess: true,
      aiAccess: true,
    }
  },
  BUSINESS: {
    id: 'business',
    name: 'Business',
    price: 29.99,
    features: {
      productLimit: 200,
      checkFrequency: 1,
      chatAccess: true,
      aiAccess: true,
    }
  }
};

export const PAYMENT_METHODS = {
  BITCOIN: {
    id: 'bitcoin',
    name: 'Bitcoin',
    description: 'Cryptocurrency payment',
    currency: 'BTC',
    processingTime: '10 minutes'
  },
  OPAY: {
    id: 'opay',
    name: 'OPay',
    description: 'Mobile money transfer',
    currency: 'NGN',
    processingTime: '24 hours'
  }
};

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
};

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  THEME: 'theme'
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PRODUCTS: '/products',
  ALTERNATIVES: '/alternatives',
  CHAT: '/chat',
  PAYMENTS: '/payments',
  NOT_FOUND: '*'
};
