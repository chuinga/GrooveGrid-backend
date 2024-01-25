const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'genre',
    },

    image: {
        type: String,
    },

    albums: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'albums',
        },
    ],
});

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;
