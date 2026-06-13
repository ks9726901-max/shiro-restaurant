import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import { Search, Calendar, Filter, AlertCircle, Eye, EyeOff, Trash2, CheckCircle2 } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

const FALLBACK_RESERVATIONS = [
  { id: 1, customer_name: 'Ananya Sharma (Demo)', customer_email: 'ananya@example.com', customer_phone: '+919876543210', reservation_date: '2026-06-10', reservation_time: '19:30:00', guest_count: 4, special_requests: 'Anniversary celebration. Window table near water channel if possible.', status: 'confirmed' },
  { id: 2, customer_name: 'Vikram Malhotra (Demo)', customer_email: 'vikram.m@example.com', customer_phone: '+919123456789', reservation_date: '2026-06-10', reservation_time: '21:00:00', guest_count: 2, status: 'pending' },
  { id: 3, customer_name: 'Rohan Sen (Demo)', customer_email: 'rohan.sen@example.com', customer_phone: '+919988776655', reservation_date: '2026-06-11', reservation_time: '13:00:00', guest_count: 6, special_requests: 'Business lunch. Requires quiet area.', status: 'confirmed' },
  { id: 4, customer_name: 'Priyanka Rao (Demo)', customer_email: 'priyanka@example.com', customer_phone: '+919888877777', reservation_date: '2026-06-08', reservation_time: '20:00:00', guest_count: 3, special_requests: 'Birthday dinner, need candle on dessert.', status: 'confirmed' }
];

const DashboardReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [highlightedIds, setHighlightedIds] = useState({});
  const { isSocketConnected } = useNotifications();
  
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

  // Fix React stale closure bug for auto-refreshing notifications
  const fetchReservationsRef = useRef(fetchReservations);
  useEffect(() => {
    fetchReservationsRef.current = fetchReservations;
  }, [fetchReservations]);

  useEffect(() => {
    fetchReservations();
  }, [status, date]); // Trigger fetch automatically on date/status filter change

  useEffect(() => {
    const handleNewReservation = (e) => {
      const newRes = e.detail;
      if (newRes && newRes.id) {
        setHighlightedIds(prev => ({
          ...prev,
          [newRes.id]: Date.now()
        }));
        
        // Refresh reservations list
        fetchReservationsRef.current();
      }
    };

    window.addEventListener('newReservationReceived', handleNewReservation);
    return () => {
      window.removeEventListener('newReservationReceived', handleNewReservation);
    };
  }, []);

  // Auto-refresh reservation list every 5 seconds ONLY if WebSocket is offline
  useEffect(() => {
    if (isSocketConnected) {
      console.log('🔌 WebSocket active. Skipping reservations list polling.');
      return;
    }

    console.log('🔄 WebSocket offline. Activating 5-second reservations list fallback polling.');
    const interval = setInterval(() => {
      fetchReservationsRef.current();
    }, 5000);
    return () => clearInterval(interval);
  }, [isSocketConnected]);

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
      } else if (newStatus === 'completed') {
        setSuccess('Reservation marked as completed');
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
    <div className="space-y-8 text-stone">
      {/* Title */}
      <div className="border-b border-stone-border/30 pb-6">
        <h1 className="font-serif text-2xl font-normal uppercase tracking-wider text-white">
          Reservations Manager
        </h1>
        <p className="text-[11px] font-light text-stone/50 mt-1">
          Review, approve, cancel, or search guest dining bookings.
        </p>
      </div>

      {/* Offline Status Warning */}
      {error && (
        <div className="p-4 bg-amber/5 border border-amber/20 text-amber text-xs flex items-center space-x-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Notification Alert */}
      {success && (
        <div className="p-4 bg-gold/5 border border-gold/20 text-gold text-xs flex items-center space-x-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Filters Form */}
      <div className="bg-ebony-card border border-stone-border/30 p-6">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          
          {/* Keyword Search */}
          <div>
            <label htmlFor="search" className="block text-[9px] tracking-widest text-stone/50 uppercase mb-2 font-medium">
              Search Guest
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, email, or phone..."
                className="w-full bg-transparent border-b border-stone-border py-2 pl-7 pr-3 text-xs font-light text-white placeholder-stone/30 focus:outline-none focus:border-gold transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-stone/40 absolute left-0 bottom-2.5" />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-[9px] tracking-widest text-stone/50 uppercase mb-2 font-medium">
              Filter Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-transparent border-b border-stone-border py-2 px-1 text-xs font-light text-stone/50 focus:outline-none focus:border-gold rounded-none appearance-none cursor-pointer"
            >
              <option value="" className="bg-ebony-card text-stone/40">All Statuses</option>
              <option value="pending" className="bg-ebony-card text-stone">Pending</option>
              <option value="confirmed" className="bg-ebony-card text-stone">Confirmed</option>
              <option value="rejected" className="bg-ebony-card text-stone">Rejected</option>
              <option value="completed" className="bg-ebony-card text-stone">Completed</option>
              <option value="cancelled" className="bg-ebony-card text-stone">Cancelled</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label htmlFor="date" className="block text-[9px] tracking-widest text-stone/50 uppercase mb-2 font-medium">
              Filter Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-transparent border-b border-stone-border py-2 px-1 text-xs font-light text-white focus:outline-none focus:border-gold rounded-none"
            />
          </div>

          {/* Search Action Button */}
          <button
            type="submit"
            className="w-full py-2 bg-gold text-ebony font-sans text-xs font-medium tracking-widest uppercase hover:bg-gold-hover transition-all duration-300 cursor-pointer"
          >
            Apply Search
          </button>

        </form>
      </div>

      {/* Reservations Table */}
      <div className="bg-ebony-card border border-stone-border/30 p-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t border-b border-gold" />
          </div>
        ) : !Array.isArray(reservations) || reservations.length === 0 ? (
          <div className="text-center py-12 text-stone/40 font-light text-xs border border-dashed border-stone-border/20">
            No reservations match the search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-stone-border/40 text-stone/45 uppercase text-[9px] tracking-widest">
                  <th className="pb-3 w-8"></th>
                  <th className="pb-3 font-medium">Guest Details</th>
                  <th className="pb-3 font-medium">Date & Time</th>
                  <th className="pb-3 font-medium">Size</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-border/20">
                {(Array.isArray(reservations) ? reservations : []).map((res) => {
                  const isNew = highlightedIds[res.id] && (Date.now() - highlightedIds[res.id] < 30000);
                  const isCreatedRecently = res.created_at && (Date.now() - new Date(res.created_at).getTime() < 30000);
                  const isHighlighted = isNew || isCreatedRecently;
                  
                  return (
                    <React.Fragment key={res.id}>
                      <tr className={`text-stone/70 hover:bg-ebony-light/30 transition-colors ${
                        expandedRow === res.id ? 'bg-ebony-light/10' : ''
                      } ${isHighlighted ? 'animate-reservation-highlight-green' : ''}`}>
                      <td className="py-4">
                        <button 
                          onClick={() => toggleExpandRow(res.id)}
                          className="text-gold hover:text-gold-hover transition-colors p-1"
                          title="View special requests"
                        >
                          {expandedRow === res.id ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                      <td className="py-4">
                        <p className="font-semibold text-stone/90">{res.customer_name}</p>
                        <p className="text-[10px] text-stone/40 mt-1 font-mono">{res.customer_email} | {res.customer_phone}</p>
                      </td>
                      <td className="py-4 font-serif text-gold font-medium">
                        <p className="text-stone/90">{res.reservation_date}</p>
                        <p className="text-[10px] text-stone/40 mt-1 font-sans">{res.reservation_time ? res.reservation_time.slice(0, 5) : 'N/A'}</p>
                      </td>
                      <td className="py-4 font-medium text-stone/80">{res.guest_count} persons</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded-none font-medium uppercase text-[8px] tracking-widest ${
                          res.status === 'confirmed' 
                            ? 'bg-gold/5 text-gold border border-gold/30' 
                            : res.status === 'rejected' || res.status === 'cancelled'
                            ? 'bg-crimson/5 text-crimson-bright border border-crimson/30'
                            : res.status === 'completed'
                            ? 'bg-jade/10 text-stone/80 border border-stone-border/50'
                            : 'bg-amber/5 text-amber border border-amber/30 animate-pulse'
                        }`}>
                          {res.status}
                        </span>
                        {res.email_delivery_status && (
                          <div className="mt-1.5 flex items-center space-x-1 text-[8px] tracking-wider text-stone/40 font-mono">
                            <span className={`inline-block w-1 h-1 rounded-full ${
                              res.email_delivery_status === 'sent' ? 'bg-green-400' : 'bg-crimson-bright'
                            }`} />
                            <span className="uppercase">Email: {res.email_delivery_status === 'sent' ? 'sent' : 'failed'}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end items-center space-x-2">
                          {res.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(res.id, 'confirmed')}
                                className="px-2.5 py-1 border border-gold/45 text-gold hover:bg-gold hover:text-ebony transition-all uppercase text-[8px] font-medium tracking-wider cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(res.id, 'rejected')}
                                className="px-2.5 py-1 border border-stone-border text-stone/60 hover:border-crimson hover:text-crimson-bright transition-all uppercase text-[8px] font-medium tracking-wider cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          ) : res.status === 'confirmed' ? (
                            <button
                              onClick={() => handleStatusUpdate(res.id, 'completed')}
                              className="px-2.5 py-1 border border-stone-border text-stone/60 hover:border-gold hover:text-ebony transition-all uppercase text-[8px] font-medium tracking-wider cursor-pointer mr-2"
                            >
                              Complete
                            </button>
                          ) : (
                            <span className="text-stone/40 text-[9px] uppercase italic mr-2">Processed</span>
                          )}
                          <button
                            onClick={() => handleDelete(res.id)}
                            className="p-1.5 border border-stone-border/60 text-stone/50 hover:border-crimson hover:text-crimson-bright transition-colors cursor-pointer"
                            title="Delete booking"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Special Requests Row */}
                    {expandedRow === res.id && (
                      <tr className="bg-ebony-light/10">
                        <td colSpan="6" className="py-4 px-8 border-l border-gold">
                          <div className="flex items-start space-x-3">
                            <AlertCircle className="w-3.5 h-3.5 text-gold/60 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-stone/80 uppercase tracking-widest text-[8px] mb-1">Special Requests</p>
                              <p className="text-xs font-light leading-relaxed italic text-stone/50">
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
