import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../services/auth';
import { useSocket } from '../services/socket';
import { FiSend, FiUsers, FiMessageSquare, FiLock } from 'react-icons/fi';
import { format } from 'date-fns';

function Chat({ addNotification }) {
  const { user, isAuthenticated } = useAuth();
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [usersOnline, setUsersOnline] = useState(0);
  const [joined, setJoined] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !user?.chat_access) return;

    if (socket && isConnected) {
      // Join chat
      socket.emit('join_chat', {
        userId: user.id,
        email: user.email
      });

      // Listen for messages
      socket.on('new_message', (data) => {
        setMessages(prev => [...prev, data]);
      });

      socket.on('chat_joined', (data) => {
        setJoined(true);
        addNotification(data.message, 'success');
      });

      socket.on('chat_error', (data) => {
        addNotification(data.message, 'error');
        if (data.upgradeRequired) {
          // Could redirect to payments
        }
      });

      // Simulate users online (in real app, get from server)
      setUsersOnline(Math.floor(Math.random() * 50) + 10);

      return () => {
        socket.off('new_message');
        socket.off('chat_joined');
        socket.off('chat_error');
      };
    }
  }, [socket, isConnected, user, isAuthenticated]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !joined) return;

    socket.emit('send_message', {
      userId: user.id,
      username: user.username || user.email.split('@')[0],
      message: newMessage.trim(),
      productId: null
    });

    setNewMessage('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Luxury Chat</h1>
          <p className="text-gray-400 mb-8">Please login to access the chat</p>
        </div>
      </div>
    );
  }

  if (!user?.chat_access) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-premium-gold/20 to-yellow-300/20 mb-6">
            <FiLock className="text-3xl text-premium-gold" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-4">Premium Feature</h1>
          <p className="text-gray-400 mb-6">
            Luxury Chat is available exclusively for Pro and Business members.
            Upgrade your plan to connect with elite shoppers and share luxury finds.
          </p>
          <button
            onClick={() => window.location.href = '/payments'}
            className="luxury-btn primary"
          >
            Upgrade to Unlock Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text flex items-center">
              <FiMessageSquare className="mr-3" /> Luxury Shopping Chat
            </h1>
            <p className="text-gray-400 mt-2">Connect with elite shoppers worldwide</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-gray-900/50 rounded-xl border border-crystal">
              <FiUsers className="text-electric-blue" />
              <span className="font-semibold">{usersOnline}</span>
              <span className="text-gray-400 text-sm">online</span>
            </div>
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-success' : 'bg-error'}`}></div>
          </div>
        </div>

        {/* Chat Rules */}
        <div className="bg-gradient-to-r from-gray-900/50 to-black/50 p-4 rounded-xl border border-crystal mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
              <span className="text-gray-300">Be respectful</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-premium-gold rounded-full mr-2"></div>
              <span className="text-gray-300">Share luxury finds</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-royal-purple rounded-full mr-2"></div>
              <span className="text-gray-300">No promotions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="glass-effect rounded-2xl border border-crystal overflow-hidden">
        {/* Messages Area */}
        <div className="h-[500px] overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center">
              <FiMessageSquare className="text-5xl text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Welcome to Luxury Chat!</h3>
              <p className="text-gray-400 text-center max-w-md">
                Start a conversation with fellow luxury shoppers. Share your finds, ask for advice, and discover hidden gems.
              </p>
              <div className="mt-8 space-y-3">
                <div className="text-center text-sm text-gray-500">
                  <div className="font-semibold text-premium-gold">Tips:</div>
                  <div>• Ask about luxury brand sales</div>
                  <div>• Share rare finds</div>
                  <div>• Discuss investment pieces</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => {
                const isOwnMessage = message.user_id === user.id;
                return (
                  <div
                    key={index}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${isOwnMessage
                        ? 'bg-gradient-to-r from-royal-purple/20 to-electric-blue/20 border border-royal-purple/30'
                        : 'bg-gray-900/50 border border-crystal'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-semibold ${isOwnMessage ? 'text-royal-purple' : 'text-premium-gold'}`}>
                          {message.username}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(message.created_at), 'HH:mm')}
                        </span>
                      </div>
                      <p className="text-white">{message.message}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-crystal p-4 bg-gray-900/30">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Share your luxury finds..."
              className="flex-1 px-4 py-3 bg-gray-900/50 border border-crystal rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-transparent"
              disabled={!joined || !isConnected}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || !joined || !isConnected}
              className="luxury-btn primary px-6"
            >
              <FiSend />
            </button>
          </form>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <div>
              {isConnected ? (
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                  Connected
                </span>
              ) : (
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-error rounded-full mr-2"></div>
                  Connecting...
                </span>
              )}
            </div>
            <div>Press Enter to send</div>
          </div>
        </div>
      </div>

      {/* Quick Suggestions */}
      <div className="mt-8">
        <h3 className="font-semibold mb-4">Quick Suggestions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            "Any luxury watch deals?",
            "Best cashmere brands?",
            "Designer outlet recommendations?",
            "Investment bag advice?"
          ].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setNewMessage(suggestion)}
              className="p-3 text-sm text-left bg-gray-900/30 rounded-xl border border-crystal hover:border-gray-500 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Chat;
