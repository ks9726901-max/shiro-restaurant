const db = require('../config/db');
const mockDb = require('../config/mockDb');

// --- Categories Controllers ---

exports.getCategories = async (req, res) => {
  if (global.db_offline) {
    const sorted = [...mockDb.categories].sort((a, b) => a.display_order - b.display_order);
    return res.json(sorted);
  }

  try {
    const [rows] = await db.query('SELECT * FROM menu_categories ORDER BY display_order ASC');
    res.json(rows);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  const { name, description, display_order } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  if (global.db_offline) {
    const newCat = {
      id: Math.max(...mockDb.categories.map(c => c.id), 0) + 1,
      name,
      description: description || '',
      display_order: parseInt(display_order, 10) || 0,
      created_at: new Date()
    };
    mockDb.categories.push(newCat);
    return res.status(201).json(newCat);
  }

  try {
    const [result] = await db.query(
      'INSERT INTO menu_categories (name, description, display_order) VALUES (?, ?, ?)',
      [name, description, display_order || 0]
    );
    res.status(201).json({ id: result.insertId, name, description, display_order: display_order || 0 });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  const { name, description, display_order } = req.body;
  const { id } = req.params;

  if (global.db_offline) {
    const cat = mockDb.categories.find(c => c.id === parseInt(id));
    if (!cat) {
      return res.status(404).json({ message: 'Category not found' });
    }
    if (name) cat.name = name;
    if (description !== undefined) cat.description = description;
    if (display_order !== undefined) cat.display_order = parseInt(display_order, 10);
    return res.json({ message: 'Category updated successfully (Mock Mode)' });
  }

  try {
    const [exists] = await db.query('SELECT * FROM menu_categories WHERE id = ?', [id]);
    if (exists.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await db.query(
      'UPDATE menu_categories SET name = ?, description = ?, display_order = ? WHERE id = ?',
      [name || exists[0].name, description !== undefined ? description : exists[0].description, display_order !== undefined ? display_order : exists[0].display_order, id]
    );
    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (global.db_offline) {
    const idx = mockDb.categories.findIndex(c => c.id === parseInt(id));
    if (idx === -1) {
      return res.status(404).json({ message: 'Category not found' });
    }
    mockDb.categories.splice(idx, 1);
    // Delete cascading menu items in mock Db
    for (let i = mockDb.items.length - 1; i >= 0; i--) {
      if (mockDb.items[i].category_id === parseInt(id)) {
        mockDb.items.splice(i, 1);
      }
    }
    return res.json({ message: 'Category deleted successfully (Mock Mode)' });
  }

  try {
    const [exists] = await db.query('SELECT * FROM menu_categories WHERE id = ?', [id]);
    if (exists.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await db.query('DELETE FROM menu_categories WHERE id = ?', [id]);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};


// --- Menu Items Controllers ---

exports.getItems = async (req, res) => {
  if (global.db_offline) {
    const formatted = mockDb.items.map(item => {
      const cat = mockDb.categories.find(c => c.id === item.category_id);
      return {
        ...item,
        category_name: cat ? cat.name : 'Unknown'
      };
    });
    // Order by category display order, then item name
    formatted.sort((a, b) => {
      const catA = mockDb.categories.find(c => c.id === a.category_id);
      const catB = mockDb.categories.find(c => c.id === b.category_id);
      const orderA = catA ? catA.display_order : 99;
      const orderB = catB ? catB.display_order : 99;
      if (orderA !== orderB) return orderA - orderB;
      return a.name.localeCompare(b.name);
    });
    return res.json(formatted);
  }

  try {
    const query = `
      SELECT mi.*, mc.name AS category_name 
      FROM menu_items mi
      JOIN menu_categories mc ON mi.category_id = mc.id
      ORDER BY mc.display_order ASC, mi.name ASC
    `;
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ message: 'Error fetching menu items', error: error.message });
  }
};

exports.createItem = async (req, res) => {
  const {
    category_id,
    name,
    description,
    price,
    is_vegetarian,
    is_vegan,
    is_signature,
    image_url,
    is_available,
  } = req.body;

  if (!category_id || !name || price === undefined) {
    return res.status(400).json({ message: 'Category, name, and price are required fields' });
  }

  if (global.db_offline) {
    const newItem = {
      id: Math.max(...mockDb.items.map(i => i.id), 0) + 1,
      category_id: parseInt(category_id, 10),
      name,
      description: description || '',
      price: parseFloat(price),
      is_vegetarian: !!is_vegetarian,
      is_vegan: !!is_vegan,
      is_signature: !!is_signature,
      image_url: image_url || '',
      is_available: is_available !== undefined ? !!is_available : true,
      created_at: new Date()
    };
    mockDb.items.push(newItem);
    return res.status(201).json(newItem);
  }

  try {
    const [result] = await db.query(
      `INSERT INTO menu_items 
       (category_id, name, description, price, is_vegetarian, is_vegan, is_signature, image_url, is_available) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        category_id,
        name,
        description || '',
        price,
        is_vegetarian || false,
        is_vegan || false,
        is_signature || false,
        image_url || '',
        is_available !== undefined ? is_available : true,
      ]
    );

    res.status(201).json({
      id: result.insertId,
      category_id,
      name,
      description,
      price,
      is_vegetarian,
      is_vegan,
      is_signature,
      image_url,
      is_available,
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ message: 'Error creating menu item', error: error.message });
  }
};

exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const {
    category_id,
    name,
    description,
    price,
    is_vegetarian,
    is_vegan,
    is_signature,
    image_url,
    is_available,
  } = req.body;

  if (global.db_offline) {
    const item = mockDb.items.find(i => i.id === parseInt(id));
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    if (category_id) item.category_id = parseInt(category_id, 10);
    if (name) item.name = name;
    if (description !== undefined) item.description = description;
    if (price !== undefined) item.price = parseFloat(price);
    if (is_vegetarian !== undefined) item.is_vegetarian = !!is_vegetarian;
    if (is_vegan !== undefined) item.is_vegan = !!is_vegan;
    if (is_signature !== undefined) item.is_signature = !!is_signature;
    if (image_url !== undefined) item.image_url = image_url;
    if (is_available !== undefined) item.is_available = !!is_available;
    return res.json({ message: 'Menu item updated successfully (Mock Mode)' });
  }

  try {
    const [exists] = await db.query('SELECT * FROM menu_items WHERE id = ?', [id]);
    if (exists.length === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const current = exists[0];

    await db.query(
      `UPDATE menu_items SET 
        category_id = ?, 
        name = ?, 
        description = ?, 
        price = ?, 
        is_vegetarian = ?, 
        is_vegan = ?, 
        is_signature = ?, 
        image_url = ?, 
        is_available = ? 
       WHERE id = ?`,
      [
        category_id || current.category_id,
        name || current.name,
        description !== undefined ? description : current.description,
        price !== undefined ? price : current.price,
        is_vegetarian !== undefined ? is_vegetarian : current.is_vegetarian,
        is_vegan !== undefined ? is_vegan : current.is_vegan,
        is_signature !== undefined ? is_signature : current.is_signature,
        image_url !== undefined ? image_url : current.image_url,
        is_available !== undefined ? is_available : current.is_available,
        id,
      ]
    );

    res.json({ message: 'Menu item updated successfully' });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ message: 'Error updating menu item', error: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  const { id } = req.params;

  if (global.db_offline) {
    const idx = mockDb.items.findIndex(i => i.id === parseInt(id));
    if (idx === -1) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    mockDb.items.splice(idx, 1);
    return res.json({ message: 'Menu item deleted successfully (Mock Mode)' });
  }

  try {
    const [exists] = await db.query('SELECT * FROM menu_items WHERE id = ?', [id]);
    if (exists.length === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    await db.query('DELETE FROM menu_items WHERE id = ?', [id]);
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ message: 'Error deleting menu item', error: error.message });
  }
};
