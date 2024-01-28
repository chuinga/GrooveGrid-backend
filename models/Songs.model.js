const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artist",
    required: true,
    trim: true,
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Album",
    required: true,
    trim: true,
  },
  genres: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Genre",
      trim: true,
      required: true,
    },
  ],
});

songSchema.index({ title: 1, album: 1 }, { unique: true });

const Song = mongoose.model("Song", songSchema);

module.exports = Song;
