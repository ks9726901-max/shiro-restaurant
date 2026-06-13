import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Phone, Mail, Clock, Navigation, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';

const GoogleMapSection = ({ isLarge = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Intersection Observer for scroll-triggered viewport fade-in animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Connection timeout check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setHasError(true);
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  // Clean, standard Google Maps free embed url targeting the specified Plus Code
  const mapEmbedUrl = "https://maps.google.com/maps?q=VM7H%2BFCP%20Doddanagamangala%20Village%20Karnataka%20India&t=&z=16&ie=UTF8&iwloc=&output=embed";
  
  // Directions and Google Maps web URLs
  const directionsUrl = "https://www.google.com/maps/dir/?api=1&destination=VM7H%2BFCP,+Doddanagamangala+Village,+Karnataka,+India";
  const mapsSearchUrl = "https://www.google.com/maps/search/?api=1&query=VM7H%2BFCP,+Doddanagamangala+Village,+Karnataka,+India";

  return (
    <section 
      ref={sectionRef}
      className={`py-20 bg-ebony-card border-b border-stone-border/30 overflow-hidden transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Interactive Map with Rounded Corners (20px) and Soft Shadow */}
          <div className="lg:col-span-7 relative bg-ebony rounded-[20px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-stone-border/20 p-1 group">
            
            {/* Loading Indicator */}
            {isLoading && !hasError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-ebony/95 z-10 space-y-3 rounded-[20px]">
                <Loader2 className="w-8 h-8 text-gold animate-spin stroke-[1.5]" />
                <span className="text-[10px] tracking-widest text-stone/50 uppercase">Syncing Sanctuary Coordinates</span>
              </div>
            )}

            {/* Error fallback state */}
            {hasError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-ebony/95 z-10 p-6 text-center space-y-4 rounded-[20px]">
                <AlertCircle className="w-8 h-8 text-amber/80 stroke-[1.5]" />
                <div>
                  <h4 className="font-serif text-sm text-white uppercase tracking-wider">Map Load Timeout</h4>
                  <p className="text-[11px] font-light text-stone/50 leading-relaxed max-w-xs mt-1.5 mx-auto">
                    We're having trouble reaching Google Maps servers. You can open our coordinates or calculate directions directly.
                  </p>
                </div>
                <div className="flex space-x-4">
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 bg-gold text-ebony font-sans text-[9px] tracking-widest uppercase font-medium hover:bg-gold-hover transition-colors"
                  >
                    Get Directions
                  </a>
                  <a
                    href={mapsSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 border border-stone-border text-stone font-sans text-[9px] tracking-widest uppercase hover:text-gold hover:border-gold transition-colors"
                  >
                    Open Map
                  </a>
                </div>
              </div>
            )}

            {/* Embedded map iframe */}
            <iframe
              title="Shiro Restaurant Location Map"
              src={mapEmbedUrl}
              className={`w-full border-0 rounded-[18px] filter grayscale-[70%] invert-[90%] contrast-[95%] brightness-[90%] hue-rotate-[180deg] transition-all duration-700 group-hover:grayscale-[20%] group-hover:brightness-[95%] ${
                isLarge ? 'h-[400px] md:h-[500px]' : 'h-[320px] md:h-[420px]'
              }`}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setIsLoading(false)}
            />
          </div>

          {/* Right Column: Contact Details Card with Rounded Corners (20px) and Soft Shadow */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 bg-ebony rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-stone-border/20 p-8 md:p-10 relative">
            <div className="space-y-8">
              {/* Header */}
              <div>
                <span className="text-[9px] tracking-[0.3em] text-gold uppercase font-medium block mb-2 font-sans">Find Shiro</span>
                <h3 className="font-serif text-xl md:text-2xl font-normal text-white uppercase tracking-wider">
                  The Shiro Sanctuary
                </h3>
                <div className="w-10 h-[1px] bg-gold/40 mt-3" />
              </div>

              {/* Contact Information & Hours Details */}
              <div className="space-y-6">
                
                {/* Address */}
                <div className="flex items-start space-x-4">
                  <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5 stroke-[1.5]" />
                  <div className="space-y-1">
                    <h4 className="text-[9px] tracking-widest uppercase text-stone/40 font-medium font-sans">Address</h4>
                    <p className="text-xs font-light leading-relaxed text-stone/75">
                      VM7H+FCP, Doddanagamangala Village,<br />
                      Bengaluru South, Bengaluru,<br />
                      Karnataka 560100, India
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <Phone className="w-4 h-4 text-gold shrink-0 mt-0.5 stroke-[1.5]" />
                  <div className="space-y-1">
                    <h4 className="text-[9px] tracking-widest uppercase text-stone/40 font-medium font-sans">Reservations Hotline</h4>
                    <p className="text-xs font-mono text-stone/75">
                      +91 80 4173 8861<br />
                      +91 80 4173 8864
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <Mail className="w-4 h-4 text-gold shrink-0 mt-0.5 stroke-[1.5]" />
                  <div className="space-y-1">
                    <h4 className="text-[9px] tracking-widest uppercase text-stone/40 font-medium font-sans">Email Enquiries</h4>
                    <p className="text-xs font-light text-stone/75">
                      info@shiro-bengaluru.in
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start space-x-4">
                  <Clock className="w-4 h-4 text-gold shrink-0 mt-0.5 stroke-[1.5]" />
                  <div className="space-y-1">
                    <h4 className="text-[9px] tracking-widest uppercase text-stone/40 font-medium font-sans">Opening Hours</h4>
                    <p className="text-xs font-light text-stone/75">
                      Monday – Sunday<br />
                      12:00 PM – 12:00 AM (Midnight)
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Directions & Action Buttons */}
            <div className="pt-6 border-t border-stone-border/20 flex flex-col sm:flex-row gap-4">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 px-6 py-3.5 bg-gold text-ebony font-sans text-[10px] tracking-widest uppercase font-medium hover:bg-gold-hover transition-all duration-300 rounded-lg"
              >
                <Navigation className="w-3 h-3 fill-current" />
                <span>Get Directions</span>
              </a>
              
              <a
                href={mapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 px-6 py-3.5 bg-transparent border border-stone-border text-stone hover:text-gold hover:border-gold font-sans text-[10px] tracking-widest uppercase transition-all duration-300 rounded-lg"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open Map</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default GoogleMapSection;
