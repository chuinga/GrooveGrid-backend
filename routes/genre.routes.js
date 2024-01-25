const router = require('express').Router();

const Genre = require('../models/Genre.model.js');

// GET all Genres
router.get('/genres', async (req, res, next) => {
    try {
        const allGenres = await Genre.find();
        res.status(200).json(allGenres);
    } catch (error) {
        console.log(error);
        next(error); // Pass the error to the error handling middleware
    }
    router.get('/genres', async (req, res) => {
        try {
            const allGenres = await Genre.find()
                .populate('artists')
                .populate('albums')
                .populate('songs');

            res.status(200).json(allGenres);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'error while getting all the genres',
            });
        }
    });

    // GET one genre
    router.get('/genres/:genreId', async (req, res, next) => {
        const { genreId } = req.params;
        try {
            const oneGenre = await Genre.findById(genreId);
            res.status(200).json(oneGenre);
        } catch (error) {
            console.log(error);
            next(error);
        }
    });

    router.get('/genres/:genreId', async (req, res) => {
        const { genreId } = req.params;
        try {
            const oneGenre = await Genre.findById(genreId)
                .populate('artists')
                .populate('albums')
                .populate('songs');

            res.status(200).json(oneGenre);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'error while getting this genre' });
        }
    });

    // POST a new genre
    router.post('/genres', async (req, res) => {
        const payload = req.body;
        try {
            const createdGenre = await Genre.create(payload);
            res.status(201).json(createdGenre);
        } catch (error) {
            console.log(error);
            next(error);
            res.status(500).json({ message: 'error while creating new genre' });
        }
    });

    // PUT update the genre
    router.put('/genres/:genreId', async (req, res, next) => {
        const { genreId } = req.params;
        const payload = req.body;

        try {
            const updatedGenre = await Genre.findByIdAndUpdate(
                genreId,
                payload,
                { new: true }
            )
                .populate('artists')
                .populate('albums')
                .populate('songs');

            if (updatedGenre) {
                res.status(200).json(updatedGenre);
            } else {
                res.status(400).json({ message: 'Genre not found' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error while updating the genre' });
        }
    });
});

// DELETE genre
router.delete('/genres/:genreId', async (req, res, next) => {
    const { genreId } = req.params;
    try {
        const genreToDelete = await Genre.findById(genreId);
        if (genreToDelete) {
            await Genre.findByIdAndDelete(genreId);
            res.status(204).json();
        } else {
            res.status(404).json({ message: 'Genre not found' });
        }
    } catch (error) {
        next(error);
        res.status(404).json({ message: 'Genre not found' });
    }
});

module.exports = router;
