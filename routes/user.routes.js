const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/middleware");

// GET USER
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const oneUser = await User.findById(req.params.id);
    res.json(oneUser);
  } catch (error) {
    next(error);
  }
});

// PUT to UPDATE the user's name
router.put("/:id/update", isAuthenticated, async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    // Update user's name
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
