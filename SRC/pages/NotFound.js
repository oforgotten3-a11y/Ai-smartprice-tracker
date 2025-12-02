import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiSearch } from 'react-icons/fi';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold gradient-text opacity-20">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl font-bold">Page Not Found</div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4">Lost in Luxury</h1>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
          Don't worry, you can still find amazing luxury deals!
        </p>

        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="luxury-btn primary w-full justify-center"
          >
            <FiHome className="mr-2" /> Back to Dashboard
          </Link>
          
          <Link
            to="/products"
            className="luxury-btn outline w-full justify-center"
          >
            <FiSearch className="mr-2" /> Browse Products
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 grid grid-cols-3 gap-4 opacity-50">
          {['💎', '🛍️', '🌟', '👑', '✨', '🎯'].map((emoji, index) => (
            <div
              key={index}
              className="text-3xl animate-float"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {emoji}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NotFound;
