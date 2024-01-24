router.get('/', (req, res) => {
  res.json('All good in here');
})

const artistRouter = require('./artist.route');
router.use('/artist', artistRouter);

const genreRouter = require("./genre.routes");
router.use("/genre", genreRouter);


module.exports = router;
