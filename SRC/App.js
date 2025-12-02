import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Alternatives from './pages/Alternatives';
import Chat from './pages/Chat';
import Payments from './pages/Payments';
import NotFound from './pages/NotFound';
import Notification from './components/Notification';
import { AuthProvider } from './services/auth';
import { SocketProvider } from './services/socket';
import './styles/main.css';

function App() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <div className="min-h-screen bg-gradient-to-br from-deep-black to-dark-black text-platinum">
            <Navigation />
            <main className="pt-20 px-4 md:px-8">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/login" element={<Login addNotification={addNotification} />} />
                <Route path="/register" element={<Register addNotification={addNotification} />} />
                <Route path="/dashboard" element={<Dashboard addNotification={addNotification} />} />
                <Route path="/products" element={<Products addNotification={addNotification} />} />
                <Route path="/alternatives" element={<Alternatives addNotification={addNotification} />} />
                <Route path="/chat" element={<Chat addNotification={addNotification} />} />
                <Route path="/payments" element={<Payments addNotification={addNotification} />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            
            {/* Notifications */}
            <div className="fixed top-24 right-4 z-50 space-y-2">
              {notifications.map(notification => (
                <Notification
                  key={notification.id}
                  message={notification.message}
                  type={notification.type}
                  onClose={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                />
              ))}
            </div>
          </div>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
