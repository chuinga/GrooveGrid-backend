const router = require("express").Router();
// Import the models
const Album = require("../models/Album.model");

// GET all albums
router.get("/", async (req, res, next) => {
  try {
    const allAlbums = await Album.find()
      .populate("artist")
      .populate("genre")
      .populate("tracks");
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
      .populate("artis")
      .populate("genre")
      .populate("tracks");
    res.status(200).json(oneAlbum);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
// POST one album
router.post("/", async (req, res, next) => {
  const payload = req.body;
  try {
    const createdAlbum = await Album.create(payload);
    res.status(201).json(createdAlbum);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
// PUT one album
router.put("/:albumId", async (req, res, next) => {
  const { albumId } = req.params;
  const payload = req.body;
  try {
    const albumToUpdate = await Album.findById(albumId);
    if (albumToUpdate) {
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
router.delete("/:albumId", async (req, res, next) => {
  const { albumId } = req.params;
  try {
    const albumToDelete = await Album.findById(albumId);
    if (albumToDelete) {
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
