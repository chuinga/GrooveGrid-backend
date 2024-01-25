const Songs = require("../models/Songs.model");
const router = require("express").Router();

// POST create new Song
router.post("/", async (req, res, next) => {
  const payload = req.body;
  try {
    const newSong = await Songs.create(payload);
    res.status(201).json(newSong);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

// GET all Songs
router.get("/", async (req, res, next) => {
  try {
    const allSongs = await Songs.find()
      .populate("artist")
      .populate("album")
      .populate("genres");
    res.status(200).json(allSongs);
  } catch (error) {
    next(error);
  }
});

// GET one Song
router.get("/:songId", async (req, res, next) => {
  try {
    const songId = req.params.songId;
    const oneSong = await Songs.findById(songId)
      .populate("artist")
      .populate("album")
      .populate("genres");
    res.status(200).json(oneSong);
  } catch (error) {
    next(error);
  }
});

// UPDATE one Song
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

// DELETE one Song
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
