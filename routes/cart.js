// routes/cart.js
const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// 🛒 Get Cart Items
router.get("/", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart) return res.json([]);
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 🛒 Add Item to Cart
router.post("/:productId", verifyToken, async (req, res) => {
  try {
    const { qty } = req.body;
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = new Cart({ user: req.user.id, items: [] });

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === req.params.productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].qty += qty || 1;
    } else {
      cart.items.push({ product: req.params.productId, qty: qty || 1 });
    }

    await cart.save();
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 🛒 Update Quantity
router.put("/:productId", verifyToken, async (req, res) => {
  try {
    const { qty } = req.body;
    if (qty < 1) return res.status(400).json({ error: "Quantity must be at least 1" });

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === req.params.productId
    );
    if (itemIndex === -1) return res.status(404).json({ error: "Product not in cart" });

    cart.items[itemIndex].qty = qty;
    await cart.save();

    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 🛒 Remove Item from Cart
router.delete("/:productId", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await cart.save();
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
