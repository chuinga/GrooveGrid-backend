const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const { isAuthenticated } = require('../middleware/middleware');

router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        console.log('============ requested');
        const oneUser = await User.findById(req.params.id);
        res.json(oneUser);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
