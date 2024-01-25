const { isAuthenticated } = require("../middleware/middleware.js");
// Import the models
const Songs = require("../models/Songs.model");
const User = require("../models/User.model");
const router = require("express").Router();

// GET all Songs
router.get("/", async (req, res, next) => {
  try {
    const allSongs = await Songs.find()
      .populate("artist")
      .populate("album")
      .populate("genres");
    res.status(200).json(allSongs);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
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

// POST create new Song
router.post("/", isAuthenticated, async (req, res, next) => {
  const payload = req.body;
  const { userId } = req.payload;
  payload.createdBy = userId;
  try {
    const newSong = await Songs.create(payload);
    res.status(201).json(newSong);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// UPDATE one Song
router.put("/:songId", isAuthenticated, async (req, res, next) => {
  const { userId } = req.payload;
  const songId = req.params.songId;
  const songToUpdate = req.body;
  try {
    const existingSong = await Songs.findById(songId);
    if (!existingSong) {
      return res.status(404).json({ message: "Song not found" });
    }
    if (existingSong.createdBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this song" });
    }
    const updatedSong = await Songs.findByIdAndUpdate(songId, songToUpdate, {
      new: true,
    });
    res.status(200).json(updatedSong);
  } catch (error) {
    next(error);
  }
});

// DELETE one Song
router.delete("/:songId", isAuthenticated, async (req, res, next) => {
  const { userId } = req.payload;
  const { songId } = req.params;
  try {
    const songToDelete = await Songs.findById(songId);
    if (songToDelete.createdBy == userId) {
      await Songs.findByIdAndDelete(songId);
      res.status(204).json();
    } else {
      res.status(404).json({ message: "Song not found" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
