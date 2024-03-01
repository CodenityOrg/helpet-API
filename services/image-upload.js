const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const path = require("path");
const as3 = require("../as3");

aws.config.update(as3);
const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  const allowedFormats = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedFormats.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};

let storage;

if (["production", "development"].includes(process.env.NODE_ENV)) {
  storage = multerS3({
    acl: "public-read",
    s3,
    bucket: "helpet-bucket",
    key: function(_, file, cb) {
      cb(null, Date.now().toString());
    }
  });
} else {
  storage = multer.diskStorage({
    destination(_req, _file, cb) {
      const destPath = path.resolve(path.join(__dirname, "..", "/uploads"));
      cb(null, destPath);
    },
    filename(_req, _file, cb) {
      cb(null, Date.now().toString());
    }
  });
}

const upload = multer({
  fileFilter,
  storage
});

module.exports = upload;
