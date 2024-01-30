const { isAuthenticated } = require('../middleware/middleware.js');
// Import the models
const Playlists = require('../models/Playlists.model');
const User = require('../models/User.model');
const router = require('express').Router();

// GET all Playlists
router.get('/', async (req, res, next) => {
    try {
        const userId = req.query.userId;
        const allPlaylists = await Playlists.find({ createdBy: userId })
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
    const userId = req.query.userId;

    try {
        const onePlaylist = await Playlists.findOne({
            createdBy: userId,
            _id: playlistId,
        })
            .populate('artists')
            .populate('songs');
        res.status(200).json(onePlaylist);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// POST one Playlist
router.post('/', isAuthenticated, async (req, res, next) => {
    const payload = req.body;

    try {
        const createdPlaylist = await Playlists.create(payload);
        res.status(201).json(createdPlaylist);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.post(
    '/:playlistId/addsong/:songId',
    isAuthenticated,
    async (req, res, next) => {
        const { userId } = req.payload;
        const { playlistId, songId } = req.params;

        try {
            const playlist = await Playlists.findOne({
                _id: playlistId,
                createdBy: userId,
            });

            if (playlist) {
                playlist.songs.push(songId);
                await playlist.save();

                res.status(200).json({
                    message: 'Song added to playlist successfully',
                });
            } else {
                res.status(404).json({
                    message: 'Playlist not found or not owned by the user',
                });
            }
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
);

// PUT one Playlist
router.put('/:playlistId', isAuthenticated, async (req, res, next) => {
    const payload = req.body;
    const { createdBy: userId } = payload;
    const { playlistId } = req.params;
    try {
        const playlistToUpdate = await Playlists.findById(playlistId);
        if (
            playlistToUpdate.createdBy &&
            playlistToUpdate.createdBy.toString() === userId
        ) {
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
    const { playlistId } = req.params;
    const { createdBy: userId } = req.payload;

    try {
        const playlistToDelete = await Playlists.findById(playlistId);
        if (playlistToDelete.createdBy[0] == userId) {
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
