import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Layouts
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import { NotificationProvider } from './context/NotificationContext';

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

// Dashboard Layout Shell
const DashboardLayout = () => {
  return (
    <NotificationProvider>
      <div className="flex bg-ebony min-h-screen text-stone">
        <Sidebar />
        <main className="flex-1 p-10 overflow-y-auto max-h-screen scrollbar-luxury">
          <Outlet />
        </main>
      </div>
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
          </Route>
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
