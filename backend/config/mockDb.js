const bcrypt = require('bcryptjs');

// Seed mock data
const users = [];
const categories = [
  { id: 1, name: 'Sushi & Sashimi', description: 'Freshly prepared traditional Japanese sushi and sashimi', display_order: 1 },
  { id: 2, name: 'Dim Sum', description: 'Handcrafted bite-sized Cantonese delights steamed to perfection', display_order: 2 },
  { id: 3, name: 'Teppanyaki & Grills', description: 'Sizzling specialities prepared on the flat iron grill', display_order: 3 },
  { id: 4, name: 'Mains', description: 'Hearty Pan-Asian classic curries, stir-fries, and signatures', display_order: 4 },
  { id: 5, name: 'Desserts', description: 'Premium visual desserts with an Asian touch', display_order: 5 },
  { id: 6, name: 'Craft Cocktails', description: 'Signature mixology inspired by Japanese and Asian herbs', display_order: 6 }
];

const items = [
  {
    id: 1,
    category_id: 1,
    name: 'Shiro Signature Maki',
    description: 'Gold-leaf crispy prawn tempura, cream cheese, avocado, wrapped with spicy tuna and drizzled with unagi glaze.',
    price: 850.00,
    is_vegetarian: false,
    is_vegan: false,
    is_signature: true,
    image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    is_available: true
  },
  {
    id: 2,
    category_id: 1,
    name: 'Sake (Salmon) Sashimi',
    description: 'Thick slices of fresh, premium Atlantic salmon, served on shaved ice with fresh wasabi and pickled ginger.',
    price: 950.00,
    is_vegetarian: false,
    is_vegan: false,
    is_signature: false,
    image_url: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=800&q=80',
    is_available: true
  },
  {
    id: 3,
    category_id: 1,
    name: 'Truffle Avocado Roll',
    description: 'Creamy avocado, cucumber, asparagus, rolled in toasted sesame seeds and drizzled with house truffle oil.',
    price: 650.00,
    is_vegetarian: true,
    is_vegan: true,
    is_signature: false,
    image_url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80',
    is_available: true
  },
  {
    id: 4,
    category_id: 2,
    name: 'Crystal Truffle Dumpling',
    description: 'Minced wild shiitake, button, and portobello mushrooms, flavored with truffle essence in a translucent wrapper.',
    price: 550.00,
    is_vegetarian: true,
    is_vegan: false,
    is_signature: true,
    image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    is_available: true
  },
  {
    id: 5,
    category_id: 2,
    name: 'Classic Prawn Har Gow',
    description: 'Succulent fresh prawns in a pleated translucent pastry skin, steamed to juicy perfection.',
    price: 650.00,
    is_vegetarian: false,
    is_vegan: false,
    is_signature: false,
    image_url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80',
    is_available: true
  },
  {
    id: 6,
    category_id: 3,
    name: 'Garlic Butter Prawns',
    description: 'Jumbo prawns grilled on the iron flat-top, basted with rich garlic butter, sake, and chopped chives.',
    price: 920.00,
    is_vegetarian: false,
    is_vegan: false,
    is_signature: true,
    image_url: 'https://images.unsplash.com/photo-1559737607-3578909a3a3b?auto=format&fit=crop&w=800&q=80',
    is_available: true
  },
  {
    id: 7,
    category_id: 3,
    name: 'Hibachi Glazed Chicken',
    description: 'Tender chicken breast glazed with a sweet and savory sweet-soy hibachi sauce, served with sesame bean sprouts.',
    price: 720.00,
    is_vegetarian: false,
    is_vegan: false,
    is_signature: false,
    image_url: 'https://images.unsplash.com/photo-1598515214211-89d3e73ae83b?auto=format&fit=crop&w=800&q=80',
    is_available: true
  },
  {
    id: 8,
    category_id: 4,
    name: 'Peking Duck (Half)',
    description: 'Crispy, slow-roasted duck skin and tender meat served with hand-rolled steamed pancakes, julienned scallions, cucumbers, and rich hoisin sauce.',
    price: 1800.00,
    is_vegetarian: false,
    is_vegan: false,
    is_signature: true,
    image_url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
    is_available: true
  },
  {
    id: 9,
    category_id: 4,
    name: 'Thai Green Curry (Veg)',
    description: 'A rich coconut milk curry infused with galangal, lemongrass, sweet basil, Thai eggplant, baby corn, served with steamed Jasmine rice.',
    price: 650.00,
    is_vegetarian: true,
    is_vegan: true,
    is_signature: false,
    image_url: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=800&q=80',
    is_available: true
  },
  {
    id: 10,
    category_id: 5,
    name: 'Chocolate Cherry Dome',
    description: 'Decadent 70% dark Belgian chocolate mousse shell, sour cherry compote filling, biscuit crunch base, finished with gold leaf dusting.',
    price: 520.00,
    is_vegetarian: true,
    is_vegan: false,
    is_signature: true,
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    is_available: true
  },
  {
    id: 11,
    category_id: 5,
    name: 'Zen Coconut Mousse',
    description: 'Light coconut and white chocolate mousse shaped like a smooth garden pebble, served on cocoa sand with mango coulis.',
    price: 480.00,
    is_vegetarian: true,
    is_vegan: false,
    is_signature: false,
    image_url: 'https://images.unsplash.com/photo-1511018556340-d16986a1c194?auto=format&fit=crop&w=800&q=80',
    is_available: true
  },
  {
    id: 12,
    category_id: 6,
    name: 'Demonic Shiro',
    description: 'Shiro’s famous cocktail: Japanese craft gin, dark blackberry shrub, fresh local lemon, sweet basil, topped with ginger beer.',
    price: 750.00,
    is_vegetarian: false,
    is_vegan: false,
    is_signature: true,
    image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
    is_available: true
  },
  {
    id: 13,
    category_id: 6,
    name: 'Zen Garden Collins',
    description: 'Sake, cucumber juice, elderflower syrup, fresh mint leaves, carbonated club soda, served long with a cucumber ribbon.',
    price: 680.00,
    is_vegetarian: false,
    is_vegan: false,
    is_signature: false,
    image_url: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80',
    is_available: true
  }
];

