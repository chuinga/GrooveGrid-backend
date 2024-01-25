const Songs = require('../models/Songs.model');
const router = require('express').Router();

// create new Song
router.post("/", async (req, res) => {
    const payload = req.body
    try {
        const newSong = await Songs.create(payload);
        res.status(201).json(newSong);
    }
    catch (error) {
        console.log(error);             
        res.status(500).json({ message: 'Error creating a Song!!!' });
    }
})

// get all Songs
router.get("/", async (req, res) => {
    try {
        const allSongs = await Songs.find()
        .populate('artist')
        .populate('album')
        .populate('genres');
        res.status(200).json(allSongs);
    }
    catch (error) {
        res.status(500).json({ message: 'Error getting all the Songs!!!' });
    }
})

// get one Song
router.get("/:songId", async (req, res) => {
    try {
        const songId = req.params.songId;
        const oneSong = await Songs.findById(songId)
        .populate('artist')
        .populate('album')
        .populate('genres');
        res.status(200).json(oneSong);
    } catch (error) {
        res.status(500).json({ message: `Error getting one Song` });
    }
});

// update one Song
router.put("/:songId", async (req, res) => {
    try {
        const songId = req.params.songId;
        const songToUpdate = req.body;   
        const updatedSong = await Songs.findByIdAndUpdate(songId, songToUpdate, { new: true });  
        if (!updatedSong) {
            return res.status(404).json({ message: 'Song not found' });
        }  
        res.status(200).json(updatedSong);
    } catch (error) {
        res.status(500).json({ message: 'Error updating this Song' });
    }
});

// delete one Song
router.delete("/:songId", async (req, res) => {
    try {
        const songId = req.params.songId;
        const deletedSong = await Songs.findByIdAndDelete(songId);
        if (!deletedSong) {
            return res.status(404).json({ message: "Song not found." });
        }
        res.status(200).send();
      } catch (error) {
        res.status(500).json({ message: 'Error deleting this Song' });
      }
});

module.exports = router;