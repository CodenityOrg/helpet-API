const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const as3 = require("../as3");

aws.config.update({
  secretAccessKey: as3.secretAccessKey,
  accessKeyId: as3.accessKeyId,
  region: as3.region
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
  }
}

const upload = multer({
  fileFilter,
  storage: multerS3({
    acl: 'public-read',
    s3,
    bucket: 'helpetdb',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
});

module.exports = upload;