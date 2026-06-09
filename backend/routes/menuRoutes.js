const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getItems,
  createItem,
  updateItem,
  deleteItem,
} = require('../controllers/menuController');
const { protect } = require('../middleware/authMiddleware');

// Categories routes
router.route('/categories')
  .get(getCategories)
  .post(protect, createCategory);

router.route('/categories/:id')
  .put(protect, updateCategory)
  .delete(protect, deleteCategory);

// Items routes
router.route('/items')
  .get(getItems)
  .post(protect, createItem);

router.route('/items/:id')
  .put(protect, updateItem)
  .delete(protect, deleteItem);

module.exports = router;
