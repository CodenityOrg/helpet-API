const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const as3 = require("../as3");
aws.config.update(as3);
const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
  }
}

let storage

if (process.env.NODE_ENV === "production") {
  storage = multerS3({
    acl: 'public-read',
    s3,
    bucket: 'helpet-bucket',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
} else {
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/tmp/helpet-uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
}

const upload = multer({
  fileFilter,
  storage
});

module.exports = upload;