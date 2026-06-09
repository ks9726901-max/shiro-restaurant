import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-ebony border-t border-stone-border pt-16 pb-8 text-stone">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand Information */}
        <div className="flex flex-col space-y-4">
          <Link to="/" className="flex flex-col group">
            <span className="font-serif text-2xl font-bold tracking-[0.25em] text-gold group-hover:text-gold-hover transition-colors duration-300">
              SHIRO
            </span>
            <span className="text-[8px] tracking-[0.45em] text-stone font-sans uppercase mt-0.5">
              Bengaluru
            </span>
          </Link>
          <p className="text-xs leading-relaxed text-stone font-light pr-4">
            A majestic, Zen-inspired Asian Castle in UB City, merging dramatic Balinese stone art, cascading water, and pioneering Pan-Asian gastronomy.
          </p>
        </div>

        {/* Operating Hours */}
        <div className="flex flex-col space-y-4">
          <h4 className="font-serif text-sm font-semibold tracking-wider text-gold uppercase">
            Hours
          </h4>
          <ul className="space-y-3 text-xs font-light">
            <li className="flex items-start">
              <Clock className="w-4 h-4 text-gold mr-2 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-stone-light">Lunch</p>
                <p>Mon - Sun: 12:00 PM - 3:30 PM</p>
              </div>
            </li>
            <li className="flex items-start">
              <Clock className="w-4 h-4 text-gold mr-2 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-stone-light">Dinner & Lounge</p>
                <p>Mon - Thu: 7:00 PM - 11:30 PM</p>
                <p>Fri - Sun: 7:00 PM - 1:00 AM</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col space-y-4">
          <h4 className="font-serif text-sm font-semibold tracking-wider text-gold uppercase">
            Reservations
          </h4>
          <ul className="space-y-3 text-xs font-light">
            <li className="flex items-center">
              <Phone className="w-4 h-4 text-gold mr-2 shrink-0" />
              <span className="text-stone-light hover:text-gold transition-colors duration-300">
                +91 80 4173 8888
              </span>
            </li>
            <li className="flex items-center">
              <Mail className="w-4 h-4 text-gold mr-2 shrink-0" />
              <a href="mailto:info@experienceshiro.com" className="text-stone-light hover:text-gold transition-colors duration-300">
                info@experienceshiro.com
              </a>
            </li>
            <li className="flex items-start">
              <MapPin className="w-4 h-4 text-gold mr-2 shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                2nd Floor, UB City Mall, Vittal Mallya Rd, Bengaluru, Karnataka 560001
              </span>
            </li>
          </ul>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col space-y-4">
          <h4 className="font-serif text-sm font-semibold tracking-wider text-gold uppercase">
            Explore
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs font-light">
            <Link to="/" className="hover:text-gold transition-colors duration-300">Home</Link>
            <Link to="/menu" className="hover:text-gold transition-colors duration-300">Menu</Link>
            <Link to="/gallery" className="hover:text-gold transition-colors duration-300">Gallery</Link>
            <Link to="/reservation" className="hover:text-gold transition-colors duration-300">Bookings</Link>
            <Link to="/contact" className="hover:text-gold transition-colors duration-300">Contact</Link>
            <Link to="/login" className="hover:text-gold transition-colors duration-300">Staff Portal</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 border-t border-stone-border/40 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-widest uppercase">
        <p className="mb-4 md:mb-0">
          © {new Date().getFullYear()} Shiro Bengaluru. All Rights Reserved.
        </p>
        <p className="text-stone-light">
          Design inspired by <span className="text-gold">Zen Castle Grandeur</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
