const app = require('./app');
const withDB = require('./db');
const genres = require('./genressamples.json');
const Genre = require('./models/Genre.model');
const artists = require('./artistssample.json');
const Artists = require('./models/Artist.model');
const albuns = require('./albumssample.json');
const Albuns = require('./models/Album.model');

const seed = async () => {
    try {
        const allGenres = await Albuns.insertMany(albuns);
        console.log(allGenres);
    } catch (error) {
        console.log(error);
    }
};
// seed();

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 5005
const PORT = process.env.PORT || 5005;

// ℹ️ Connects to the database
withDB(() => {
   // ℹ️ If connection was successful, start listening for requests
   app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
});
