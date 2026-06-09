import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { BarChart3, TrendingUp, Clock, PieChart, Users } from 'lucide-react';

const MOCK_TRENDS = [
  { date: '2026-06-03', count: 5 },
  { date: '2026-06-04', count: 8 },
  { date: '2026-06-05', count: 12 },
  { date: '2026-06-06', count: 19 },
  { date: '2026-06-07', count: 24 },
  { date: '2026-06-08', count: 15 },
  { date: '2026-06-09', count: 10 }
];

const MOCK_TIME_SLOTS = [
  { time: '12:30', count: 8 },
  { time: '13:00', count: 12 },
  { time: '19:30', count: 22 },
  { time: '20:00', count: 35 },
  { time: '20:30', count: 28 },
  { time: '21:00', count: 32 }
];

const MOCK_MENU_SPLIT = [
  { category: 'Sushi & Sashimi', count: 18 },
  { category: 'Dim Sum', count: 12 },
  { category: 'Teppanyaki & Grills', count: 10 },
  { category: 'Mains', count: 15 },
  { category: 'Craft Cocktails', count: 22 }
];

const DashboardReports = () => {
  const [trends, setTrends] = useState(MOCK_TRENDS);
  const [timeSlots, setTimeSlots] = useState(MOCK_TIME_SLOTS);
  const [menuSplit, setMenuSplit] = useState(MOCK_MENU_SPLIT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const [trendsRes, slotsRes, splitRes] = await Promise.all([
          api.get('/reports/trends'),
          api.get('/reports/time-slots'),
          api.get('/reports/menu-split')
        ]);
        
        setTrends(trendsRes.data.length ? trendsRes.data : MOCK_TRENDS);
        setTimeSlots(slotsRes.data.length ? slotsRes.data : MOCK_TIME_SLOTS);
        setMenuSplit(splitRes.data.length ? splitRes.data : MOCK_MENU_SPLIT);
      } catch (err) {
        console.warn('API error fetching reports. Rendering mock analytics.');
        setTrends(MOCK_TRENDS);
        setTimeSlots(MOCK_TIME_SLOTS);
        setMenuSplit(MOCK_MENU_SPLIT);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Calculate highest counts for chart scaling
  const maxTrendCount = Math.max(...trends.map(t => t.count), 1);
  const maxSlotCount = Math.max(...timeSlots.map(s => s.count), 1);
  const maxMenuCount = Math.max(...menuSplit.map(m => m.count), 1);

  return (
    <div className="space-y-10">
      
      {/* Title */}
      <div>
        <h1 className="font-serif text-2xl font-bold uppercase tracking-wider text-white">
          Reports & Analytics
        </h1>
        <p className="text-xs font-light text-stone mt-1">
          Detailed metrics of guest reservations, busy hour intervals, and menu category distributions.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart 1: Reservation Daily Trends */}
          <div className="bg-ebony-card border border-stone-border/40 p-8 flex flex-col justify-between">
            <div className="flex items-center space-x-2.5 border-b border-stone-border/30 pb-4 mb-6">
              <TrendingUp className="w-5 h-5 text-gold" />
              <h2 className="font-serif text-base font-bold text-white uppercase tracking-wider">
                Booking Daily Trends
              </h2>
            </div>
            
            {/* Custom Vertical Bar Chart */}
            <div className="h-64 flex items-end gap-3 px-2">
              {trends.map((t, idx) => {
                const percent = (t.count / maxTrendCount) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center group">
                    <div className="w-full relative flex flex-col justify-end h-48 bg-ebony-light border border-stone-border/30">
                      {/* Bar fill with gold glow */}
                      <div 
                        style={{ height: `${percent}%` }}
                        className="w-full bg-gold/30 hover:bg-gold border-t-2 border-gold transition-all duration-500 relative"
                      >
                        {/* Hover Tooltip */}
                        <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-gold text-ebony text-[9px] font-bold px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap rounded-none z-10">
                          {t.count} bookings
                        </span>
                      </div>
                    </div>
                    {/* Date label */}
                    <span className="text-[9px] text-stone mt-2.5 truncate w-full text-center">
                      {t.date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 2: Busy Time Slots */}
          <div className="bg-ebony-card border border-stone-border/40 p-8">
            <div className="flex items-center space-x-2.5 border-b border-stone-border/30 pb-4 mb-6">
              <Clock className="w-5 h-5 text-gold" />
              <h2 className="font-serif text-base font-bold text-white uppercase tracking-wider">
                Peak Booking Slots
              </h2>
            </div>

            {/* Horizontal progress indicators */}
            <div className="space-y-4">
              {timeSlots.slice(0, 5).map((slot, idx) => {
                const percent = (slot.count / maxSlotCount) * 100;
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-semibold text-white">{slot.time} hrs</span>
                      <span className="text-gold">{slot.count} active reservations</span>
                    </div>
                    <div className="w-full h-3 bg-ebony-light border border-stone-border/30">
                      <div 
                        style={{ width: `${percent}%` }}
                        className="h-full bg-gradient-to-r from-jade/40 to-jade border-r-2 border-jade-light transition-all duration-700"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 3: Menu Categories Split */}
          <div className="bg-ebony-card border border-stone-border/40 p-8 lg:col-span-2">
            <div className="flex items-center space-x-2.5 border-b border-stone-border/30 pb-4 mb-6">
              <PieChart className="w-5 h-5 text-gold" />
              <h2 className="font-serif text-base font-bold text-white uppercase tracking-wider">
                Menu Item Splits
              </h2>
            </div>

            {/* Matrix grid showing splits */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {menuSplit.map((item, idx) => (
                <div key={idx} className="bg-ebony-light border border-stone-border p-5 text-center flex flex-col justify-between hover:border-gold/30 transition-colors">
                  <div>
                    <span className="text-[9px] tracking-wider uppercase text-stone block mb-1">
                      Category
                    </span>
                    <h4 className="font-serif text-xs font-semibold text-gold-hover truncate">
                      {item.category}
                    </h4>
                  </div>
                  <div className="my-4">
                    <span className="text-2xl font-bold text-white font-serif">{item.count}</span>
                    <span className="text-[10px] text-stone block mt-0.5">Dishes</span>
                  </div>
                  <div className="w-full h-1 bg-ebony border border-stone-border">
                    <div 
                      style={{ width: `${(item.count / maxMenuCount) * 100}%` }}
                      className="h-full bg-gold"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default DashboardReports;
