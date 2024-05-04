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
app.post("/signup", usersController.signup);
app.post("/login", usersController.login);
app.get("/logout", usersController.logout);
app.get("/check-auth", requireAuth, usersController.checkAuth);

// Songs
app.get('/search',requireAuth, songsController.searchSong);
app.get("/songs", requireAuth, songsController.fetchSongs);
app.get("/songs/:id", requireAuth, songsController.fetchSong);
app.post("/songs", requireAuth, songsController.createSong);
app.put("/songs/:id", requireAuth, songsController.updateSong);
app.delete("/songs/:id", requireAuth, songsController.deleteSong);



// Start the Server
app.listen(process.env.PORT);
