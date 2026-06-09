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
          ? 'bg-ebony/95 backdrop-blur-md border-b border-stone-border py-4 shadow-xl' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/" className="flex flex-col items-center group">
          <span className="font-serif text-3xl font-semibold tracking-[0.25em] text-gold group-hover:text-gold-hover transition-colors duration-300">
            SHIRO
          </span>
          <span className="text-[9px] tracking-[0.4em] text-stone font-sans uppercase mt-0.5 group-hover:text-gold transition-colors duration-300">
            Bengaluru
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-10">
          <div className="flex space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `font-sans text-sm tracking-widest uppercase transition-all duration-300 pb-1 border-b ${
                    isActive
                      ? 'text-gold border-gold font-medium'
                      : 'text-stone-light border-transparent hover:text-gold hover:border-gold/30'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center space-x-6 border-l border-stone-border pl-8">
            {/* Direct CTA */}
            <Link
              to="/reservation"
              className="px-6 py-2.5 bg-transparent border border-gold text-gold font-sans text-xs uppercase tracking-widest hover:bg-gold hover:text-ebony transition-all duration-500 font-medium"
            >
              Book Table
            </Link>

            {/* Subtle Staff Link */}
            <Link
              to="/login"
              title="Staff Dashboard"
              className="text-stone hover:text-gold transition-colors duration-300"
            >
              <ShieldAlert className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="flex items-center space-x-4 md:hidden">
          <Link
            to="/login"
            className="text-stone hover:text-gold transition-colors"
          >
            <ShieldAlert className="w-5 h-5" />
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gold hover:text-gold-hover focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slideout Menu */}
      <div
        className={`fixed inset-y-0 right-0 w-80 bg-ebony-card border-l border-stone-border z-40 p-8 transform transition-transform duration-500 shadow-2xl md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-end mb-8">
          <button onClick={() => setIsOpen(false)} className="text-gold">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col space-y-6">
          <div className="border-b border-stone-border pb-4 mb-4">
            <span className="font-serif text-2xl tracking-[0.2em] text-gold">SHIRO</span>
            <p className="text-[10px] tracking-widest text-stone uppercase mt-1">UB City, Bengaluru</p>
          </div>

          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-base tracking-widest uppercase pb-1 border-b ${
                  isActive
                    ? 'text-gold border-gold font-medium'
                    : 'text-stone border-transparent'
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}

          <Link
            to="/reservation"
            className="mt-8 px-6 py-3 text-center bg-gold text-ebony font-sans text-xs uppercase tracking-widest hover:bg-gold-hover transition-all duration-300 font-semibold"
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
