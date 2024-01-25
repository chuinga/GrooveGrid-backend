const Songs = require("../models/Songs.model");
const router = require("express").Router();

// create new Song
router.post("/", async (req, res, next) => {
  const payload = req.body;
  try {
    const newSong = await Songs.create(payload);
    res.status(201).json(newSong);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

// get all Songs
router.get("/", async (req, res, next) => {
  try {
    const allSongs = await Songs.find();
    res.status(200).json(allSongs);
  } catch (error) {
    next(error);
  }
});

// get one Song
router.get("/:songId", async (req, res, next) => {
  try {
    const songId = req.params.songId;
    const oneSong = await Songs.findById(songId);
    res.status(200).json(oneSong);
  } catch (error) {
    next(error);
  }
});

// update one Song
router.put("/:songId", async (req, res, next) => {
  try {
    const songId = req.params.songId;
    const songToUpdate = req.body;
    const updatedSong = await Songs.findByIdAndUpdate(songId, songToUpdate, {
      new: true,
    });
    if (!updatedSong) {
      return res.status(404).json({ message: "Song not found" });
    }
    res.status(200).json(updatedSong);
  } catch (error) {
    next(error);
  }
});

// delete one Song
router.delete("/:songId", async (req, res, next) => {
  try {
    const songId = req.params.songId;
    const deletedSong = await Songs.findByIdAndDelete(songId);
    if (!deletedSong) {
      return res.status(404).json({ message: "Song not found." });
    }
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
