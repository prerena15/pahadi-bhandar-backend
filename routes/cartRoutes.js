import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// 👉 Get Cart
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.product");
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart" });
  }
});

// 👉 Add to Cart
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const user = await User.findById(req.user.id);

    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.qty += qty;
    } else {
      user.cart.push({ product: productId, qty });
    }

    await user.save();
    await user.populate("cart.product");
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Error adding to cart" });
  }
});

// 👉 Remove from Cart
router.delete("/:productId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(
      (item) => item.product.toString() !== req.params.productId
    );
    await user.save();
    await user.populate("cart.product");
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Error removing item" });
  }
});

export default router;
