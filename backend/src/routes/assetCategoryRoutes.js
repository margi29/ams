const express = require('express');
const {
  getAllCategories,
  createCategory,
  deleteCategoryById
} = require('../controllers/categoryController');
const router = express.Router();

// GET all categories
router.get('/', getAllCategories);

// POST a new category
router.post('/', createCategory);

// DELETE a category by ID
router.delete('/:id', deleteCategoryById);

module.exports = router;
