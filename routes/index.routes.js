const router = require("express").Router();

router.get("/", (req, res) => {
  res.json("All good in here");
});

const artistsRouter = require("../routes/artists.route");
router.use("/artists", artistsRouter);

const genreRouter = require("../routes/genre.routes");
router.use("/genre", genreRouter);

module.exports = router;
