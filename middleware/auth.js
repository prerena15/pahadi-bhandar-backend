const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify JWT
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Invalid token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: user._id }
    next();
  } catch (err) {
    res.status(403).json({ error: "Token invalid" });
  }
};

// Check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) return res.status(403).json({ error: "Admin access required" });
    next();
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { verifyToken, requireAdmin };
