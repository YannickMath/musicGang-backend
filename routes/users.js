var express = require('express');
var router = express.Router();
require('dotenv').config();

//identification Cloudinary
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


//import JWT
import jwt from 'jsonwebtoken';

const token = jwt.sign({ userId: '12345' }, 'your-secret-key');
console.log(token);




/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
