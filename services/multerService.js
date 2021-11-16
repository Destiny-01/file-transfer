const multer = require("multer");

module.exports = multer({
  storage: multer.diskStorage({}),
  limit: { fileSize: 1024 * 1024 * 1024 },
}).single("myfile");
