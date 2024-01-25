const router = require('express').Router();

router.get('/', (req, res) => {
    res.json('All good in here');
});

const artistsRouter = require('../routes/artists.routes');
router.use('/artists', artistsRouter);

const genreRouter = require('./genre.routes');
router.use('/genre', genreRouter);

module.exports = router;
