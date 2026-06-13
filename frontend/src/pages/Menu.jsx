import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Search, Leaf, Star, Sparkles } from 'lucide-react';

const FALLBACK_CATEGORIES = [
  { id: 1, name: 'Sushi & Sashimi' },
  { id: 2, name: 'Dim Sum' },
  { id: 3, name: 'Teppanyaki & Grills' },
  { id: 4, name: 'Mains' },
  { id: 5, name: 'Desserts' },
  { id: 6, name: 'Craft Cocktails' }
];

const FALLBACK_ITEMS = [
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

const ensureArray = (val, fallback = []) => {
  if (Array.isArray(val)) return val;
  if (val && typeof val === 'object') {
    if (Array.isArray(val.data)) return val.data;
    if (Array.isArray(val.items)) return val.items;
    if (Array.isArray(val.categories)) return val.categories;
    const firstArrayKey = Object.keys(val).find(key => Array.isArray(val[key]));
    if (firstArrayKey) return val[firstArrayKey];
  }
  return fallback;
};

// Aliases for clear alignment with requirements
const fallbackCategories = FALLBACK_CATEGORIES;
const fallbackMenu = FALLBACK_ITEMS;

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  
  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVeg, setFilterVeg] = useState(false);
  const [filterVegan, setFilterVegan] = useState(false);
  const [filterSignature, setFilterSignature] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenuData = async () => {
      const catsUrl = api.defaults.baseURL ? `${api.defaults.baseURL}/menu/categories` : '/api/menu/categories';
      const itemsUrl = api.defaults.baseURL ? `${api.defaults.baseURL}/menu/items` : '/api/menu/items';
      
      try {
        setLoading(true);
        setError(null);
        
        console.log(`[API Request] URL: ${catsUrl}`);
        console.log(`[API Request] URL: ${itemsUrl}`);

        const [catsRes, itemsRes] = await Promise.all([
          api.get('/menu/categories'),
          api.get('/menu/items')
        ]);
        
        // Log API URL, Response status, and Response body for categories
        console.log(`[API Response] URL: ${catsUrl}`);
        console.log(`Status: ${catsRes.status}`);
        console.log('Body:', catsRes.data);

        // Log API URL, Response status, and Response body for items
        console.log(`[API Response] URL: ${itemsUrl}`);
        console.log(`Status: ${itemsRes.status}`);
        console.log('Body:', itemsRes.data);

        // Ensure fetched data is parsed to arrays safely
        const catsData = ensureArray(catsRes?.data, null);
        const itemsData = ensureArray(itemsRes?.data, null);
        
        if (!catsData || !itemsData) {
          throw new Error('API response mismatch: expected arrays but did not receive array formatted data');
        }

        setCategories(catsData.length ? catsData : fallbackCategories);
        setItems(itemsData.length ? itemsData : fallbackMenu);
        
        if (catsData.length) {
          setActiveCategory(catsData[0].id);
        } else {
          setActiveCategory(fallbackCategories[0].id);
        }
      } catch (err) {
        console.warn('API error fetching menu. Using high-quality local fallbacks.', err);
        setError(err.message || 'Failed to load menu');
        
        // Log API URL, Response status, and Response body for errors
        console.log(`[API Failure] URL: ${catsUrl} and ${itemsUrl}`);
        if (err.response) {
          console.log(`Status: ${err.response.status}`);
          console.log('Body:', err.response.data);
        } else {
          console.log('Status: Offline or Network Error');
          console.log('Body/Message:', err.message);
        }

        // Use fallbackMenu datasets when API is unavailable
        setCategories(fallbackCategories);
        setItems(fallbackMenu);
        setActiveCategory(fallbackCategories[0].id);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  // Ensure menu data is always an array before using filter or map
  const menuCategories = Array.isArray(categories) && categories.length > 0 ? categories : fallbackCategories;
  const menuItems = Array.isArray(items) && items.length > 0 ? items : fallbackMenu;

  // Filter items based on active category, search query, and toggle state switches
  const filteredItems = Array.isArray(menuItems)
    ? menuItems.filter((item) => {
        if (!item) return false;
        
        // 1. Category Filter
        if (activeCategory && item.category_id !== activeCategory) return false;
        
        // 2. Search Query Filter
        if (searchQuery) {
          const nameMatch = item.name ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;
          const descMatch = item.description ? item.description.toLowerCase().includes(searchQuery.toLowerCase()) : false;
          if (!nameMatch && !descMatch) return false;
        }

        // 3. Dietary & Signature Toggles
        if (filterVeg && !item.is_vegetarian) return false;
        if (filterVegan && !item.is_vegan) return false;
        if (filterSignature && !item.is_signature) return false;

        // 4. Availability Check
        if (!item.is_available) return false;

        return true;
      })
    : [];

  return (
    <div className="bg-ebony min-h-screen pt-32 pb-24 text-stone">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[9px] tracking-[0.4em] text-gold uppercase font-medium block mb-3">Gastronomic Selection</span>
          <h1 className="text-4xl md:text-5xl font-serif font-light text-white tracking-wide mt-2 mb-4">
            The Dining Menu
          </h1>
          <div className="w-12 h-[1px] bg-gold/40 mx-auto mb-4" />
          <p className="text-xs font-light text-stone/60 leading-relaxed">
            Each dish balances traditional Pan-Asian flavors with premium local and imported ingredients, crafted to order by our master chefs.
          </p>
        </div>

        {/* Unified Minimal Search & Filter Bar */}
        <div className="border-t border-b border-stone-border/40 py-6 mb-16 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Minimal Search Input */}
          <div className="relative flex-1 max-w-sm">
            <span className="absolute inset-y-0 left-0 flex items-center text-stone/40">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              placeholder="Search dishes or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-stone-border/40 py-2 pl-7 pr-4 text-xs font-light text-white placeholder-stone/40 focus:outline-none focus:border-gold transition-colors duration-300"
            />
          </div>

          {/* Elegant Toggle Badges */}
          <div className="flex flex-wrap gap-3 text-[10px] tracking-widest uppercase font-medium">
            <button
              onClick={() => setFilterVeg(!filterVeg)}
              className={`px-4 py-2 border transition-all duration-300 cursor-pointer ${
                filterVeg
                  ? 'border-gold text-gold bg-gold/5'
                  : 'border-stone-border/40 text-stone/60 hover:border-gold/45 hover:text-gold'
              }`}
            >
              Vegetarian
            </button>

            <button
              onClick={() => setFilterVegan(!filterVegan)}
              className={`px-4 py-2 border transition-all duration-300 cursor-pointer ${
                filterVegan
                  ? 'border-gold text-gold bg-gold/5'
                  : 'border-stone-border/40 text-stone/60 hover:border-gold/45 hover:text-gold'
              }`}
            >
              Vegan
            </button>

            <button
              onClick={() => setFilterSignature(!filterSignature)}
              className={`px-4 py-2 border transition-all duration-300 cursor-pointer ${
                filterSignature
                  ? 'border-gold text-gold bg-gold/5'
                  : 'border-stone-border/40 text-stone/60 hover:border-gold/45 hover:text-gold'
              }`}
            >
              Signature
            </button>
          </div>
        </div>

        {/* Minimalist Scrolling Category Filter */}
        <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-16 border-b border-stone-border/20 pb-8">
          {Array.isArray(menuCategories) ? menuCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-5 py-2.5 text-xs tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'text-gold font-medium'
                    : 'text-stone/60 hover:text-gold-hover'
                }`}
              >
                <span>{cat.name}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold" />
                )}
              </button>
            );
          }) : null}
        </div>

        {/* Menu Items Grid: Styled as elegant listing rather than boxy cards */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t border-b border-gold" />
            <p className="text-stone/50 font-light text-xs">Accessing culinary records...</p>
          </div>
        ) : !Array.isArray(filteredItems) || filteredItems.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-stone-border/30 bg-ebony-card/45">
            <p className="text-stone/40 text-xs font-light">No dishes match your selected filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12 items-start">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="flex flex-col space-y-2 group"
              >
                {/* Header: Title, Price and Dotted Line */}
                <div className="flex justify-between items-baseline gap-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-serif text-base font-normal text-stone/90 group-hover:text-gold transition-colors duration-300">
                      {item.name}
                    </span>
                    {item.is_vegetarian && (
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" title="Vegetarian" />
                    )}
                    {item.is_signature && (
                      <span className="text-[7px] tracking-widest uppercase text-gold/80 border border-gold/30 px-1 font-mono scale-90" title="Signature">
                        SIG
                      </span>
                    )}
                  </div>
                  
                  {/* Fine dotted layout leader line */}
                  <span className="flex-grow border-b border-dashed border-stone-border/40 mx-2" />
                  
                  <span className="font-serif text-gold font-normal text-base whitespace-nowrap">
                    ₹{parseFloat(item.price).toFixed(0)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-[11px] font-light leading-relaxed text-stone/50 pr-8">
                  {item.description || 'A unique fusion of flavors detailed by our master chefs.'}
                </p>

                {/* Vegan details if active */}
                {item.is_vegan && (
                  <span className="text-[9px] tracking-wider uppercase text-green-500/70 font-medium">
                    Vegan Selection
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Menu;
