const { isAuthenticated } = require("../middleware/middleware.js");
// Import the models
const Album = require("../models/Album.model");
const Song = require("../models/Songs.model.js");
const User = require("../models/User.model");
const router = require("express").Router();

// GET all Albums
router.get("/", async (req, res, next) => {
  try {
    const allAlbums = await Album.find().populate("artist").populate("genre");
    res.status(200).json(allAlbums);
  } catch (error) {
    console.error(error);
    next(error); // Pass the error to the error handling middleware
  }
});

// GET one album
router.get("/:albumId", async (req, res, next) => {
  const { albumId } = req.params;
  try {
    const oneAlbum = await Album.findById(albumId)
      .populate("artist")
      .populate("genre");
    // Fetch songs for this album
    const songs = await Song.find({ album: albumId })
      .populate("artist")
      .populate("genres");
    // Combine album info with songs
    const albumWithSongs = {
      ...oneAlbum.toObject(), // Convert Mongoose document to plain object
      songs,
    };

    res.status(200).json(albumWithSongs);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// POST one album
router.post("/", isAuthenticated, async (req, res, next) => {
  const payload = req.body;
  const { userId } = req.payload;
  payload.createdBy = userId;
  try {
    const createdAlbum = await Album.create(payload);
    res.status(201).json(createdAlbum);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// PUT one album
router.put("/:albumId", isAuthenticated, async (req, res, next) => {
  const { userId } = req.payload;
  const payload = req.body;
  const { albumId } = req.params;
  try {
    const albumToUpdate = await Album.findById(albumId);
    if (albumToUpdate.createdBy == userId) {
      const updatedAlbum = await Album.findByIdAndUpdate(albumId, payload, {
        new: true,
      });
      res.status(200).json(updatedAlbum);
    } else {
      res.status(400).json({ message: "Album not found" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// DELETE one album
router.delete("/:albumId", isAuthenticated, async (req, res, next) => {
  const { userId } = req.payload;
  const { albumId } = req.params;
  try {
    const albumToDelete = await Album.findById(albumId);
    if (albumToDelete.createdBy == userId) {
      await Album.findByIdAndDelete(albumId);
      res.status(204).json();
    } else {
      res.status(404).json({ message: "Album not found" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
