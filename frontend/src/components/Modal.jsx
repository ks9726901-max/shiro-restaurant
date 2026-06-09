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
      <div className="relative w-full max-w-lg bg-ebony-card border border-stone-border p-8 rounded-none shadow-2xl z-10 max-h-[90vh] overflow-y-auto scrollbar-luxury transform scale-100 transition-all duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-stone-border pb-4 mb-6">
          <h3 className="font-serif text-lg font-bold tracking-wider text-gold uppercase">
            {title}
          </h3>
          <button 
            onClick={onClose} 
            className="text-stone hover:text-gold transition-colors duration-300"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="text-sm font-light text-stone-light">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
