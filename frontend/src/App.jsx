import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Bell } from 'lucide-react';

// Layouts
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import { NotificationProvider, useNotifications } from './context/NotificationContext';

// Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import Gallery from './pages/Gallery';
import Reservation from './pages/Reservation';
import Contact from './pages/Contact';
import Login from './pages/Login';

// Dashboard Pages
import DashboardHome from './pages/Dashboard/DashboardHome';
import DashboardReservations from './pages/Dashboard/DashboardReservations';
import DashboardMenu from './pages/Dashboard/DashboardMenu';
import DashboardReports from './pages/Dashboard/DashboardReports';
import DashboardNotFound from './pages/Dashboard/DashboardNotFound';

// Auth Guard Component
const ProtectedRoute = () => {
  const token = localStorage.getItem('shiro_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

// Customer Layout Shell
const CustomerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Inner Dashboard layout content consuming context
const DashboardLayoutContent = () => {
  const { unreadNotifications, unreadCount, clearUnreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex bg-ebony min-h-screen text-stone">
      <Sidebar />
      <main className="flex-1 flex flex-col max-h-screen overflow-hidden">
        {/* Header Bar */}
        <header className="h-16 border-b border-stone-border/40 bg-ebony-card px-10 flex items-center justify-between shrink-0 z-30">
          <div className="text-xs font-light text-stone uppercase tracking-widest">
            Luxury Pan-Asian Dining
          </div>
          
          <div className="flex items-center space-x-6 relative" ref={dropdownRef}>
            {/* Notification Bell Icon */}
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-stone hover:text-gold transition-colors cursor-pointer"
              aria-label="Toggle notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-gradient-to-r from-gold via-amber to-gold text-ebony font-sans font-bold text-[9px] flex items-center justify-center rounded-full border border-ebony animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.5)]">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Menu */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-ebony-card border border-stone-border shadow-[0_10px_35px_rgba(0,0,0,0.8)] z-50 flex flex-col">
                {/* Dropdown Header */}
                <div className="p-3.5 border-b border-stone-border/60 flex justify-between items-center bg-ebony/40">
                  <span className="font-serif text-[10px] tracking-widest text-gold uppercase font-bold">New Reservations</span>
                  {unreadCount > 0 && (
                    <span className="bg-gold/10 text-gold text-[9px] px-2 py-0.5 font-bold uppercase tracking-wider font-sans">
                      {unreadCount} New
                    </span>
                  )}
                </div>

                {/* Dropdown Content */}
                <div className="max-h-64 overflow-y-auto divide-y divide-stone-border/30 scrollbar-luxury">
                  {unreadNotifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-stone font-light italic">
                      No new notifications
                    </div>
                  ) : (
                    unreadNotifications.map((n) => (
                      <div key={n.id} className="p-3.5 hover:bg-ebony-light/40 transition-colors text-left animate-fade-in">
                        <p className="font-semibold text-white uppercase text-[10px] tracking-wider mb-1">
                          {n.customer_name}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-[9px] text-stone font-sans mt-1">
                          <div>
                            <span className="block uppercase text-[8px] text-stone/60">Date & Time</span>
                            <span className="text-gold font-medium">{n.reservation_date} @ {n.reservation_time ? n.reservation_time.slice(0, 5) : 'N/A'}</span>
                          </div>
                          <div>
                            <span className="block uppercase text-[8px] text-stone/60">Guests</span>
                            <span className="text-gold font-medium">{n.guest_count} persons</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Dropdown Footer */}
                {unreadCount > 0 && (
                  <button 
                    onClick={() => {
                      clearUnreadCount();
                      setShowNotifications(false);
                    }} 
                    className="w-full py-2.5 text-[10px] text-center text-gold font-sans font-bold hover:bg-gold/10 transition-colors uppercase tracking-widest border-t border-stone-border/30 cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 p-10 overflow-y-auto scrollbar-luxury">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

// Dashboard Layout Shell
const DashboardLayout = () => {
  return (
    <NotificationProvider>
      <DashboardLayoutContent />
    </NotificationProvider>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Customer Routing */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Portal Login */}
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routing */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/dashboard/reservations" element={<DashboardReservations />} />
            <Route path="/dashboard/menu" element={<DashboardMenu />} />
            <Route path="/dashboard/reports" element={<DashboardReports />} />
            {/* Catch-all dashboard fallback */}
            <Route path="/dashboard/*" element={<DashboardNotFound />} />
          </Route>
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
