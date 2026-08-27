const Item = require('../models/Item');

// @desc    Get all inventory items
// @route   GET /api/items
// @access  Public
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ name: 1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Add a new item to inventory
// @route   POST /api/items
// @access  Public
exports.createItem = async (req, res) => {
  try {
    const { name, category, costPrice, sellingPrice, stockQuantity, sku } = req.body;

    const item = await Item.create({
      name,
      category,
      costPrice,
      sellingPrice,
      stockQuantity,
      sku,
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};