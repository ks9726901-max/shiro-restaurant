import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

const DashboardNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-burgundy/15 border border-burgundy/30 flex items-center justify-center text-red-500 animate-pulse">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <div>
        <h2 className="font-serif text-2xl font-bold uppercase tracking-wider text-white">
          Page Not Found
        </h2>
        <p className="text-xs text-stone mt-2 max-w-sm mx-auto leading-relaxed">
          The dashboard reports, configuration, or utility page you are looking for does not exist or has been relocated.
        </p>
      </div>
      <Link
        to="/dashboard"
        className="inline-flex items-center space-x-2 px-6 py-3 bg-gold text-ebony font-sans text-xs font-bold tracking-widest uppercase hover:bg-gold-hover transition-all duration-300 shadow-lg"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back To Overview</span>
      </Link>
    </div>
  );
};

export default DashboardNotFound;
