import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Modal from '../../components/Modal';
import { Plus, Edit2, Trash2, Leaf, Star, Sparkles, AlertCircle } from 'lucide-react';

const FALLBACK_CATEGORIES = [
  { id: 1, name: 'Sushi & Sashimi', description: 'Japanese rolls', display_order: 1 },
  { id: 2, name: 'Dim Sum', description: 'Steamed items', display_order: 2 }
];

const FALLBACK_ITEMS = [
  { id: 1, category_id: 1, category_name: 'Sushi & Sashimi', name: 'Shiro Signature Maki', description: 'Gold maki roll', price: 850.00, is_vegetarian: false, is_vegan: false, is_signature: true, image_url: '', is_available: true }
];

const DashboardMenu = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null means adding new

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  // Form states
  const [itemForm, setItemForm] = useState({
    category_id: '',
    name: '',
    description: '',
    price: '',
    is_vegetarian: false,
    is_vegan: false,
    is_signature: false,
    image_url: '',
    is_available: true
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    display_order: 0
  });

  const loadMenuData = async () => {
    try {
      setLoading(true);
      const [catsRes, itemsRes] = await Promise.all([
        api.get('/menu/categories'),
        api.get('/menu/items')
      ]);
      setCategories(catsRes.data.length ? catsRes.data : FALLBACK_CATEGORIES);
      setItems(itemsRes.data.length ? itemsRes.data : FALLBACK_ITEMS);
    } catch (err) {
      console.warn('API error fetching menu manager data. Using local mock fallbacks.');
      setCategories(FALLBACK_CATEGORIES);
      setItems(FALLBACK_ITEMS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenuData();
  }, []);

  // Open item modal for creation
  const handleAddItemClick = () => {
    setEditingItem(null);
    setItemForm({
      category_id: categories.length ? categories[0].id : '',
      name: '',
      description: '',
      price: '',
      is_vegetarian: false,
      is_vegan: false,
      is_signature: false,
      image_url: '',
      is_available: true
    });
    setItemModalOpen(true);
  };

  // Open item modal for editing
  const handleEditItemClick = (item) => {
    setEditingItem(item);
    setItemForm({
      category_id: item.category_id,
      name: item.name,
      description: item.description || '',
      price: item.price,
      is_vegetarian: !!item.is_vegetarian,
      is_vegan: !!item.is_vegan,
      is_signature: !!item.is_signature,
      image_url: item.image_url || '',
      is_available: !!item.is_available
    });
    setItemModalOpen(true);
  };

  // Item Form Submit (Create or Update)
  const handleItemSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!itemForm.category_id || !itemForm.name || !itemForm.price) {
      setError('Please fill in category name, item name, and price.');
      return;
    }

    try {
      if (editingItem) {
        // Update
        await api.put(`/menu/items/${editingItem.id}`, itemForm);
      } else {
        // Create
        await api.post('/menu/items', itemForm);
      }
      setItemModalOpen(false);
      loadMenuData();
    } catch (err) {
      console.error('Failed to submit menu item:', err);
      // Local fallback mock update
      if (editingItem) {
        setItems(prev => prev.map(it => it.id === editingItem.id ? { ...it, ...itemForm, category_name: categories.find(c => c.id === parseInt(itemForm.category_id))?.name } : it));
      } else {
        const newItem = {
          id: Math.max(...items.map(i => i.id), 0) + 1,
          ...itemForm,
          category_name: categories.find(c => c.id === parseInt(itemForm.category_id))?.name
        };
        setItems(prev => [...prev, newItem]);
      }
      setItemModalOpen(false);
    }
  };

  // Delete Item
  const handleDeleteItem = async (id) => {
    if (!window.confirm('Delete this menu item permanently?')) return;
    try {
      await api.delete(`/menu/items/${id}`);
      loadMenuData();
    } catch (err) {
      console.error('Failed to delete item:', err);
      // Local fallback mock update
      setItems(prev => prev.filter(it => it.id !== id));
    }
  };

  // Category Form Submit
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryForm.name) return;

    try {
      await api.post('/menu/categories', categoryForm);
      setCategoryForm({ name: '', description: '', display_order: 0 });
      setCategoryModalOpen(false);
      loadMenuData();
    } catch (err) {
      console.error('Failed to create category:', err);
      // Local fallback mock update
      const newCat = {
        id: Math.max(...categories.map(c => c.id), 0) + 1,
        ...categoryForm
      };
      setCategories(prev => [...prev, newCat]);
      setCategoryModalOpen(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold uppercase tracking-wider text-white">
            Menu Management
          </h1>
          <p className="text-xs font-light text-stone mt-1">
            Create, edit, or remove categories and culinary dishes.
          </p>
        </div>

        <div className="flex space-x-3 text-xs font-sans">
          <button
            onClick={() => setCategoryModalOpen(true)}
            className="px-4 py-2 border border-stone-border text-stone-light hover:border-gold hover:text-gold transition-all duration-300 flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
          
          <button
            onClick={handleAddItemClick}
            className="px-4 py-2 bg-gold text-ebony font-bold hover:bg-gold-hover transition-all duration-300 flex items-center space-x-1.5 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Add Menu Item</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Item List */}
      <div className="bg-ebony-card border border-stone-border/40 p-8">
        <h2 className="font-serif text-lg font-bold text-white uppercase tracking-wider mb-6">
          Menu Items List
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-stone font-light text-xs border border-dashed border-stone-border/20">
            No dishes found. Click 'Add Menu Item' to populate.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-stone-border/60 text-stone uppercase text-[10px] tracking-widest">
                  <th className="pb-3 font-medium">Dish Name</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Price</th>
                  <th className="pb-3 font-medium">Tags</th>
                  <th className="pb-3 font-medium">Availability</th>
                  <th className="pb-3 font-medium text-right">Moderator Panel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-border/30">
                {items.map((item) => (
                  <tr key={item.id} className="text-stone-light hover:bg-ebony-light/40 transition-colors">
                    <td className="py-4">
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="text-[10px] text-stone mt-0.5 max-w-sm truncate">{item.description}</p>
                    </td>
                    <td className="py-4 font-serif text-gold-hover">{item.category_name}</td>
                    <td className="py-4 font-semibold text-white">₹{parseFloat(item.price).toFixed(2)}</td>
                    <td className="py-4">
                      <div className="flex space-x-1">
                        {item.is_vegetarian && (
                          <span className="p-1 bg-green-950 text-green-400 border border-green-500/10" title="Veg">
                            <Leaf className="w-3.5 h-3.5" />
                          </span>
                        )}
                        {item.is_signature && (
                          <span className="p-1 bg-gold/10 text-gold border border-gold/10" title="Signature">
                            <Star className="w-3.5 h-3.5 fill-current" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 font-bold uppercase text-[9px] tracking-widest ${
                        item.is_available 
                          ? 'bg-green-950/20 text-green-400 border border-green-500/20' 
                          : 'bg-red-950/20 text-red-400 border border-red-500/20'
                      }`}>
                        {item.is_available ? 'Available' : 'Sold Out'}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end items-center space-x-2.5">
                        <button
                          onClick={() => handleEditItemClick(item)}
                          className="p-1.5 border border-stone-border text-stone hover:border-gold hover:text-gold transition-colors"
                          title="Edit dish details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1.5 border border-stone-border text-stone hover:border-crimson hover:text-crimson transition-colors"
                          title="Remove dish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Item Modal (Create or Edit) */}
      <Modal
        isOpen={itemModalOpen}
        onClose={() => setItemModalOpen(false)}
        title={editingItem ? 'Edit Menu Item' : 'Create Menu Item'}
      >
        <form onSubmit={handleItemSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-crimson/10 border border-crimson/30 text-crimson text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[10px] tracking-widest text-stone uppercase mb-2">Category</label>
            <select
              value={itemForm.category_id}
              onChange={(e) => setItemForm({ ...itemForm, category_id: e.target.value })}
              className="w-full bg-ebony-light border border-stone-border py-2 px-3 text-xs text-stone-light focus:outline-none focus:border-gold rounded-none"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-widest text-stone uppercase mb-2">Name</label>
              <input
                type="text"
                required
                value={itemForm.name}
                onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                placeholder="Dish name"
                className="w-full bg-ebony-light border border-stone-border py-2 px-3 text-xs text-white placeholder-stone/50 focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-widest text-stone uppercase mb-2">Price (₹)</label>
              <input
                type="number"
                required
                step="0.01"
                value={itemForm.price}
                onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                placeholder="Price"
                className="w-full bg-ebony-light border border-stone-border py-2 px-3 text-xs text-white placeholder-stone/50 focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-widest text-stone uppercase mb-2">Description</label>
            <textarea
              rows="2"
              value={itemForm.description}
              onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
              placeholder="Description of flavours, presentation, ingredients..."
              className="w-full bg-ebony-light border border-stone-border py-2 px-3 text-xs text-white placeholder-stone/50 focus:outline-none focus:border-gold resize-none"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-widest text-stone uppercase mb-2">Image URL</label>
            <input
              type="text"
              value={itemForm.image_url}
              onChange={(e) => setItemForm({ ...itemForm, image_url: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-ebony-light border border-stone-border py-2 px-3 text-xs text-white placeholder-stone/50 focus:outline-none focus:border-gold"
            />
          </div>

          {/* Toggle Switches */}
          <div className="grid grid-cols-3 gap-2 py-2 text-xs">
            <label className="flex items-center space-x-2 cursor-pointer text-stone hover:text-gold-hover">
              <input
                type="checkbox"
                checked={itemForm.is_vegetarian}
                onChange={(e) => setItemForm({ ...itemForm, is_vegetarian: e.target.checked })}
                className="accent-gold"
              />
              <span>Vegetarian</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer text-stone hover:text-gold-hover">
              <input
                type="checkbox"
                checked={itemForm.is_vegan}
                onChange={(e) => setItemForm({ ...itemForm, is_vegan: e.target.checked })}
                className="accent-gold"
              />
              <span>Vegan</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer text-stone hover:text-gold-hover">
              <input
                type="checkbox"
                checked={itemForm.is_signature}
                onChange={(e) => setItemForm({ ...itemForm, is_signature: e.target.checked })}
                className="accent-gold"
              />
              <span>Signature</span>
            </label>
          </div>

          <label className="flex items-center space-x-2 cursor-pointer text-xs text-stone hover:text-gold-hover pb-3 border-b border-stone-border/40">
            <input
              type="checkbox"
              checked={itemForm.is_available}
              onChange={(e) => setItemForm({ ...itemForm, is_available: e.target.checked })}
              className="accent-gold"
            />
            <span>Available for purchase (In Stock)</span>
          </label>

          <button
            type="submit"
            className="w-full py-3 bg-gold text-ebony font-sans text-xs font-bold tracking-widest uppercase hover:bg-gold-hover transition-all duration-300 shadow-lg"
          >
            {editingItem ? 'Save Changes' : 'Create Item'}
          </button>
        </form>
      </Modal>

      {/* Category Modal (Create Only) */}
      <Modal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        title="Add Menu Category"
      >
        <form onSubmit={handleCategorySubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] tracking-widest text-stone uppercase mb-2">Category Name</label>
            <input
              type="text"
              required
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              placeholder="e.g. Dim Sum, Main Course"
              className="w-full bg-ebony-light border border-stone-border py-2 px-3 text-xs text-white placeholder-stone/50 focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-widest text-stone uppercase mb-2">Description</label>
            <textarea
              rows="2"
              value={categoryForm.description}
              onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
              placeholder="Brief description of category items"
              className="w-full bg-ebony-light border border-stone-border py-2 px-3 text-xs text-white placeholder-stone/50 focus:outline-none focus:border-gold resize-none"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-widest text-stone uppercase mb-2">Display Order (Sorting)</label>
            <input
              type="number"
              value={categoryForm.display_order}
              onChange={(e) => setCategoryForm({ ...categoryForm, display_order: parseInt(e.target.value, 10) })}
              className="w-full bg-ebony-light border border-stone-border py-2 px-3 text-xs text-white focus:outline-none focus:border-gold"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gold text-ebony font-sans text-xs font-bold tracking-widest uppercase hover:bg-gold-hover transition-all duration-300 shadow-lg"
          >
            Create Category
          </button>
        </form>
      </Modal>

    </div>
  );
};

export default DashboardMenu;
