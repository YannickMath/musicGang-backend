const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const uuidv4 = require("uuid").v4; 
const cloudinary = require("cloudinary").v2;
const multer = require("multer");


// configuration de cloudinary avec vos identifiants d'API
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ dest: '/tmp/' });

const fs = require("fs");


//creation middleware
const authMiddleware = (req, res, next) => {
  // Récupération du jeton JWT depuis l'en-tête Authorization
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  // Vérification de la validité du jeton JWT
  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }
};


// Route d'inscription
router.post("/signup", async (req, res) => {
  const { firstname, username, email, password } = req.body;

  // Validation de formulaire
  if (!firstname || !username || !email || !password) {
    return res.status(400).json({
      success: false,
      error: "All fields are required",
    });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "Email already exists",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstname,
      username,
      email,
      password: hash,
      uniqueId: uuidv4(), 
    });

    const savedUser = await newUser.save();

    // Création et envoi du token JWT
    const authToken = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      success: true,
      user: savedUser,
      authToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message, // utilise le vrai message d'erreur
    });
  }
});


router.post('/signin', authMiddleware, async (req, res) => {
  const {username, password} = req.body

    // Validation de formulaire
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    try {
      const user = await User.findOne({ password })

      if (!user) {
        console.log(res.json)
        return res.status(401).json({ result: false, error:"User not found!"})
        
      }

      const isPasswordMatch= await bcrypt.compare(password, user.password)
      if (!isPasswordMatch) {
        return res
        .status(401)
        .json({ result: false, error: "Incorrect password" });
      }

      return res.json({ result: true, user })
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        error: err.message, // utilise le vrai message d'erreur
      });
    }
  });



module.exports = router;
