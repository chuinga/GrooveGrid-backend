const router = require('express').Router();

const Artist = require('../models/Artist.model');

// create new Artist
router.post('/', async (req, res, next) => {
    const payload = req.body;
    try {
        const createdArtist = await Artist.create(payload);
        res.status(201).json(createdArtist);
    } catch (error) {
        console.log(error);
        next(error); // Pass the error to the error handling middleware
    }
});

// get all Artists
router.get('/', async (req, res, next) => {
    try {
        const allArtists = await Artist.find();
        res.status(200).json(allArtists);
    } catch (error) {
        next(error);
    }
});

// get one Artist
router.get('/:artistId', async (req, res, next) => {
    const { artistId } = req.params;
    try {
        const oneArtist = await Artist.findById(artistId);
        res.status(200).json(oneArtist);
    } catch (error) {
        next(error);
    }
});
router.get('/', async (req, res) => {
    try {
        const allArtists = await Artist.find()
            .populate('albums')
            .populate('genre');

        res.status(200).json(allArtists);
    } catch (error) {
        res.status(500).json({ message: 'Error getting all the Artists!!!' });
    }
});

// get one Artist
router.get('/:artistId', async (req, res) => {
    const { artistId } = req.params;
    try {
        const oneArtist = await Artist.findById(artistId)
            .populate('albums')
            .populate('genre');

        res.status(200).json(oneArtist);
    } catch (error) {
        res.status(500).json({ message: `Error getting one artist!!!` });
    }
});

// update one Artist
router.put('/:artistId', async (req, res, next) => {
    const { artistId } = req.params;
    const payload = req.body;
    try {
        const artistToUpdate = await Artist.findById(artistId);
        if (artistToUpdate) {
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

// delete one Artist
router.delete('/:artistId', async (req, res, next) => {
    const { artistId } = req.params;
    try {
        const artistToDelete = await Artist.findByIdAndDelete(artistId);
        res.status(204).json({ message: 'Artist Deleted' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
