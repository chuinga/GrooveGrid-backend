const { isAuthenticated } = require('../middleware/middleware.js');
// Import the models
const Genre = require('../models/Genre.model.js');
const User = require('../models/User.model');

const router = require('express').Router();

// GET all Genres
router.get('/', async (req, res, next) => {
    try {
        const allGenres = await Genre.find()
        res.status(200).json(allGenres);
    } catch (error) {
        console.log(error);
        next(error); // Pass the error to the error handling middleware
    }
});

// GET one genre
router.get('/:genreId', async (req, res, next) => {
    const { genreId } = req.params;
    try {
        const oneGenre = await Genre.findById(genreId)
        res.status(200).json(oneGenre);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// POST a new genre
router.post('/', isAuthenticated, async (req, res, next) => {
    const payload = req.body;
    const { userId } = req.payload;
    payload.createdBy = userId;
    try {
        const createdGenre = await Genre.create(payload);
        res.status(201).json(createdGenre);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// PUT update the genre
router.put('/:genreId', isAuthenticated, async (req, res, next) => {
    const { userId } = req.payload;
    const payload = req.body;
    const { genreId } = req.params;
    try {
        const genreToUpdate = await Genre.findById(genreId);
        if (genreToUpdate.createdBy == userId) {
            const updatedGenre = await Genre.findByIdAndUpdate(
                genreId,
                payload,
                {
                    new: true,
                }
            );
            res.status(200).json(updatedGenre);
        } else {
            res.status(400).json({ message: 'Genre not found' });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// DELETE genre
router.delete('/:genreId', isAuthenticated, async (req, res, next) => {
    const { userId } = req.payload;
    const { genreId } = req.params;
    try {
        const genreToDelete = await Genre.findById(genreId);
        if (genreToDelete.createdBy == userId) {
            await Genre.findByIdAndDelete(genreId);
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Genre not found' });
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
