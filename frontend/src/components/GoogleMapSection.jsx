import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Navigation, AlertCircle, Loader2 } from 'lucide-react';

const GoogleMapSection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Set timeout to detect load failure (e.g. offline/network issues)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setHasError(true);
      }
    }, 8000); // 8 seconds timeout
    return () => clearTimeout(timer);
  }, [isLoading]);

  const mapQueryUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.9715569420557!2d77.5959922!3d12.9734149!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae16790a61fb2f%3A0xe5438ec6f4dd577d!2sShiro!5e0!3m2!1sen!2sin!4v1718300000000!5m2!1sen!2sin";
  const directionsUrl = "https://www.google.com/maps/dir/?api=1&destination=Shiro+UB+City+Bengaluru";

  return (
    <section className="py-20 bg-ebony-card border-b border-stone-border/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Map Container */}
          <div className="lg:col-span-7 relative min-h-[350px] md:min-h-[450px] bg-ebony border border-stone-border/30 p-1 group">
            {/* Visual borders */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-gold/40 z-20 pointer-events-none group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-gold/40 z-20 pointer-events-none group-hover:scale-105 transition-transform duration-300" />
            
            {/* Loading Indicator */}
            {isLoading && !hasError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-ebony/90 z-10 space-y-3">
                <Loader2 className="w-8 h-8 text-gold animate-spin stroke-[1.5]" />
                <span className="text-[10px] tracking-widest text-stone/50 uppercase">Loading Sanctuary Map</span>
              </div>
            )}

            {/* Connection Error Fallback */}
            {hasError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-ebony-card/95 border border-stone-border/40 z-10 p-6 text-center space-y-4">
                <AlertCircle className="w-8 h-8 text-amber/80 stroke-[1.5]" />
                <div>
                  <h4 className="font-serif text-sm text-white uppercase tracking-wider">Sanctuary Map Offline</h4>
                  <p className="text-[11px] font-light text-stone/50 leading-relaxed max-w-xs mt-1.5 mx-auto">
                    We are having trouble loading the interactive map. You can still view our location and get step-by-step directions on Google Maps directly.
                  </p>
                </div>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 bg-gold text-ebony font-sans text-[9px] tracking-widest uppercase font-medium hover:bg-gold-hover transition-colors"
                >
                  Open in Google Maps
                </a>
              </div>
            )}

            {/* Interactive Iframe with custom premium dark-mode styling */}
            <iframe
              title="Shiro Bengaluru UB City Location Map"
              src={mapQueryUrl}
              className="w-full h-full min-h-[340px] md:min-h-[440px] border-0 filter grayscale-[80%] invert-[90%] contrast-[95%] brightness-[90%] hue-rotate-[180deg] transition-all duration-700 group-hover:grayscale-[40%] group-hover:brightness-[95%]"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setIsLoading(false)}
            />
          </div>

          {/* Contact Details & Info Pane */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 bg-ebony border border-stone-border/30 p-8 md:p-10 relative">
            {/* Visual background details */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-stone-border/40" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-stone-border/40" />

            <div className="space-y-8">
              {/* Header */}
              <div>
                <span className="text-[9px] tracking-[0.3em] text-gold uppercase font-medium block mb-2">Find Shiro</span>
                <h3 className="font-serif text-xl font-normal text-white uppercase tracking-wider">
                  The Castle Location
                </h3>
                <div className="w-10 h-[1px] bg-gold/40 mt-3" />
              </div>

              {/* Info Rows */}
              <div className="space-y-6">
                
                {/* Row 1: Address */}
                <div className="flex items-start space-x-4">
                  <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5 stroke-[1.5]" />
                  <div className="space-y-1">
                    <h4 className="text-[9px] tracking-widest uppercase text-stone/40 font-medium">Address</h4>
                    <p className="text-xs font-light leading-relaxed text-stone/75">
                      2nd & 3rd Floor, UB City Mall,<br />
                      No. 222, Vittal Mallya Road,<br />
                      Bengaluru, Karnataka 560001
                    </p>
                  </div>
                </div>

                {/* Row 2: Phone */}
                <div className="flex items-start space-x-4">
                  <Phone className="w-4 h-4 text-gold shrink-0 mt-0.5 stroke-[1.5]" />
                  <div className="space-y-1">
                    <h4 className="text-[9px] tracking-widest uppercase text-stone/40 font-medium">Reservations & Host Desk</h4>
                    <p className="text-xs font-mono text-stone/75">
                      080-41738861<br />
                      080-41738864
                    </p>
                  </div>
                </div>

                {/* Row 3: Email */}
                <div className="flex items-start space-x-4">
                  <Mail className="w-4 h-4 text-gold shrink-0 mt-0.5 stroke-[1.5]" />
                  <div className="space-y-1">
                    <h4 className="text-[9px] tracking-widest uppercase text-stone/40 font-medium">Email Enquiries</h4>
                    <p className="text-xs font-light text-stone/75">
                      info@shiro-bengaluru.in
                    </p>
                  </div>
                </div>

                {/* Row 4: Hours */}
                <div className="flex items-start space-x-4">
                  <Clock className="w-4 h-4 text-gold shrink-0 mt-0.5 stroke-[1.5]" />
                  <div className="space-y-1">
                    <h4 className="text-[9px] tracking-widest uppercase text-stone/40 font-medium">Opening Hours</h4>
                    <p className="text-xs font-light text-stone/75">
                      Monday – Sunday<br />
                      12:00 PM – 12:00 AM (Midnight)
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-stone-border/30 flex flex-col sm:flex-row gap-4">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gold text-ebony font-sans text-[10px] tracking-widest uppercase font-medium hover:bg-gold-hover transition-all duration-300"
              >
                <Navigation className="w-3 h-3 fill-current" />
                <span>Get Directions</span>
              </a>
              <a
                href="tel:08041738861"
                className="flex items-center justify-center px-6 py-3 bg-transparent border border-stone-border text-stone hover:text-gold hover:border-gold font-sans text-[10px] tracking-widest uppercase transition-all duration-300"
              >
                Call Concierge
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default GoogleMapSection;