const reservations = [
  {
    id: 1,
    customer_name: 'Ananya Sharma',
    customer_email: 'ananya@example.com',
    customer_phone: '+919876543210',
    reservation_date: '2026-06-10',
    reservation_time: '19:30:00',
    guest_count: 4,
    special_requests: 'Anniversary celebration. Window table near water channel if possible.',
    status: 'confirmed',
    created_at: new Date()
  },
  {
    id: 2,
    customer_name: 'Vikram Malhotra',
    customer_email: 'vikram.m@example.com',
    customer_phone: '+919123456789',
    reservation_date: '2026-06-10',
    reservation_time: '21:00:00',
    guest_count: 2,
    special_requests: 'No seafood allergies, requesting Teppanyaki seating.',
    status: 'pending',
    created_at: new Date()
  },
  {
    id: 3,
    customer_name: 'Rohan Sen',
    customer_email: 'rohan.sen@example.com',
    customer_phone: '+919988776655',
    reservation_date: '2026-06-11',
    reservation_time: '13:00:00',
    guest_count: 6,
    special_requests: 'Business lunch. Requires quiet area.',
    status: 'confirmed',
    created_at: new Date()
  },
  {
    id: 4,
    customer_name: 'Priyanka Rao',
    customer_email: 'priyanka@example.com',
    customer_phone: '+919888877777',
    reservation_date: '2026-06-08',
    reservation_time: '20:00:00',
    guest_count: 3,
    special_requests: 'Birthday dinner, need candle on dessert.',
    status: 'confirmed',
    created_at: new Date()
  }
];

// Initialize users asynchronously (so bcrypt has time to run)
async function initUsers() {
  const adminHash = await bcrypt.hash('admin123', 10);
  const staffHash = await bcrypt.hash('staff123', 10);
  users.push({ id: 1, username: 'admin', password: adminHash, role: 'admin' });
  users.push({ id: 2, username: 'staff', password: staffHash, role: 'staff' });
}
initUsers();

module.exports = {
  users,
  categories,
  items,
  reservations
};
