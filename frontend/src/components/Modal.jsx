import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-ebony-card border border-stone-border/60 p-8 rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 max-h-[90vh] overflow-y-auto scrollbar-luxury transform scale-100 transition-all duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-stone-border/40 pb-4 mb-6">
          <h3 className="font-serif text-xs font-semibold tracking-[0.25em] text-gold uppercase">
            {title}
          </h3>
          <button 
            onClick={onClose} 
            className="text-stone/60 hover:text-gold transition-colors duration-300 p-1 hover:bg-stone-border/20"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="text-xs font-light text-stone/80 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
