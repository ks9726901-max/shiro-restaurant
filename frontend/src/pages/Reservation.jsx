import React, { useState } from 'react';
import api from '../utils/api';
import Modal from '../components/Modal';
import { Calendar, Users, Clock, CheckCircle } from 'lucide-react';

const TIME_SLOTS = [
  // Lunch
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  // Dinner
  '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'
];

const Reservation = () => {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    reservation_date: '',
    reservation_time: '',
    guest_count: 2,
    special_requests: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successModal, setSuccessModal] = useState(false);
  const [bookedDetails, setBookedDetails] = useState(null);

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Quick validations
    if (!formData.customer_name || !formData.customer_email || !formData.customer_phone || !formData.reservation_date || !formData.reservation_time) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    const reservationsUrl = api.defaults.baseURL ? `${api.defaults.baseURL}/reservations` : '/api/reservations';
    
    try {
      console.log(`[API Request] URL: ${reservationsUrl}`);
      console.log('Payload:', formData);
      
      const response = await api.post('/reservations', formData);
      
      console.log(`[API Response] URL: ${reservationsUrl}`);
      console.log('Status:', response.status);
      console.log('Body:', response.data);
      
      setBookedDetails(response.data);
      setSuccessModal(true);
      // Reset form
      setFormData({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        reservation_date: '',
        reservation_time: '',
        guest_count: 2,
        special_requests: ''
      });
    } catch (err) {
      console.warn('Reservation submission API failed. Running in fallback demo mode.', err);
      
      console.log(`[API Failure] URL: ${reservationsUrl}`);
      if (err.response) {
        console.log('Status:', err.response.status);
        console.log('Body:', err.response.data);
      } else {
        console.log('Status: Offline or Network Error');
        console.log('Body/Message:', err.message);
      }
      
      // Fallback: Save reservation in localStorage
      const newReservation = {
        id: Math.floor(Math.random() * 100000) + 1,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        reservation_date: formData.reservation_date,
        reservation_time: formData.reservation_time,
        guest_count: formData.guest_count,
        special_requests: formData.special_requests,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      
      try {
        const existingRaw = localStorage.getItem('reservations');
        let existingReservations = [];
        if (existingRaw) {
          existingReservations = JSON.parse(existingRaw);
          if (!Array.isArray(existingReservations)) {
            existingReservations = [];
          }
        }
        localStorage.setItem(
          'reservations',
          JSON.stringify([...existingReservations, newReservation])
        );
        console.log('Saved reservation locally in browser localStorage (Demo Mode).');
      } catch (storageErr) {
        console.error('Failed to save reservation to localStorage:', storageErr);
      }
      
      // Show success modal with local details
      setBookedDetails(newReservation);
      setSuccessModal(true);
      // Reset form
      setFormData({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        reservation_date: '',
        reservation_time: '',
        guest_count: 2,
        special_requests: ''
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-ebony min-h-screen pt-32 pb-24 text-stone">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[9px] tracking-[0.4em] text-gold uppercase font-medium block mb-3">Table Reservations</span>
          <h1 className="text-4xl md:text-5xl font-serif font-light text-white tracking-wide mt-2 mb-4">
            Book A Table
          </h1>
          <div className="w-12 h-[1px] bg-gold/40 mx-auto mb-4" />
          <p className="text-xs font-light text-stone/60 leading-relaxed">
            Due to our high popularity, we recommend booking in advance. For special celebrations or customized teppanyaki bookings, please notify us below.
          </p>
        </div>

        {/* Main Grid: Form & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Booking Guidelines / Info Panel (Brochure Style) */}
          <div className="lg:col-span-4 bg-ebony-card border border-stone-border/30 p-8 flex flex-col space-y-8">
            <h3 className="font-serif text-xs font-semibold text-gold uppercase tracking-[0.25em]">
              Dining Policies
            </h3>
            
            <div className="space-y-6 text-xs font-light leading-relaxed text-stone/70">
              <div className="border-l border-gold/40 pl-4 py-0.5">
                <p className="font-medium text-stone/90 uppercase tracking-widest text-[9px] mb-1">Confirmation</p>
                <p className="text-stone/60">All online bookings are received as pending and confirmed by our host via SMS/email within 30 minutes.</p>
              </div>

              <div className="border-l border-gold/40 pl-4 py-0.5">
                <p className="font-medium text-stone/90 uppercase tracking-widest text-[9px] mb-1">Dress Code</p>
                <p className="text-stone/60">Smart casual. Sleeveless shirts, open sandals (men), and active athletic apparel are discouraged.</p>
              </div>

              <div className="border-l border-gold/40 pl-4 py-0.5">
                <p className="font-medium text-stone/90 uppercase tracking-widest text-[9px] mb-1">Grace Period</p>
                <p className="text-stone/60">Reservations are held for 15 minutes past the scheduled time before releasing the table to walk-ins.</p>
              </div>

              <div className="border-l border-gold/40 pl-4 py-0.5">
                <p className="font-medium text-stone/90 uppercase tracking-widest text-[9px] mb-1">Large Parties</p>
                <p className="text-stone/60">For bookings exceeding 10 guests, please contact our guest relation manager directly at +91 80 4173 8888.</p>
              </div>
            </div>
          </div>

          {/* Reservation Form (Underline Only Inputs) */}
          <div className="lg:col-span-8 bg-ebony-card border border-stone-border/30 p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {error && (
                <div className="p-4 bg-crimson/10 border border-crimson/30 text-crimson text-xs font-light">
                  {error}
                </div>
              )}

              {/* Guest Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="customer_name" className="block text-[9px] tracking-widest text-stone/50 uppercase mb-1 font-medium">
                    Full Name <span className="text-gold">*</span>
                  </label>
                  <input
                    type="text"
                    id="customer_name"
                    name="customer_name"
                    required
                    value={formData.customer_name}
                    onChange={handleInputChange}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full bg-transparent border-b border-stone-border/60 py-2.5 text-xs font-light text-white placeholder-stone/30 focus:outline-none focus:border-gold transition-colors duration-300 rounded-none"
                  />
                </div>

                <div>
                  <label htmlFor="customer_phone" className="block text-[9px] tracking-widest text-stone/50 uppercase mb-1 font-medium">
                    Phone Number <span className="text-gold">*</span>
                  </label>
                  <input
                    type="tel"
                    id="customer_phone"
                    name="customer_phone"
                    required
                    value={formData.customer_phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-transparent border-b border-stone-border/60 py-2.5 text-xs font-light text-white placeholder-stone/30 focus:outline-none focus:border-gold transition-colors duration-300 rounded-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="customer_email" className="block text-[9px] tracking-widest text-stone/50 uppercase mb-1 font-medium">
                  Email Address <span className="text-gold">*</span>
                </label>
                <input
                  type="email"
                  id="customer_email"
                  name="customer_email"
                  required
                  value={formData.customer_email}
                  onChange={handleInputChange}
                  placeholder="e.g. vikram@example.com"
                  className="w-full bg-transparent border-b border-stone-border/60 py-2.5 text-xs font-light text-white placeholder-stone/30 focus:outline-none focus:border-gold transition-colors duration-300 rounded-none"
                />
              </div>

              {/* Date, Time, Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div>
                  <label htmlFor="reservation_date" className="block text-[9px] tracking-widest text-stone/50 uppercase mb-1 font-medium">
                    Date <span className="text-gold">*</span>
                  </label>
                  <input
                    type="date"
                    id="reservation_date"
                    name="reservation_date"
                    required
                    min={today}
                    value={formData.reservation_date}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-stone-border/60 py-2 px-1 text-xs font-light text-white focus:outline-none focus:border-gold transition-colors duration-300 rounded-none appearance-none"
                  />
                </div>

                <div>
                  <label htmlFor="reservation_time" className="block text-[9px] tracking-widest text-stone/50 uppercase mb-1 font-medium">
                    Time Slot <span className="text-gold">*</span>
                  </label>
                  <select
                    id="reservation_time"
                    name="reservation_time"
                    required
                    value={formData.reservation_time}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-stone-border/60 py-2 text-xs font-light text-stone/50 focus:outline-none focus:border-gold transition-colors duration-300 rounded-none appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-ebony-card text-stone/40">Select Time</option>
                    {TIME_SLOTS.map((time) => (
                      <option key={time} value={time} className="bg-ebony-card text-stone">{time}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="guest_count" className="block text-[9px] tracking-widest text-stone/50 uppercase mb-1 font-medium">
                    Guests <span className="text-gold">*</span>
                  </label>
                  <input
                    type="number"
                    id="guest_count"
                    name="guest_count"
                    required
                    min="1"
                    max="10"
                    value={formData.guest_count}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-stone-border/60 py-2 text-xs font-light text-white focus:outline-none focus:border-gold transition-colors duration-300 rounded-none"
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label htmlFor="special_requests" className="block text-[9px] tracking-widest text-stone/50 uppercase mb-1">
                  Special Requests / Dietary Notes
                </label>
                <textarea
                  id="special_requests"
                  name="special_requests"
                  rows="3"
                  value={formData.special_requests}
                  onChange={handleInputChange}
                  placeholder="Anniversary celebration, gluten allergies, or live teppanyaki preferences..."
                  className="w-full bg-transparent border-b border-stone-border/60 py-2.5 text-xs font-light text-white placeholder-stone/30 focus:outline-none focus:border-gold transition-colors duration-300 resize-none rounded-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gold text-ebony font-sans text-xs font-medium tracking-widest uppercase hover:bg-gold-hover transition-all duration-300 disabled:bg-stone-border/50 disabled:text-stone/40 shadow-md cursor-pointer"
              >
                {loading ? 'Processing booking...' : 'Request Reservation'}
              </button>

            </form>
          </div>

        </div>

      </div>

      {/* Success Modal */}
      {bookedDetails && (
        <Modal 
          isOpen={successModal} 
          onClose={() => setSuccessModal(false)}
          title="Booking Request Submitted"
        >
          <div className="flex flex-col items-center text-center space-y-5 py-4">
            <CheckCircle className="w-12 h-12 text-gold/80" />
            
            <h4 className="font-serif text-lg font-normal text-white uppercase tracking-wider">
              Thank You, {bookedDetails.customer_name}
            </h4>
            
            <p className="text-xs leading-relaxed text-stone/60 max-w-sm">
              Your dining request has been registered. Our host will confirm your booking details shortly.
            </p>

            <div className="w-full bg-ebony/60 border border-stone-border/40 p-5 text-left font-sans text-xs space-y-3 my-4">
              <div className="flex justify-between border-b border-stone-border/20 pb-2">
                <span className="text-stone/50">Booking ID</span>
                <span className="font-medium text-white font-mono">#SHR-{bookedDetails.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone/50">Date</span>
                <span className="text-gold font-mono">{bookedDetails.reservation_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone/50">Time Slot</span>
                <span className="text-gold font-mono">{bookedDetails.reservation_time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone/50">Party Size</span>
                <span className="text-white">{bookedDetails.guest_count} Persons</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-stone-border/20">
                <span className="text-stone/50">Status</span>
                <span className="px-2 py-0.5 bg-gold/5 text-gold border border-gold/30 uppercase font-mono text-[9px] tracking-wider">
                  {bookedDetails.status}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSuccessModal(false)}
              className="px-8 py-3 bg-gold text-ebony font-sans text-xs uppercase tracking-widest hover:bg-gold-hover transition-all duration-300 font-medium cursor-pointer"
            >
              Done
            </button>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default Reservation;
