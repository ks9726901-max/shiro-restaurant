import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { 
  CalendarRange, 
  Utensils, 
  BarChart3, 
  LogOut, 
  LayoutDashboard,
  UserCheck 
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount, clearUnreadCount } = useNotifications();
  const user = JSON.parse(localStorage.getItem('shiro_user') || '{}');

  useEffect(() => {
    if (location.pathname === '/dashboard/reservations') {
      clearUnreadCount();
    }
  }, [location.pathname, clearUnreadCount]);

  const handleLogout = () => {
    localStorage.removeItem('shiro_token');
    localStorage.removeItem('shiro_user');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'Reservations', path: '/dashboard/reservations', icon: CalendarRange },
    { name: 'Menu Editor', path: '/dashboard/menu', icon: Utensils },
    { name: 'Reports', path: '/dashboard/reports', icon: BarChart3 }
  ];

  return (
    <aside className="w-64 bg-ebony-card border-r border-stone-border min-h-screen flex flex-col shrink-0">
      {/* Brand Header */}
      <div className="p-8 border-b border-stone-border flex flex-col items-center">
        <Link to="/" className="flex flex-col items-center group">
          <span className="font-serif text-2xl font-bold tracking-[0.2em] text-gold">SHIRO</span>
          <span className="text-[8px] tracking-[0.3em] text-stone font-sans uppercase mt-0.5">Staff Portal</span>
        </Link>
      </div>

      {/* User Information */}
      <div className="p-6 border-b border-stone-border/50 flex items-center space-x-3 bg-ebony/35">
        <div className="w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center bg-gold/5 text-gold">
          <UserCheck className="w-5 h-5" />
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-semibold text-stone-light truncate uppercase tracking-wider">
            {user.username || 'Staff'}
          </p>
          <p className="text-[10px] text-gold tracking-widest uppercase mt-0.5">
            {user.role || 'Member'}
          </p>
        </div>
      </div>

      {/* Sidebar Links */}
      <nav className="flex-1 p-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3.5 px-4 py-3 rounded-none font-sans text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-gold/10 text-gold border-l-2 border-gold font-medium'
                  : 'text-stone hover:bg-ebony-light hover:text-gold border-l-2 border-transparent'
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
              {item.name === 'Reservations' && unreadCount > 0 && (
                <span className="ml-auto bg-gold text-ebony font-sans font-bold text-[10px] px-2 py-0.5 rounded-full animate-bounce">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Action */}
      <div className="p-6 border-t border-stone-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-stone-border text-stone hover:border-crimson-bright hover:text-crimson-bright transition-all duration-300 font-sans text-xs tracking-wider uppercase cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
