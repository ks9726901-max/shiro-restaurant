import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import api, { API_HOST } from '../utils/api';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [notifiedIds, setNotifiedIds] = useState(() => {
    try {
      const stored = localStorage.getItem('shiro_notified_reservations');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const socketRef = useRef(null);
  const pollingRef = useRef(null);
  const initialLoadRef = useRef(true);

  // Sync notified IDs to localStorage
  useEffect(() => {
    localStorage.setItem('shiro_notified_reservations', JSON.stringify(notifiedIds));
  }, [notifiedIds]);

  // Synthesize crystal bell sound using Web Audio API
  const playBellSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const playTone = (frequency, delay, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
        
        gain.gain.setValueAtTime(0, ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + delay + 0.05); // Soft attack
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration); // Smooth decay
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + duration);
      };

      // Dual-tone bell chime: E6 (1318.51Hz) and G6 (1567.98Hz)
      playTone(1318.51, 0, 1.2);
      playTone(1567.98, 0.08, 1.5);
    } catch (err) {
      console.warn('Audio playback blocked or failed:', err);
    }
  };

  // Trigger popup notification
  const addToast = (reservation) => {
    const id = reservation.id || Math.random();
    const newToast = { ...reservation, id };
    
    setToasts((prev) => [...prev, newToast]);
    
    // Automatically clear toast after 8 seconds
    setTimeout(() => {
      removeToast(id);
    }, 8000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Process a newly discovered reservation
  const handleNewReservation = (reservation) => {
    if (!reservation || !reservation.id) return;
    
    // Prevent duplicate notifications
    setNotifiedIds((prev) => {
      if (prev.includes(reservation.id)) {
        return prev;
      }
      
      // Perform notification actions (only if not initial load seeding)
      if (!initialLoadRef.current) {
        console.log('🔔 Triggering notification alerts for reservation ID:', reservation.id);
        
        // Add to unread list
        setUnreadNotifications((unread) => [...unread, reservation]);
        
        // Play Bell Sound
        playBellSound();
        
        // Show Toast Popup
        addToast(reservation);
        
        // Notify any active components via Window custom event
        window.dispatchEvent(
          new CustomEvent('newReservationReceived', { detail: reservation })
        );
      }
      
      return [...prev, reservation.id];
    });
  };

  // Poll reservations API for updates
  const startPolling = () => {
    if (pollingRef.current) return;
    console.log('🔄 Starting backup HTTP polling (every 5 seconds)...');
    
    pollingRef.current = setInterval(async () => {
      try {
        const response = await api.get('/reservations');
        let reservations = response?.data;
        
        if (reservations && typeof reservations === 'object' && !Array.isArray(reservations)) {
          if (Array.isArray(reservations.data)) reservations = reservations.data;
          else if (Array.isArray(reservations.reservations)) reservations = reservations.reservations;
        }
        
        if (Array.isArray(reservations)) {
          reservations.forEach((res) => handleNewReservation(res));
        }
      } catch (err) {
        console.error('Error fetching reservations during polling:', err);
      }
    }, 5000);
  };

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
      console.log('⏹️ Polling stopped.');
    }
  };

  // Seed initial list of reservation IDs on mount (to prevent historical alerts)
  useEffect(() => {
    const seedInitialData = async () => {
      try {
        console.log('⏳ Seeding initial reservations list...');
        const response = await api.get('/reservations');
        let reservations = response?.data;
        
        if (reservations && typeof reservations === 'object' && !Array.isArray(reservations)) {
          if (Array.isArray(reservations.data)) reservations = reservations.data;
          else if (Array.isArray(reservations.reservations)) reservations = reservations.reservations;
        }
        
        if (Array.isArray(reservations)) {
          const ids = reservations.map((r) => r.id);
          setNotifiedIds((prev) => {
            const merged = Array.from(new Set([...prev, ...ids]));
            return merged;
          });
        }
      } catch (err) {
        console.warn('Could not seed initial reservations. Fallback to fresh notifications.', err);
      } finally {
        initialLoadRef.current = false;
        console.log('✅ Seeding complete. Real-time notifications active.');
      }
    };

    seedInitialData();
  }, []);

  // Socket IO connection management
  useEffect(() => {
    const token = localStorage.getItem('shiro_token');
    if (!token) {
      setIsSocketConnected(false);
      return;
    }

    // Connect to WebSocket server
    try {
      console.log('🔌 Connecting to WebSocket at:', API_HOST);
      socketRef.current = io(API_HOST, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnectionDelay: 2000,
        reconnectionDelayMax: 5000,
        timeout: 10000,
      });

      socketRef.current.on('connect', () => {
        console.log('✅ Socket connected successfully.');
        setIsSocketConnected(true);
        stopPolling(); // Disable backup polling while socket is active
      });

      socketRef.current.on('newReservation', (reservation) => {
        console.log('📥 Socket received new reservation event:', reservation);
        handleNewReservation(reservation);
      });

      socketRef.current.on('connect_error', (err) => {
        console.warn('⚠️ Socket connection error. Activating polling...', err.message);
        setIsSocketConnected(false);
        startPolling();
      });

      socketRef.current.on('disconnect', () => {
        console.log('❌ Socket disconnected.');
        setIsSocketConnected(false);
        startPolling();
      });

      socketRef.current.connect();
    } catch (err) {
      console.error('Socket initialization failed. Falling back to polling.', err);
      startPolling();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      stopPolling();
    };
  }, []);

  const clearUnreadCount = () => {
    setUnreadNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        unreadNotifications,
        unreadCount: unreadNotifications.length,
        clearUnreadCount,
        isSocketConnected,
      }}
    >
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(120%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
      
      {children}

      {/* Slide-in Toast popups list */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-4 w-80 sm:w-96 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex flex-col bg-ebony-card/95 backdrop-blur-md border border-gold/30 border-l-4 border-l-gold p-5 shadow-[0_10px_35px_rgba(0,0,0,0.6)] transform translate-x-0 transition-all duration-300 relative"
            style={{
              animation: 'slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="font-serif text-[10px] tracking-widest text-gold uppercase font-bold">
                  New Reservation Received
                </span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-stone hover:text-white transition-colors cursor-pointer text-xs p-1"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
            
            <div className="mt-3 text-stone-light">
              <p className="text-sm font-semibold text-white uppercase tracking-wider">
                {toast.customer_name}
              </p>
              
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-stone-border/30 text-[11px] font-sans font-light">
                <div>
                  <span className="text-stone block uppercase text-[9px] tracking-wider">Date</span>
                  <span className="text-gold font-medium">{toast.reservation_date}</span>
                </div>
                <div>
                  <span className="text-stone block uppercase text-[9px] tracking-wider">Time</span>
                  <span className="text-gold font-medium">
                    {toast.reservation_time ? toast.reservation_time.slice(0, 5) : 'N/A'}
                  </span>
                </div>
              </div>
              
              <div className="mt-2 text-[11px] font-sans font-light flex justify-between">
                <span>Guests: <strong className="text-white font-medium">{toast.guest_count} Persons</strong></span>
                {toast.special_requests && (
                  <span className="text-gold italic font-medium">Has Special Request</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
