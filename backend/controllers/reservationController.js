const db = require('../config/db');
const mockDb = require('../config/mockDb');
const emailService = require('../utils/emailService');

// @desc    Create a new reservation
// @route   POST /api/reservations
// @access  Public
exports.createReservation = async (req, res) => {
  const {
    customer_name,
    customer_email,
    customer_phone,
    reservation_date,
    reservation_time,
    guest_count,
    special_requests,
  } = req.body;

  if (!customer_name || !customer_email || !customer_phone || !reservation_date || !reservation_time || !guest_count) {
    return res.status(400).json({ message: 'All booking fields are required' });
  }

  // MOCK MODE FALLBACK
  if (global.db_offline) {
    const newRes = {
      id: Math.max(...mockDb.reservations.map(r => r.id), 0) + 1,
      customer_name,
      customer_email,
      customer_phone,
      reservation_date,
      reservation_time: reservation_time + ':00', // Matches DB TIME format
      guest_count: parseInt(guest_count, 10),
      special_requests: special_requests || '',
      status: 'pending',
      created_at: new Date()
    };
    mockDb.reservations.push(newRes);
    
    const io = req.app.get('socketio');
    if (io) {
      io.emit('newReservation', newRes);
    }

    return res.status(201).json(newRes);
  }

  // REAL MYSQL IMPLEMENTATION
  try {
    const [result] = await db.query(
      `INSERT INTO reservations 
       (customer_name, customer_email, customer_phone, reservation_date, reservation_time, guest_count, special_requests, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        customer_name,
        customer_email,
        customer_phone,
        reservation_date,
        reservation_time,
        guest_count,
        special_requests || '',
      ]
    );

    const newReservation = {
      id: result.insertId,
      customer_name,
      customer_email,
      customer_phone,
      reservation_date,
      reservation_time,
      guest_count,
      special_requests,
      status: 'pending',
      created_at: new Date()
    };

    const io = req.app.get('socketio');
    if (io) {
      io.emit('newReservation', newReservation);
    }

    res.status(201).json(newReservation);
  } catch (error) {
    console.error('Create reservation error:', error);
    res.status(500).json({ message: 'Error creating reservation', error: error.message });
  }
};

// @desc    Get reservations (with filtering)
// @route   GET /api/reservations
// @access  Private (Staff/Admin)
exports.getReservations = async (req, res) => {
  const { date, status, search } = req.query;

  // MOCK MODE FALLBACK
  if (global.db_offline) {
    let filtered = [...mockDb.reservations];

    if (date) {
      filtered = filtered.filter(r => r.reservation_date === date);
    }

    if (status) {
      filtered = filtered.filter(r => r.status === status);
    }

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        r => r.customer_name.toLowerCase().includes(s) || 
             r.customer_email.toLowerCase().includes(s) || 
             r.customer_phone.toLowerCase().includes(s)
      );
    }

    // Sort: Date descending, Time ascending
    filtered.sort((a, b) => {
      const dateA = new Date(a.reservation_date + 'T' + a.reservation_time);
      const dateB = new Date(b.reservation_date + 'T' + b.reservation_time);
      return dateB - dateA; // Date descending
    });

    return res.json(filtered);
  }

  // REAL MYSQL IMPLEMENTATION
  let query = 'SELECT * FROM reservations WHERE 1=1';
  const queryParams = [];

  if (date) {
    query += ' AND reservation_date = ?';
    queryParams.push(date);
  }

  if (status) {
    query += ' AND status = ?';
    queryParams.push(status);
  }

  if (search) {
    query += ' AND (customer_name LIKE ? OR customer_email LIKE ? OR customer_phone LIKE ?)';
    const searchWildcard = `%${search}%`;
    queryParams.push(searchWildcard, searchWildcard, searchWildcard);
  }

  query += ' ORDER BY reservation_date DESC, reservation_time ASC';

  try {
    const [rows] = await db.query(query, queryParams);
    res.json(rows);
  } catch (error) {
    console.error('Get reservations error:', error);
    res.status(500).json({ message: 'Error retrieving reservations', error: error.message });
  }
};

// @desc    Approve reservation
// // @route   PUT /api/reservations/:id/approve
// // @access  Private (Staff/Admin)
exports.approveReservation = async (req, res) => {
  const { id } = req.params;

  // MOCK MODE FALLBACK
  if (global.db_offline) {
    const resv = mockDb.reservations.find(r => r.id === parseInt(id));
    if (!resv) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    resv.status = 'confirmed';

    let emailStatus = 'sent';
    try {
      await emailService.sendConfirmationEmail(resv);
    } catch (err) {
      console.error('Approve email fail (Mock Mode):', err.message);
      emailStatus = 'failed';
    }
    resv.email_delivery_status = emailStatus;

    return res.json({ 
      message: 'Reservation approved successfully (Mock Mode)', 
      status: 'confirmed', 
      email_delivery_status: emailStatus 
    });
  }

  // REAL MYSQL IMPLEMENTATION
  try {
    const [exists] = await db.query('SELECT * FROM reservations WHERE id = ?', [id]);
    if (exists.length === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    const resv = exists[0];

    await db.query('UPDATE reservations SET status = "confirmed" WHERE id = ?', [id]);

    let emailStatus = 'sent';
    try {
      await emailService.sendConfirmationEmail(resv);
    } catch (err) {
      console.error('Approve email fail:', err.message);
      emailStatus = 'failed';
    }

    await db.query('UPDATE reservations SET email_delivery_status = ? WHERE id = ?', [emailStatus, id]);

    res.json({ 
      message: 'Reservation approved successfully', 
      status: 'confirmed', 
      email_delivery_status: emailStatus 
    });
  } catch (error) {
    console.error('Approve reservation error:', error);
    res.status(500).json({ message: 'Error approving reservation', error: error.message });
  }
};

// @desc    Reject reservation
// @route   PUT /api/reservations/:id/reject
// @access  Private (Staff/Admin)
exports.rejectReservation = async (req, res) => {
  const { id } = req.params;

  // MOCK MODE FALLBACK
  if (global.db_offline) {
    const resv = mockDb.reservations.find(r => r.id === parseInt(id));
    if (!resv) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    resv.status = 'rejected';

    let emailStatus = 'sent';
    try {
      await emailService.sendRejectionEmail(resv);
    } catch (err) {
      console.error('Reject email fail (Mock Mode):', err.message);
      emailStatus = 'failed';
    }
    resv.email_delivery_status = emailStatus;

    return res.json({ 
      message: 'Reservation rejected successfully (Mock Mode)', 
      status: 'rejected', 
      email_delivery_status: emailStatus 
    });
  }

  // REAL MYSQL IMPLEMENTATION
  try {
    const [exists] = await db.query('SELECT * FROM reservations WHERE id = ?', [id]);
    if (exists.length === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    const resv = exists[0];

    await db.query('UPDATE reservations SET status = "rejected" WHERE id = ?', [id]);

    let emailStatus = 'sent';
    try {
      await emailService.sendRejectionEmail(resv);
    } catch (err) {
      console.error('Reject email fail:', err.message);
      emailStatus = 'failed';
    }

    await db.query('UPDATE reservations SET email_delivery_status = ? WHERE id = ?', [emailStatus, id]);

    res.json({ 
      message: 'Reservation rejected successfully', 
      status: 'rejected', 
      email_delivery_status: emailStatus 
    });
  } catch (error) {
    console.error('Reject reservation error:', error);
    res.status(500).json({ message: 'Error rejecting reservation', error: error.message });
  }
};

// @desc    Cancel reservation
// // @route   PUT /api/reservations/:id/cancel
// // @access  Private (Staff/Admin)
exports.cancelReservation = async (req, res) => {
  const { id } = req.params;

  // MOCK MODE FALLBACK
  if (global.db_offline) {
    const resv = mockDb.reservations.find(r => r.id === parseInt(id));
    if (!resv) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    resv.status = 'cancelled';
    return res.json({ message: 'Reservation cancelled successfully (Mock Mode)', status: 'cancelled' });
  }

  // REAL MYSQL IMPLEMENTATION
  try {
    const [exists] = await db.query('SELECT * FROM reservations WHERE id = ?', [id]);
    if (exists.length === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    await db.query('UPDATE reservations SET status = "cancelled" WHERE id = ?', [id]);
    res.json({ message: 'Reservation cancelled successfully', status: 'cancelled' });
  } catch (error) {
    console.error('Cancel reservation error:', error);
    res.status(500).json({ message: 'Error cancelling reservation', error: error.message });
  }
};

// @desc    Delete a reservation
// @route   DELETE /api/reservations/:id
// @access  Private (Staff/Admin)
exports.deleteReservation = async (req, res) => {
  const { id } = req.params;

  // MOCK MODE FALLBACK
  if (global.db_offline) {
    const idx = mockDb.reservations.findIndex(r => r.id === parseInt(id));
    if (idx === -1) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    mockDb.reservations.splice(idx, 1);
    return res.json({ message: 'Reservation deleted successfully (Mock Mode)' });
  }

  // REAL MYSQL IMPLEMENTATION
  try {
    const [exists] = await db.query('SELECT * FROM reservations WHERE id = ?', [id]);
    if (exists.length === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    await db.query('DELETE FROM reservations WHERE id = ?', [id]);
    res.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    console.error('Delete reservation error:', error);
    res.status(500).json({ message: 'Error deleting reservation', error: error.message });
  }
};
