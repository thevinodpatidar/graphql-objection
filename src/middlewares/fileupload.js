const multer = require("multer");
var cloudinary = require('cloudinary');
const cloudinaryStorage = require("multer-storage-cloudinary");

cloudinary.config({ 
  cloud_name: 'hl3q6hdpo', 
  api_key: '717782147554926', 
  api_secret: 'lYN1NUKMnEngAPCZ6wVThhDWmGE'
});

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "images",
  allowedFormats: ["jpg", "png","jpeg"],
  transformation: [{ width: 500, height: 500, crop: "limit" }],
  filename: (req, file, cb) => {
    cb(null, Date.now());
  }
  });
  const parser = multer({ storage: storage });

module.exports = {
  parser,
  cloudinary
};
