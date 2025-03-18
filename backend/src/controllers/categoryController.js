const AssetCategory = require('../models/AssetCategory');

// GET all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await AssetCategory.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching categories' });
  }
};

// POST a new category
const createCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Category name is required' });

  try {
    const existingCategory = await AssetCategory.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const newCategory = new AssetCategory({ name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: 'Error adding category' });
  }
};

// DELETE a category by ID
const deleteCategoryById = async (req, res) => {
  try {
    const category = await AssetCategory.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting category' });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  deleteCategoryById,
};
