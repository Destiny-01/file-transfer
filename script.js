const File = require("./models/File");
const db = require("./db/db");
const cloudinary = require("./services/cloudinary");

db();

const fetchData = async () => {
  try {
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const expiredFiles = await File.find({ createdAt: { $lt: pastDate } });
    console.log(expiredFiles, "ppp");

    if (expiredFiles.length) {
      for (const file of expiredFiles) {
        cloudinary.uploader.destroy(file.path);
        await file.remove();
      }
    }
    console.log("Job done");
  } catch (err) {
    console.log("ooops, err", err);
  }
};

fetchData();
