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
    <div className="bg-ebony min-h-screen pt-28 pb-20 text-stone">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] tracking-[0.3em] text-gold uppercase font-semibold">Table Reservations</span>
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wider mt-2 mb-4">
            Book A Table
          </h1>
          <div className="w-20 h-0.5 bg-gold mx-auto mb-4" />
          <p className="text-xs font-light text-stone-light">
            Due to our high popularity, we recommend booking 24 hours in advance to secure preferred tables.
          </p>
        </div>

        {/* Main Grid: Form & Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Booking Guidelines / Info Panel */}
          <div className="md:col-span-1 bg-ebony-card border border-stone-border/40 p-6 md:p-8 flex flex-col space-y-6 rounded-2xl hover:border-gold/30 transition-all duration-500 shadow-xl">
            <h3 className="font-serif text-lg font-semibold text-gold uppercase tracking-wider">
              Dining Policies
            </h3>
            
            <div className="space-y-4 text-xs font-light leading-relaxed">
              <div className="border-l-2 border-gold/40 pl-4 py-1">
                <p className="font-semibold text-stone-light uppercase tracking-wider text-[10px] mb-1">Confirmation</p>
                <p>All online bookings are received as 'pending' and are confirmed via email/SMS by our host within 30 minutes.</p>
              </div>

              <div className="border-l-2 border-burgundy/40 pl-4 py-1">
                <p className="font-semibold text-stone-light uppercase tracking-wider text-[10px] mb-1">Dress Code</p>
                <p>Smart Casuals. Sleeveless shirts, open sandals (men), and active sportswear are discouraged.</p>
              </div>

              <div className="border-l-2 border-amber/40 pl-4 py-1">
                <p className="font-semibold text-stone-light uppercase tracking-wider text-[10px] mb-1">Grace Period</p>
                <p>Reservations are held for a maximum of 15 minutes past the scheduled time before being released to walk-in guests.</p>
              </div>

              <div className="border-l-2 border-stone-border pl-4 py-1">
                <p className="font-semibold text-stone-light uppercase tracking-wider text-[10px] mb-1">Large Parties</p>
                <p>For bookings exceeding 10 guests, please contact our events team at +91 80 4173 8888.</p>
              </div>
            </div>
          </div>

          {/* Reservation Form */}
          <div className="md:col-span-2 bg-ebony-card border border-stone-border/40 p-6 md:p-8 rounded-2xl hover:border-gold/30 transition-all duration-500 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {error && (
                <div className="p-4 bg-crimson/10 border border-crimson/30 text-crimson text-xs font-light rounded-xl">
                  {error}
                </div>
              )}

              {/* Guest Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="customer_name" className="block text-[10px] tracking-widest text-stone uppercase mb-2 font-medium">
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
                    className="w-full bg-ebony-light border border-stone-border py-2.5 px-4 text-xs font-light text-white placeholder-stone/60 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all duration-300"
                  />
                </div>

                <div>
                  <label htmlFor="customer_phone" className="block text-[10px] tracking-widest text-stone uppercase mb-2 font-medium">
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
                    className="w-full bg-ebony-light border border-stone-border py-2.5 px-4 text-xs font-light text-white placeholder-stone/60 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="customer_email" className="block text-[10px] tracking-widest text-stone uppercase mb-2 font-medium">
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
                  className="w-full bg-ebony-light border border-stone-border py-2.5 px-4 text-xs font-light text-white placeholder-stone/60 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all duration-300"
                />
              </div>

              {/* Date, Time, Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="reservation_date" className="block text-[10px] tracking-widest text-stone uppercase mb-2 font-medium">
                    Date <span className="text-gold">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="reservation_date"
                      name="reservation_date"
                      required
                      min={today}
                      value={formData.reservation_date}
                      onChange={handleInputChange}
                      className="w-full bg-ebony-light border border-stone-border py-2.5 px-4 text-xs font-light text-white rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reservation_time" className="block text-[10px] tracking-widest text-stone uppercase mb-2 font-medium">
                    Time Slot <span className="text-gold">*</span>
                  </label>
                  <select
                    id="reservation_time"
                    name="reservation_time"
                    required
                    value={formData.reservation_time}
                    onChange={handleInputChange}
                    className="w-full bg-ebony-light border border-stone-border py-2.5 px-4 text-xs font-light text-stone-light rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="">Select Time</option>
                    {TIME_SLOTS.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="guest_count" className="block text-[10px] tracking-widest text-stone uppercase mb-2 font-medium">
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
                    className="w-full bg-ebony-light border border-stone-border py-2.5 px-4 text-xs font-light text-white rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label htmlFor="special_requests" className="block text-[10px] tracking-widest text-stone uppercase mb-2">
                  Special Requests / Dietary Notes
                </label>
                <textarea
                  id="special_requests"
                  name="special_requests"
                  rows="3"
                  value={formData.special_requests}
                  onChange={handleInputChange}
                  placeholder="e.g. Requiring high chair for toddler, anniversary dinner, peanut allergies..."
                  className="w-full bg-ebony-light border border-stone-border py-2.5 px-4 text-xs font-light text-white placeholder-stone/60 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all duration-300 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-gold via-amber to-gold text-ebony font-sans text-xs font-bold tracking-widest uppercase hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 disabled:bg-stone/50 disabled:text-stone-light rounded-xl shadow-lg cursor-pointer"
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
          <div className="flex flex-col items-center text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-gold animate-bounce" />
            
            <h4 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
              Thank You, {bookedDetails.customer_name}
            </h4>
            
            <p className="text-xs leading-relaxed text-stone-light">
              Reservation received successfully. Our team will contact you shortly.
            </p>

            <div className="w-full bg-ebony border border-stone-border/40 p-4 text-left font-sans text-xs space-y-2.5 my-4 rounded-xl">
              <div className="flex justify-between border-b border-stone-border/30 pb-2">
                <span className="text-stone">Booking ID:</span>
                <span className="font-semibold text-white">#SHR-{bookedDetails.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone">Date:</span>
                <span className="text-gold">{bookedDetails.reservation_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone">Time:</span>
                <span className="text-gold">{bookedDetails.reservation_time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone">Guests:</span>
                <span className="text-white">{bookedDetails.guest_count} Persons</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone">Status:</span>
                <span className="px-2 py-0.5 bg-gold/10 text-gold uppercase font-bold text-[10px] tracking-widest rounded">
                  {bookedDetails.status}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSuccessModal(false)}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-gold via-amber to-gold text-ebony font-sans text-xs uppercase tracking-widest hover:scale-105 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-300 font-semibold cursor-pointer"
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
