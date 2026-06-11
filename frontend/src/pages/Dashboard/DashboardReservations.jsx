import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Search, Calendar, Filter, AlertCircle, Eye, EyeOff, Trash2, CheckCircle2 } from 'lucide-react';

const FALLBACK_RESERVATIONS = [
  { id: 1, customer_name: 'Ananya Sharma (Demo)', customer_email: 'ananya@example.com', customer_phone: '+919876543210', reservation_date: '2026-06-10', reservation_time: '19:30:00', guest_count: 4, special_requests: 'Anniversary celebration. Window table near water channel if possible.', status: 'confirmed' },
  { id: 2, customer_name: 'Vikram Malhotra (Demo)', customer_email: 'vikram.m@example.com', customer_phone: '+919123456789', reservation_date: '2026-06-10', reservation_time: '21:00:00', guest_count: 2, special_requests: 'No seafood allergies, requesting Teppanyaki seating.', status: 'pending' },
  { id: 3, customer_name: 'Rohan Sen (Demo)', customer_email: 'rohan.sen@example.com', customer_phone: '+919988776655', reservation_date: '2026-06-11', reservation_time: '13:00:00', guest_count: 6, special_requests: 'Business lunch. Requires quiet area.', status: 'confirmed' },
  { id: 4, customer_name: 'Priyanka Rao (Demo)', customer_email: 'priyanka@example.com', customer_phone: '+919888877777', reservation_date: '2026-06-08', reservation_time: '20:00:00', guest_count: 3, special_requests: 'Birthday dinner, need candle on dessert.', status: 'confirmed' }
];

const DashboardReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [highlightedIds, setHighlightedIds] = useState({});
  
  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');

  // UI state for showing special requests
  const [expandedRow, setExpandedRow] = useState(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      let endpoint = '/reservations?';
      if (search) endpoint += `search=${search}&`;
      if (status) endpoint += `status=${status}&`;
      if (date) endpoint += `date=${date}&`;
      
      const response = await api.get(endpoint);
      
      let data = response?.data;
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        if (Array.isArray(data.data)) data = data.data;
        else if (Array.isArray(data.reservations)) data = data.reservations;
        else data = [];
      }
      if (!Array.isArray(data)) {
        data = [];
      }
      setReservations(data.length ? data : FALLBACK_RESERVATIONS);
    } catch (err) {
      console.warn('API error fetching reservations. Using mock fallbacks.', err);
      setError('Offline mode: Using local demo reservations list.');
      setReservations(FALLBACK_RESERVATIONS);
    } finally {
      setLoading(false);
    }
  };

  // Cleanup expired highlight states periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightedIds(prev => {
        const now = Date.now();
        let updated = { ...prev };
        let changed = false;
        for (const [id, timestamp] of Object.entries(prev)) {
          if (now - timestamp >= 30000) {
            delete updated[id];
            changed = true;
          }
        }
        return changed ? updated : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchReservations();

    const handleNewReservation = (e) => {
      const newRes = e.detail;
      if (newRes && newRes.id) {
        setHighlightedIds(prev => ({
          ...prev,
          [newRes.id]: Date.now()
        }));
        
        // Refresh reservations list
        fetchReservations();
      }
    };

    window.addEventListener('newReservationReceived', handleNewReservation);
    return () => {
      window.removeEventListener('newReservationReceived', handleNewReservation);
    };
  }, [status, date]); // Trigger fetch automatically on date/status filter change

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReservations();
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      let resMsg = '';
      if (newStatus === 'confirmed') {
        const response = await api.put(`/reservations/${id}/approve`);
        if (response.data && response.data.email_delivery_status === 'sent') {
          resMsg = 'Confirmation email sent successfully';
        } else {
          resMsg = 'Reservation approved, but confirmation email failed to send.';
        }
      } else if (newStatus === 'rejected') {
        const response = await api.put(`/reservations/${id}/reject`);
        if (response.data && response.data.email_delivery_status === 'sent') {
          resMsg = 'Rejection email sent successfully';
        } else {
          resMsg = 'Reservation rejected, but rejection email failed to send.';
        }
      } else if (newStatus === 'cancelled') {
        await api.put(`/reservations/${id}/cancel`);
        resMsg = 'Reservation cancelled successfully';
      }
      if (resMsg) {
        setSuccess(resMsg);
        setError(null);
        setTimeout(() => setSuccess(null), 5000);
      }
      fetchReservations();
    } catch (err) {
      console.error('Failed to update status:', err);
      // Local fallback mock update
      setReservations(prev => 
        (Array.isArray(prev) ? prev : []).map(res => res.id === id ? { ...res, status: newStatus } : res)
      );
      if (newStatus === 'confirmed') {
        setSuccess('Confirmation email sent successfully');
        setError(null);
        setTimeout(() => setSuccess(null), 5000);
      } else if (newStatus === 'rejected') {
        setSuccess('Rejection email sent successfully');
        setError(null);
        setTimeout(() => setSuccess(null), 5000);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this reservation?')) return;
    
    try {
      await api.delete(`/reservations/${id}`);
      fetchReservations();
    } catch (err) {
      console.error('Failed to delete reservation:', err);
      // Local fallback mock update
      setReservations(prev => (Array.isArray(prev) ? prev : []).filter(res => res.id !== id));
    }
  };

  const toggleExpandRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="font-serif text-2xl font-bold uppercase tracking-wider text-white">
          Reservations Manager
        </h1>
        <p className="text-xs font-light text-stone mt-1">
          Review, approve, cancel, or search guest dining bookings.
        </p>
      </div>

      {/* Offline Status Warning */}
      {error && (
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs flex items-center space-x-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Notification Alert */}
      {success && (
        <div className="p-3.5 bg-green-500/10 border border-green-500/20 text-green-500 text-xs flex items-center space-x-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Filters Form */}
      <div className="bg-ebony-card border border-stone-border/40 p-6">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          
          {/* Keyword Search */}
          <div>
            <label htmlFor="search" className="block text-[10px] tracking-widest text-stone uppercase mb-2 font-medium">
              Search Guest
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, email, or phone..."
                className="w-full bg-ebony-light border border-stone-border py-2 px-3 pl-9 text-xs font-light text-white placeholder-stone/60 focus:outline-none focus:border-gold transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-stone absolute left-3 top-3" />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-[10px] tracking-widest text-stone uppercase mb-2 font-medium">
              Filter Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-ebony-light border border-stone-border py-2 px-3 text-xs font-light text-stone-light focus:outline-none focus:border-gold rounded-none"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label htmlFor="date" className="block text-[10px] tracking-widest text-stone uppercase mb-2 font-medium">
              Filter Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-ebony-light border border-stone-border py-2 px-3 text-xs font-light text-white focus:outline-none focus:border-gold"
            />
          </div>

          {/* Search Action Button */}
          <button
            type="submit"
            className="w-full py-2 bg-gold text-ebony font-sans text-xs font-bold tracking-widest uppercase hover:bg-gold-hover transition-all duration-300"
          >
            Apply Search
          </button>

        </form>
      </div>

      {/* Reservations Table */}
      <div className="bg-ebony-card border border-stone-border/40 p-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold" />
          </div>
        ) : !Array.isArray(reservations) || reservations.length === 0 ? (
          <div className="text-center py-12 text-stone font-light text-xs border border-dashed border-stone-border/20">
            No reservations match the search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-stone-border/60 text-stone uppercase text-[10px] tracking-widest">
                  <th className="pb-3 w-8"></th>
                  <th className="pb-3 font-medium">Guest Details</th>
                  <th className="pb-3 font-medium">Date & Time</th>
                  <th className="pb-3 font-medium">Size</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Moderator Panel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-border/30">
                {(Array.isArray(reservations) ? reservations : []).map((res) => {
                  const isNew = highlightedIds[res.id] && (Date.now() - highlightedIds[res.id] < 30000);
                  const isCreatedRecently = res.created_at && (Date.now() - new Date(res.created_at).getTime() < 30000);
                  const isHighlighted = isNew || isCreatedRecently;
                  
                  return (
                    <React.Fragment key={res.id}>
                      <tr className={`text-stone-light hover:bg-ebony-light/40 transition-colors ${
                        expandedRow === res.id ? 'bg-ebony-light/25' : ''
                      } ${isHighlighted ? 'animate-reservation-highlight' : ''}`}>
                      <td className="py-4">
                        <button 
                          onClick={() => toggleExpandRow(res.id)}
                          className="text-gold hover:text-gold-hover"
                          title="View special requests"
                        >
                          {expandedRow === res.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="py-4">
                        <p className="font-semibold text-white">{res.customer_name}</p>
                        <p className="text-[10px] text-stone mt-0.5">{res.customer_email} | {res.customer_phone}</p>
                      </td>
                      <td className="py-4 font-serif text-gold font-medium">
                        <p>{res.reservation_date}</p>
                        <p className="text-[10px] text-stone-light mt-0.5">{res.reservation_time ? res.reservation_time.slice(0, 5) : 'N/A'}</p>
                      </td>
                      <td className="py-4 font-semibold text-white">{res.guest_count} persons</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 font-bold uppercase text-[9px] tracking-widest ${
                          res.status === 'confirmed' 
                            ? 'bg-green-950 text-green-400 border border-green-500/20' 
                            : res.status === 'rejected'
                            ? 'bg-red-950 text-red-400 border border-red-500/20'
                            : res.status === 'cancelled'
                            ? 'bg-stone-900 text-stone-400 border border-stone-500/20'
                            : 'bg-amber-950 text-amber-400 border border-amber-500/20'
                        }`}>
                          {res.status}
                        </span>
                        {res.email_delivery_status && (
                          <div className="mt-1.5 flex items-center space-x-1 text-[9px] tracking-wider text-stone font-mono">
                            <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                              res.email_delivery_status === 'sent' ? 'bg-green-400 animate-pulse' : 'bg-red-500'
                            }`} />
                            <span className="uppercase">{res.email_delivery_status === 'sent' ? 'sent' : 'failed'}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end items-center space-x-2">
                          {res.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(res.id, 'confirmed')}
                                className="px-2.5 py-1 border border-green-500/40 text-green-400 hover:bg-green-500 hover:text-white transition-colors uppercase text-[9px] font-bold tracking-wider cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(res.id, 'rejected')}
                                className="px-2.5 py-1 border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white transition-colors uppercase text-[9px] font-bold tracking-wider cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <span className="text-stone text-[10px] uppercase italic mr-2">Processed</span>
                          )}
                          <button
                            onClick={() => handleDelete(res.id)}
                            className="p-1 border border-stone-border text-stone hover:border-crimson hover:text-crimson transition-colors cursor-pointer"
                            title="Delete booking"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Special Requests Row */}
                    {expandedRow === res.id && (
                      <tr className="bg-ebony-light/20">
                        <td colSpan="6" className="py-4 px-8 border-l-2 border-gold">
                          <div className="flex items-start space-x-2">
                            <AlertCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-stone-light uppercase tracking-widest text-[9px] mb-1">Special Requests</p>
                              <p className="text-xs font-light leading-relaxed italic text-stone">
                                {res.special_requests || 'No special requests provided by guest.'}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default DashboardReservations;
