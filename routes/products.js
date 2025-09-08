const express = require('express');
const Product = require('../models/Product.js');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// List products
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create product (admin only)
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const data = req.body;
    const p = await Product.create(data);
    res.status(201).json(p);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
