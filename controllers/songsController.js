const Song = require("../models/song");

const fetchSongs = async (req, res) => {
  try {
    // find the songs
    const songs = await Song.find({ user: req.user._id });
    // respond with them
    res.json({ songs: songs });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

const fetchSong = async (req, res) => {
  try {
    //Get id off the url
    const songId = req.params.id;

    // Find the note using that id
    const song = await Song.findOne({ _id: songId, user: req.user._id });

    // Respond with the
    res.json({ song: song });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const createSong = async (req, res) => {
  try {
    // Get the sent in data off request body

    const name = req.body.name;
    const artist = req.body.artist;
    const genre = req.body.genre;
    const songUrl = req.body.songUrl;

    // Create a user with it
    const song = await Song.create({
      name: name,
      artist: artist,
      genre: genre,
      songUrl: songUrl,
      user: req.user._id,
    });
    // Respond with the new user
    res.json({ song: song });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const updateSong = async (req, res) => {
  try {
  
  // Get the id off the url
  const songId = req.params.id;

  //Get the data off the req body
  const name = req.body.name;
  const artist = req.body.artist;
  const genre = req.body.genre;
  const songUrl = req.body.songUrl;

  // Find and Update the record
  await Song.findOneAndUpdate(
    { _id: songId, user: req.user._id },
    {
      name: name,
      artist: artist,
      genre: genre,
      songUrl: songUrl,
      user: req.user._id,
    }
  );

  // Find Updated Note
  const song = await Song.findById(songId);

  // Respond with it
  res.json({ song: song });
  }catch (error) {
    console.log(error);
    res.sendStatus(400);
  }

};

const deleteSong = async (req, res) => {
  try{// get id off url
  const songId = req.params.id;

  // delete the record
  await Song.deleteOne({ _id: songId, user: req.user._id });

  // respond
  res.json({ success: "Record deleted successful" });
  }catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

const searchSong = async (req, res) => {
  const { query } = req.query;

  try {
    const searchResults = await Song.searchSongs(query);
    res.json(searchResults);
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ error: 'An error occurred while searching.' });
  }
};

module.exports = {
  fetchSongs: fetchSongs,
  fetchSong: fetchSong,
  createSong: createSong,
  updateSong: updateSong,
  deleteSong: deleteSong,
  searchSong: searchSong,
};
// exporting all the functions