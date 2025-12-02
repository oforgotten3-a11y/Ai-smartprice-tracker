import React, { useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi';

function Notification({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <FiCheckCircle className="text-success" />,
    error: <FiXCircle className="text-error" />,
    info: <FiInfo className="text-electric-blue" />,
    warning: <FiAlertTriangle className="text-warning" />
  };

  const bgColors = {
    success: 'bg-success/10 border-success/30',
    error: 'bg-error/10 border-error/30',
    info: 'bg-electric-blue/10 border-electric-blue/30',
    warning: 'bg-warning/10 border-warning/30'
  };

  return (
    <div className={`animate-fadeIn rounded-xl p-4 border ${bgColors[type]} backdrop-blur-lg`}>
      <div className="flex items-center">
        <div className="mr-3 text-xl">
          {icons[type]}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-2 p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <FiX className="text-sm" />
        </button>
      </div>
    </div>
  );
}

export default Notification;
