const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function signup(req, res) {
  try {
    // Get the email and passwrd off req body
    const { firstName, lastName, birthday, email, password } = req.body;

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10); // 10 means how many times the encryption happen

    // Check if any of the required parameters are missing
    if (!firstName || !lastName || !birthday || !email || !password) {
      throw new Error("One or more required input parameters are missing.");
    }

    // Create a user with the data
    await User.create({
      firstName,
      lastName,
      birthday,
      email,
      password: hashedPassword,
    });

    // respond
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    console.log(res.status(400));
    //res.sendStatus(400);
  }
}

async function login(req, res) {
  try {
    // Get the email and password from the request body
    const { email, password } = req.body;

    // Find the user with the requested email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Email or password is incorrect" });
    }

    // Compare sent in password with the found user's password hash
    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Email or password is incorrect" });
    }

    // Create a JWT token
    const exp = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days
    const token = jwt.sign({ sub: user._id, exp }, process.env.SECRET);

    // Send the cookie
    res.cookie("Authorization", token, {
      expires: new Date(exp),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    // Send a success response
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
}

function logout(req, res) {
  try {
    res.clearCookie("Authorization");
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
}

function checkAuth(req, res) {
  try {
    res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(400);
  }
}

module.exports = {
  signup,
  login,
  logout,
  checkAuth,
};
