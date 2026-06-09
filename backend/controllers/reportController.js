const db = require('../config/db');
const mockDb = require('../config/mockDb');

// @desc    Get dashboard counts summary
// @route   GET /api/reports/summary
// @access  Private (Staff/Admin)
exports.getSummary = async (req, res) => {
  if (global.db_offline) {
    return res.json({
      totalReservations: mockDb.reservations.length,
      pendingReservations: mockDb.reservations.filter(r => r.status === 'pending').length,
      confirmedReservations: mockDb.reservations.filter(r => r.status === 'confirmed').length,
      totalMenuItems: mockDb.items.length,
    });
  }

  try {
    const [totalRes] = await db.query('SELECT COUNT(*) AS count FROM reservations');
    const [pendingRes] = await db.query('SELECT COUNT(*) AS count FROM reservations WHERE status = "pending"');
    const [confirmedRes] = await db.query('SELECT COUNT(*) AS count FROM reservations WHERE status = "confirmed"');
    const [menuItems] = await db.query('SELECT COUNT(*) AS count FROM menu_items');

    res.json({
      totalReservations: totalRes[0].count,
      pendingReservations: pendingRes[0].count,
      confirmedReservations: confirmedRes[0].count,
      totalMenuItems: menuItems[0].count,
    });
  } catch (error) {
    console.error('Report summary error:', error);
    res.status(500).json({ message: 'Error retrieving summary reports', error: error.message });
  }
};

// @desc    Get booking counts grouped by reservation date
// @route   GET /api/reports/trends
// @access  Private (Staff/Admin)
exports.getTrends = async (req, res) => {
  if (global.db_offline) {
    const dateCounts = {};
    mockDb.reservations.forEach(r => {
      dateCounts[r.reservation_date] = (dateCounts[r.reservation_date] || 0) + 1;
    });

    const sortedTrends = Object.keys(dateCounts)
      .sort()
      .slice(-15)
      .map(date => ({
        date,
        count: dateCounts[date]
      }));
    return res.json(sortedTrends);
  }

  try {
    const query = `
      SELECT DATE_FORMAT(reservation_date, '%Y-%m-%d') as date, COUNT(*) as count 
      FROM reservations 
      GROUP BY reservation_date 
      ORDER BY reservation_date ASC 
      LIMIT 15
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Report trends error:', error);
    res.status(500).json({ message: 'Error retrieving trends reports', error: error.message });
  }
};

// @desc    Get busy time slots distribution
// @route   GET /api/reports/time-slots
// @access  Private (Staff/Admin)
exports.getTimeSlots = async (req, res) => {
  if (global.db_offline) {
    const slotCounts = {};
    mockDb.reservations.forEach(r => {
      const timeShort = r.reservation_time.slice(0, 5); // "HH:MM"
      slotCounts[timeShort] = (slotCounts[timeShort] || 0) + 1;
    });

    const sortedSlots = Object.keys(slotCounts)
      .map(time => ({
        time,
        count: slotCounts[time]
      }))
      .sort((a, b) => b.count - a.count); // Most busy first
    return res.json(sortedSlots);
  }

  try {
    const query = `
      SELECT TIME_FORMAT(reservation_time, '%H:%i') as time, COUNT(*) as count 
      FROM reservations 
      GROUP BY reservation_time 
      ORDER BY count DESC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Report time-slots error:', error);
    res.status(500).json({ message: 'Error retrieving time slot reports', error: error.message });
  }
};

// @desc    Get number of items in each category
// @route   GET /api/reports/menu-split
// @access  Private (Staff/Admin)
exports.getMenuSplit = async (req, res) => {
  if (global.db_offline) {
    const split = mockDb.categories.map(cat => {
      const itemsCount = mockDb.items.filter(item => item.category_id === cat.id).length;
      return {
        category: cat.name,
        count: itemsCount
      };
    });
    // Order by items count descending
    split.sort((a, b) => b.count - a.count);
    return res.json(split);
  }

  try {
    const query = `
      SELECT mc.name as category, COUNT(mi.id) as count 
      FROM menu_categories mc 
      LEFT JOIN menu_items mi ON mc.id = mi.category_id 
      GROUP BY mc.id 
      ORDER BY count DESC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Report menu-split error:', error);
    res.status(500).json({ message: 'Error retrieving menu split reports', error: error.message });
  }
};
