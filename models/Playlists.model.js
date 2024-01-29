const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    artists: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Artist',
        },
    ],
    songs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Song',
        },
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
