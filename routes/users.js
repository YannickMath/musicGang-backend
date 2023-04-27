var express = require("express");
var router = express.Router();
require("dotenv").config();
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//identification Cloudinary
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

rrouter.post("/signup", async (req, res) => {
  const { firstname, username, mail, password } = req.body;

  // Validation de formulaire
  if (!firstname || !username || !mail || !password) {
    return res.status(400).json({
      success: false,
      error: "All fields are required",
    });
  }

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "Username already exists",
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const token = uid2(32); // Génération d'un token unique avec uid2

    const newUser = new User({
      firstname,
      username,
      mail,
      password: hash,
      token,
    });

    const savedUser = await newUser.save();

    // Création et envoi du token JWT
    const authToken = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      success: true,
      token,
      user: savedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});
module.exports = router;
