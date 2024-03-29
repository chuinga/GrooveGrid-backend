const { isAuthenticated } = require("../middleware/middleware.js");
const mongoose = require("mongoose");
// Import the models
const Playlists = require("../models/Playlists.model");
const User = require("../models/User.model");
const router = require("express").Router();

// GET all Playlists
router.get("/", async (req, res, next) => {
  try {
    const userId = req.query.userId;
    const allPlaylists = await Playlists.find({ createdBy: userId })
      .populate("artists")
      .populate("songs");
    res.status(200).json(allPlaylists);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// GET one Playlist
router.get("/:playlistId", async (req, res, next) => {
  const { playlistId } = req.params;
  const userId = req.query.userId;

  try {
    const onePlaylist = await Playlists.findOne({
      createdBy: userId,
      _id: playlistId,
    })
      .populate("artists")
      .populate("songs");
    res.status(200).json(onePlaylist);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// POST one Playlist
router.post("/", isAuthenticated, async (req, res, next) => {
  const payload = req.body;

  try {
    const createdPlaylist = await Playlists.create(payload);
    res.status(201).json(createdPlaylist);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post(
  "/:playlistId/addsong/:songId",
  isAuthenticated,
  async (req, res, next) => {
    const { playlistId, songId } = req.params;
    const {
      createdBy: userId,
      song: { title, artist },
    } = req.body;

    try {
      const playlist = await Playlists.findOne({
        _id: playlistId,
        createdBy: userId,
      });

      if (playlist) {
        playlist.songs.push({
          _id: songId,
          title,
          artist,
        });
        await playlist.save();

        res.status(200).json({
          message: "Song added to playlist successfully",
        });
      } else {
        res.status(404).json({
          message: "Playlist not found or not owned by the user",
        });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

// PUT one Playlist
router.put("/:playlistId", isAuthenticated, async (req, res, next) => {
  const payload = req.body;
  const { createdBy: userId } = payload;
  const { playlistId } = req.params;
  try {
    const playlistToUpdate = await Playlists.findById(playlistId);
    if (
      playlistToUpdate.createdBy &&
      playlistToUpdate.createdBy.toString() === userId
    ) {
      const updatedPlaylist = await Playlists.findByIdAndUpdate(
        playlistId,
        payload,
        {
          new: true,
        }
      );
      res.status(200).json(updatedPlaylist);
    } else {
      res.status(400).json({ message: "Playlist not found" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// DELETE one Playlist
router.delete("/:playlistId", isAuthenticated, async (req, res, next) => {
  const { playlistId } = req.params;
  const { createdBy: userId } = req.payload;

  try {
    const playlistToDelete = await Playlists.findById(playlistId);
    if (playlistToDelete.createdBy[0] == userId) {
      await Playlists.findByIdAndDelete(playlistId);
      res.status(204).json();
    } else {
      res.status(404).json({ message: "Playlist not found" });
    }
  } catch (error) {
    next(error);
  }
});
// DELETE a song from a Playlist
router.delete(
  "/:playlistId/removesong/:songId",
  isAuthenticated,
  async (req, res, next) => {
    console.log(req.payload);
    console.log(req.params);
    const { playlistId, songId } = req.params;
    const { _id } = req.payload;

    try {
      const playlist = await Playlists.findById(playlistId);
      console.log(playlist);
      // Check if the playlist exists
      if (!playlist) {
        return res.status(404).json({ message: "Playlist not found" });
      }
      console.log(_id);
      // Verify the user is authorized to modify the playlist
      if (!playlist.createdBy.equals(_id)) {
        return res
          .status(403)
          .json({ message: "Unauthorized to modify this playlist" });
      }

      // Check if the songId is valid and if the song exists in the playlist
      if (
        !mongoose.Types.ObjectId.isValid(songId) ||
        !playlist.songs.some((song) => song._id.equals(songId))
      ) {
        return res.status(400).json({
          message: "Invalid songId or song not found in the playlist",
        });
      }

      // Remove the song from the playlist
      playlist.songs = playlist.songs.filter(
        (song) => !song._id.equals(songId)
      );

      // Save the updated playlist
      await playlist.save();

      res
        .status(200)
        .json({ message: "Song removed from playlist successfully" });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

module.exports = router;
