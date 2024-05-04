
// getting-started.js
const mongoose = require("mongoose");

const uri = process.env.DB_URL;

async function connectToDb() {
  try {
    await mongoose.connect(uri); // process.env is the way to load env
    console.log("Connected to Database");
  } catch (error) {
    console.log(error);
    console.log("Could not connect to database");
  }

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

module.exports = connectToDb; // export from here to import from another place

