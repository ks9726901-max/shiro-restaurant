import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-ebony border-t border-stone-border/30 pt-20 pb-10 text-stone/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand Information */}
        <div className="flex flex-col space-y-4 md:col-span-1">
          <Link to="/" className="flex flex-col group self-start">
            <span className="font-serif text-2xl font-normal tracking-[0.3em] text-gold group-hover:text-gold-hover transition-colors duration-300">
              SHIRO
            </span>
            <span className="text-[8px] tracking-[0.45em] text-stone/50 font-sans uppercase mt-0.5">
              Bengaluru
            </span>
          </Link>
          <p className="text-xs leading-relaxed font-light pr-4 text-stone/50">
            A majestic, Zen-inspired Asian Castle in UB City, merging dramatic Balinese stone art, cascading water, and pioneering Pan-Asian gastronomy.
          </p>
        </div>

        {/* Operating Hours */}
        <div className="flex flex-col space-y-4">
          <h4 className="font-serif text-[10px] tracking-[0.25em] text-gold uppercase font-medium">
            Hours
          </h4>
          <ul className="space-y-4 text-xs font-light">
            <li className="flex items-start">
              <Clock className="w-3.5 h-3.5 text-gold/60 mr-2 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-stone/80 uppercase tracking-widest text-[9px] mb-1">Lunch</p>
                <p className="text-stone/60 font-mono text-[11px]">Daily: 12:00 PM - 3:30 PM</p>
              </div>
            </li>
            <li className="flex items-start">
              <Clock className="w-3.5 h-3.5 text-gold/60 mr-2 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-stone/80 uppercase tracking-widest text-[9px] mb-1">Dinner & Lounge</p>
                <p className="text-stone/60 font-mono text-[11px] mb-1">Mon - Thu: 7:00 PM - 11:30 PM</p>
                <p className="text-stone/60 font-mono text-[11px]">Fri - Sun: 7:00 PM - 1:00 AM</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col space-y-4">
          <h4 className="font-serif text-[10px] tracking-[0.25em] text-gold uppercase font-medium">
            Reservations
          </h4>
          <ul className="space-y-3 text-xs font-light">
            <li className="flex items-center">
              <Phone className="w-3.5 h-3.5 text-gold/60 mr-2 shrink-0" />
              <span className="text-stone/75 hover:text-gold transition-colors duration-300 font-mono text-[11px]">
                +91 80 4173 8888
              </span>
            </li>
            <li className="flex items-center">
              <Mail className="w-3.5 h-3.5 text-gold/60 mr-2 shrink-0" />
              <a href="mailto:info@experienceshiro.com" className="text-stone/75 hover:text-gold transition-colors duration-300 font-mono text-[11px]">
                info@experienceshiro.com
              </a>
            </li>
            <li className="flex items-start">
              <MapPin className="w-3.5 h-3.5 text-gold/60 mr-2 shrink-0 mt-0.5" />
              <span className="leading-relaxed text-stone/60">
                2nd Floor, UB City Mall, Vittal Mallya Rd, Bengaluru 560001
              </span>
            </li>
          </ul>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col space-y-4">
          <h4 className="font-serif text-[10px] tracking-[0.25em] text-gold uppercase font-medium">
            Explore
          </h4>
          <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 text-[10px] tracking-widest uppercase font-light">
            <Link to="/" className="hover:text-gold transition-colors duration-300 text-stone/60">Home</Link>
            <Link to="/menu" className="hover:text-gold transition-colors duration-300 text-stone/60">Menu</Link>
            <Link to="/gallery" className="hover:text-gold transition-colors duration-300 text-stone/60">Gallery</Link>
            <Link to="/reservation" className="hover:text-gold transition-colors duration-300 text-stone/60">Bookings</Link>
            <Link to="/contact" className="hover:text-gold transition-colors duration-300 text-stone/60">Contact</Link>
            <Link to="/login" className="hover:text-gold transition-colors duration-300 text-stone/60">Staff Portal</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 border-t border-stone-border/30 flex flex-col md:flex-row justify-between items-center text-[8px] tracking-[0.25em] uppercase text-stone/40">
        <p className="mb-4 md:mb-0">
          © {new Date().getFullYear()} Shiro Bengaluru. All Rights Reserved.
        </p>
        <p className="text-stone/30">
          Crafted with <span className="text-gold/60">Zen Castle Aesthetics</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
