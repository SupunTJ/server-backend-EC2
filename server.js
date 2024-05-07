// Load env variables
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

// import dependancies
const express = require("express");

const connectToDb = require("./config/connectToDb");
const songsController = require("./controllers/songsController");
const usersController = require("./controllers/usersController");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const requireAuth = require("./middleware/requireAuth");

// create an express app
const app = express();

// configure express app
app.use(express.json()); // read json from the req body(express)
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Connect to database
connectToDb();

// Routing
// User
app.post("api/signup", usersController.signup);
app.post("api/login", usersController.login);
app.get("api/logout", usersController.logout);
app.get("api/check-auth", requireAuth, usersController.checkAuth);

// Songs
app.get('api/search',requireAuth, songsController.searchSong);
app.get("api/songs", requireAuth, songsController.fetchSongs);
app.get("api/songs/:id", requireAuth, songsController.fetchSong);
app.post("api/songs", requireAuth, songsController.createSong);
app.put("api/songs/:id", requireAuth, songsController.updateSong);
app.delete("api/songs/:id", requireAuth, songsController.deleteSong);



// Start the Server
app.listen(process.env.PORT);
