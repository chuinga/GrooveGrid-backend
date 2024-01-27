// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv').config();

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require('./config')(app);

// Using cors middleware for allowing cross-origin requests

// 👇 Start handling routes here
const indexRoutes = require('./routes/index.routes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const playlistRoutes = require('./routes/playlist.routes');

app.use('/api', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', userRoutes);
app.use('/api/playlists', playlistRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;
