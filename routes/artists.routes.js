const router = require("express").Router();

// import model
const Artist = require("../models/Artist.model");

// create new Artist
router.post("/", async (req, res) => {
  const payload = req.body;
  try {
    const createdArtist = await Artist.create(payload);
    res.status(201).json(createdArtist);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating an Artist!!!" });
  }
});

// get all Artists
router.get("/", async (req, res) => {
  try {
    const allArtists = await Artist.find();
    res.status(200).json(allArtists);
  } catch (error) {
    res.status(500).json({ message: "Error getting all the Artists!!!" });
  }
});

// get one Artist
router.get("/:artistId", async (req, res) => {
  const { artistId } = req.params;
  try {
    const oneArtist = await Artist.findById(artistId);
    res.status(200).json(oneArtist);
  } catch (error) {
    res.status(500).json({ message: `Error getting ${artistId}` });
  }
});

// update one Artist
router.put("/:artistId", async (req, res) => {
    const { artistId } = req.params;
    const payload = req.body;
    try {
       const artistToUpdate = await Artist.findById(artistId);
       if (artistToUpdate) {
          const updatedArtist = await Artist.findByIdAndUpdate(artistId, payload, { new: true });
          res.status(200).json(updatedArtist);
       } else {
          res.status(404).json({ message: "Artist not found" });
       }
    } catch (error) {
       res.status(500).json({ message: "Error updating this Artist" });
    }
 });
 

// delete one Artist
router.delete("/:artistId", async (req, res) => {
    const { artistId } = req.params;
    try {
        const artistToDelete = await Artist.findByIdAndDelete(artistId);
        res.status(204).json({ message: 'Artist Deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting this Artist' });
    }
});

module.exports = router;
