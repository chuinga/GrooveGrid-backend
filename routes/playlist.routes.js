const { isAuthenticated } = require('../middleware/middleware.js');
// Import the models
const Playlists = require('../models/Playlists.model');
const User = require('../models/User.model');
const router = require('express').Router();

// GET all Playlists
router.get('/', async (req, res, next) => {
    try {
        const allPlaylists = await Playlists.find()
            .populate('artists')
            .populate('songs');
        res.status(200).json(allPlaylists);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// GET one Playlist
router.get('/:playlistId', async (req, res, next) => {
    const { playlistId } = req.params;

    try {
        const onePlaylist = await Playlists.findById(playlistId)
            .populate({
                path: 'songs',
                model: 'songs',
                populate: {
                    path: 'artists',
                    model: 'artists',
                },
            })
            .populate('artists');

        res.status(200).json(onePlaylist);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// POST one Playlist
router.post('/', isAuthenticated, async (req, res, next) => {
    const payload = req.body;

    const { userId } = req.payload;
    payload.createdBy = userId;

    try {
        const createdPlaylist = await Playlists.create(payload);
        res.status(201).json(createdPlaylist);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// PUT one Playlist
router.put('/:playlistId', isAuthenticated, async (req, res, next) => {
    const { userId } = req.payload;
    const payload = req.body;
    const { playlistId } = req.params;
    try {
        const playlistToUpdate = await Playlists.findById(playlistId);
        if (playlistToUpdate.createdBy == userId) {
            const updatedPlaylist = await Playlists.findByIdAndUpdate(
                playlistId,
                payload,
                {
                    new: true,
                }
            );
            res.status(200).json(updatedPlaylist);
        } else {
            res.status(400).json({ message: 'Playlist not found' });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// DELETE one Playlist
router.delete('/:playlistId', isAuthenticated, async (req, res, next) => {
    const { userId } = req.payload;
    const { playlistId } = req.params;
    try {
        const playlistToDelete = await Playlists.findById(playlistId);
        if (playlistToDelete.createdBy == userId) {
            await Playlists.findByIdAndDelete(playlistId);
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Playlist not found' });
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
