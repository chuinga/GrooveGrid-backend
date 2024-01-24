
const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genre',
  },
  tracks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song',
    },
  ],
  coverImageUrl: {
    type: String,
  },
  description: {
    type: String,
  },
});

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
