const router = require('express').Router()

router.get('/', (req, res) => {
  res.json('All good in here');
})

const artistsRouter = require('./artists.routes');
router.use('/artists', artistsRouter);

module.exports = router;
