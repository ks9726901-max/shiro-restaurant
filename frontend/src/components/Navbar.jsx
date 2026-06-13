import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ShieldAlert } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Change background on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Reservation', path: '/reservation' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-ebony/95 backdrop-blur-md border-b border-stone-border/30 py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/" className="flex flex-col items-center group">
          <span className="font-serif text-2xl font-normal tracking-[0.3em] text-gold group-hover:text-gold-hover transition-colors duration-300">
            SHIRO
          </span>
          <span className="text-[8px] tracking-[0.45em] text-stone/70 font-sans uppercase mt-0.5 group-hover:text-gold transition-colors duration-300">
            Bengaluru
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative font-sans text-[10px] tracking-[0.25em] uppercase transition-all duration-300 py-1 group ${
                    isActive
                      ? 'text-gold font-medium'
                      : 'text-stone/70 hover:text-gold-hover'
                  }`}
                >
                  <span>{link.name}</span>
                  <span 
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-gold transition-all duration-300 origin-center ${
                      isActive ? 'w-full scale-x-100' : 'w-0 scale-x-0 group-hover:w-full group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              );
            })}
          </div>
 
          <div className="flex items-center space-x-6 border-l border-stone-border/40 pl-8">
            {/* Direct CTA */}
            <Link
              to="/reservation"
              className="relative px-5 py-2 overflow-hidden border border-gold/40 hover:border-gold bg-transparent text-gold hover:text-ebony hover:bg-gold font-sans text-[10px] tracking-widest uppercase transition-all duration-300"
            >
              <span className="relative z-10">Book Table</span>
            </Link>
 
            {/* Subtle Staff Link */}
            <Link
              to="/login"
              title="Staff Dashboard"
              className="text-stone/60 hover:text-gold transition-colors duration-300 hover:scale-105"
            >
              <ShieldAlert className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="flex items-center space-x-4 md:hidden">
          <Link
            to="/login"
            className="text-stone/60 hover:text-gold transition-colors"
          >
            <ShieldAlert className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gold hover:text-gold-hover focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slideout Menu */}
      <div
        className={`fixed inset-y-0 right-0 w-72 bg-ebony-card border-l border-stone-border/40 z-40 p-8 transform transition-transform duration-500 shadow-2xl md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-end mb-8">
          <button onClick={() => setIsOpen(false)} className="text-gold">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col space-y-6">
          <div className="border-b border-stone-border/40 pb-4 mb-4">
            <span className="font-serif text-xl tracking-[0.25em] text-gold">SHIRO</span>
            <p className="text-[8px] tracking-widest text-stone/60 uppercase mt-1">UB City, Bengaluru</p>
          </div>

          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-xs tracking-widest uppercase pb-1 border-b ${
                  isActive
                    ? 'text-gold border-gold/40 font-medium'
                    : 'text-stone/70 border-transparent'
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}

          <Link
            to="/reservation"
            className="mt-8 px-6 py-3 text-center border border-gold text-gold font-sans text-xs uppercase tracking-widest hover:bg-gold hover:text-ebony transition-all duration-300 font-medium"
            onClick={() => setIsOpen(false)}
          >
            Book Table
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
