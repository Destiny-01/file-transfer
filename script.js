const File = require("./models/File");
const fs = require("fs");
const db = require("./db/db");

db();

// console.log("Job start");
const fetchData = async () => {
  try {
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const expiredFiles = await File.find({ createdAt: { $lt: pastDate } });
    console.log(expiredFiles, "ppp");

    if (expiredFiles.length) {
      for (const file of expiredFiles) {
        fs.unlinkSync(file.path);
        await file.remove();
      }
      console.log("Job one");
    }
    console.log("Job done");
  } catch (err) {
    console.log("ooops, err", err);
  }
};
// console.log("Job end");

fetchData();
