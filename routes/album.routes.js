const router = require("express").Router();
// Import the models
const Album = require("../models/Album.model");

// GET all albums
router.get("/", async (req, res) => {
  try {
    const allAlbums = await Album.find();
    res.status(200).json(allAlbums);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting all the albums" });
  }
});
// GET one album
router.get("/:albumId", async (req, res) => {
  const { albumId } = req.params;
  try {
    const oneAlbum = await Album.findById(albumId);
    res.status(200).json(oneAlbum);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while getting this album" });
  }
});
// POST one album
router.post("/", async (req, res) => {
  const payload = req.body;
  try {
    const createdAlbum = await Album.create(payload);
    res.status(201).json(createdAlbum);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error while creating new album" });
  }
});
// PUT one album
router.put("/:albumId", async (req, res) => {
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
    res.status(500).json({ message: "Error while updating the album" });
  }
});
// DELETE one album
router.delete("/:albumId", async (req, res) => {
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
    res.status(500).json({ message: "Error while deleting the album" });
  }
});

module.exports = router;
