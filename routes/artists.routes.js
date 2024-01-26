const { isAuthenticated } = require('../middleware/middleware.js');
// Import the models
const Artist = require('../models/Artist.model');
const User = require('../models/User.model');

const router = require('express').Router();

// GET all Artists
router.get('/', async (req, res, next) => {
    try {
        const allArtists = await Artist.find()
            .populate('albums')
            .populate('genre');
        res.status(200).json(allArtists);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// GET one Artist
router.get('/:artistId', async (req, res, next) => {
    const { artistId } = req.params;
    try {
        const oneArtist = await Artist.findById(artistId)
            .populate('albums')
            .populate('genre');
        res.status(200).json(oneArtist);
    } catch (error) {
        next(error);
    }
});

// POST a new Artist
router.post('/', isAuthenticated, async (req, res, next) => {
    const payload = req.body;
    const { userId } = req.payload;
    payload.createdBy = userId;
    try {
        const createdArtist = await Artist.create(payload);
        res.status(201).json(createdArtist);
    } catch (error) {
        console.log(error);
        next(error); // Pass the error to the error handling middleware
    }
});

// PUT update one Artist
router.put('/:artistId', isAuthenticated, async (req, res, next) => {
    const { userId } = req.payload;
    const payload = req.body;
    const { artistId } = req.params;
    try {
        const artistToUpdate = await Artist.findById(artistId);
        if (artistToUpdate.createdBy == userId) {
            const updatedArtist = await Artist.findByIdAndUpdate(
                artistId,
                payload,
                {
                    new: true,
                }
            );
            res.status(200).json(updatedArtist);
        } else {
            res.status(404).json({ message: 'Artist not found' });
        }
    } catch (error) {
        next(error);
    }
});

// DELETE Artist
router.delete('/:artistId', isAuthenticated, async (req, res, next) => {
    const { userId } = req.payload;
    const { artistId } = req.params;
    try {
        const artistToDelete = await Artist.findById(artistId);
        if (artistToDelete.createdBy == userId) {
            await Artist.findByIdAndDelete(artistId);
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Genre not found' });
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
