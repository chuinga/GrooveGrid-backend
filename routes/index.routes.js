const router = require('express').Router()

router.get('/', (req, res) => {
  res.json('All good in here');
})

const artistRouter = require('./artist.route');
router.use('/artist', artistRouter);

module.exports = router;
