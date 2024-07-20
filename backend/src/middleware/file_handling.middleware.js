const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (_, _, cb) {
    cb(null, "./public");
  },
  filename: function (_, file, cb) {
    const date = Date.now();
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
});

module.exports = upload;
