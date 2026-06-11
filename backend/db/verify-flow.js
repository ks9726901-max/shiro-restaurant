// Complete Flow Verification Script (Customer -> API -> Staff Approval)
// Runs against https://shiro-restaurant.onrender.com

async function verify() {
  console.log('🚀 Starting Full-Stack Integration Verification...\n');

  const baseURL = 'https://shiro-restaurant.onrender.com/api';
  
  // 1. Create a customer reservation (POST /api/reservations)
  console.log('Step 1: Customer submitting reservation...');
  const customerBooking = {
    customer_name: 'Kishan S',
    customer_email: 'kishan@example.com',
    customer_phone: '+919988776655',
    reservation_date: '2026-06-15',
    reservation_time: '20:30',
    guest_count: 3,
    special_requests: 'Requesting table next to the Balinese consort water fountain.'
  };

  let newBooking;
  try {
    const res = await fetch(`${baseURL}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerBooking)
    });
    
    if (!res.ok) throw new Error(`Booking failed with status ${res.status}`);
    
    newBooking = await res.json();
    console.log('✅ Success! Reservation Created:', {
      id: newBooking.id,
      name: newBooking.customer_name,
      status: newBooking.status
    });
  } catch (err) {
    console.error('❌ Step 1 Failed:', err.message);
    return;
  }

  console.log('\n----------------------------------------\n');

  // 2. Staff Log In to retrieve JWT (POST /api/auth/login)
  console.log('Step 2: Staff logging in...');
  let token;
  try {
    const res = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    
    if (!res.ok) throw new Error(`Login failed with status ${res.status}`);
    
    const data = await res.json();
    token = data.token;
    console.log('✅ Success! Staff Authenticated. JWT acquired.');
  } catch (err) {
    console.error('❌ Step 2 Failed:', err.message);
    return;
  }

  console.log('\n----------------------------------------\n');

  // 3. Staff fetches reservations and verifies the customer booking appears (GET /api/reservations)
  console.log('Step 3: Staff fetching reservations list...');
  try {
    const res = await fetch(`${baseURL}/reservations`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
    
    const list = await res.json();
    const found = list.find(r => r.id === newBooking.id);
    
    if (found) {
      console.log('✅ Success! Customer reservation found in staff list:', {
        id: found.id,
        name: found.customer_name,
        date: found.reservation_date,
        time: found.reservation_time,
        status: found.status
      });
    } else {
      throw new Error('Customer booking was not found in the staff reservations list.');
    }
  } catch (err) {
    console.error('❌ Step 3 Failed:', err.message);
    return;
  }

  console.log('\n----------------------------------------\n');

  // 4. Staff approves the booking (PUT /api/reservations/:id/approve)
  console.log(`Step 4: Staff approving reservation #${newBooking.id}...`);
  try {
    const res = await fetch(`${baseURL}/reservations/${newBooking.id}/approve`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!res.ok) throw new Error(`Approval failed with status ${res.status}`);
    
    const result = await res.json();
    console.log('✅ Success! Status update response:', result);
  } catch (err) {
    console.error('❌ Step 4 Failed:', err.message);
    return;
  }

  console.log('\n----------------------------------------\n');

  // 5. Verify status changed to confirmed in the list
  console.log('Step 5: Verifying status update on database...');
  try {
    const res = await fetch(`${baseURL}/reservations`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const list = await res.json();
    const updated = list.find(r => r.id === newBooking.id);
    
    if (updated && updated.status === 'confirmed') {
      console.log('🎉 VERIFICATION COMPLETE: Status is successfully set to "confirmed".');
    } else {
      throw new Error(`Verification failed. Status is currently: ${updated ? updated.status : 'not found'}`);
    }
  } catch (err) {
    console.error('❌ Step 5 Failed:', err.message);
    return;
  }
}

verify();
