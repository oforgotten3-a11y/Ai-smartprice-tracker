/* Luxury-specific styles */
.perfume-glow {
  box-shadow: 
    0 0 20px rgba(107, 70, 193, 0.3),
    0 0 40px rgba(49, 130, 206, 0.2),
    inset 0 0 20px rgba(255, 255, 255, 0.1);
}

.crystal-border {
  position: relative;
  background: var(--dark-black);
}

.crystal-border::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, var(--royal-purple), var(--electric-blue), var(--premium-gold));
  border-radius: inherit;
  z-index: -1;
}

.shimmer {
  position: relative;
  overflow: hidden;
}

.shimmer::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Luxury badges */
.premium-badge {
  background: linear-gradient(45deg, var(--premium-gold), #f7ef8a);
  color: var(--deep-black);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.elite-badge {
  background: linear-gradient(45deg, var(--royal-purple), var(--electric-blue));
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Luxury shadows */
.luxury-shadow {
  box-shadow: 
    0 10px 25px rgba(0, 0, 0, 0.3),
    0 5px 10px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.luxury-shadow-lg {
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 10px 20px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Hover effects */
.hover-lift {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

/* Gradient backgrounds */
.gradient-bg-purple-blue {
  background: linear-gradient(135deg, var(--royal-purple), var(--electric-blue));
}

.gradient-bg-gold {
  background: linear-gradient(135deg, var(--premium-gold), #f7ef8a);
}

.gradient-bg-dark {
  background: linear-gradient(135deg, var(--deep-black), var(--dark-black));
}

/* Text gradients */
.text-gradient-purple-blue {
  background: linear-gradient(45deg, var(--royal-purple), var(--electric-blue));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text-gradient-gold {
  background: linear-gradient(45deg, var(--premium-gold), #f7ef8a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
                  }
