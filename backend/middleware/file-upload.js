const multer = require('multer');
const uuid = require('uuid');

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const fileUpload = multer({
  limits: 500000, // in bytes - 500KB upload limit
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/images');
    },
    filename: (req, file, cb) => {
      const extension = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuid.v1() + '.' + extension); // generate a random filename
    }
  }),
  fileFilter: (req, file, cb) => { // validate file
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid mime type!");
    cb(error, isValid);
  }
}); // returns a group of (preconfigured) middlewares

module.exports = fileUpload;
