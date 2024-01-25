const router = require("express").Router();

router.get("/", (req, res) => {
  res.json("All good in here");
});

const artistsRouter = require("./artists.routes");
router.use("/artists", artistsRouter);

const genreRouter = require("./genre.routes");
router.use("/genre", genreRouter);

const albumRouter = require("./album.routes");
router.use("/album", albumRouter);

const songsRouter = require("./songs.routes");
router.use("/songs", songsRouter);

module.exports = router;
