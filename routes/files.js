const { Router } = require("express");
const { v4: uuidv4 } = require("uuid");
const File = require("../models/File");
const sendMail = require("../services/emailService");
const upload = require("../services/multerService");

const router = Router();

router.get("/", (req, res) => {
  res.render("upload");
});

router.get("/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });

    if (!file) {
      return res.render("download", {
        error: "Link has expired or that file could not be found",
      });
    }

    return res.render("download", { file });
  } catch (err) {
    return res.render("download", { error: err.message });
  }
});

router.post("/", (req, res) => {
  try {
    upload(req, res, async (err) => {
      const { filename, path, size } = req.file;
      if (!req.file) {
        return res.render("upload", {
          error: "A file must be selected",
        });
      }

      if (err) {
        return res.render("upload", { error: err.message });
      }

      const newFile = new File({
        filename,
        uuid: uuidv4(),
        path,
        size,
      });

      await newFile.save();

      return res.json({
        file: `http://localhost:3000/${newFile.uuid}`,
      });
      // return res.render("upload");
    });
  } catch (err) {
    return res.render("upload", { error: err.message });
  }
});

router.get("/download/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });

    if (!file) {
      return res.render("download", {
        error: "Link has expired or that file could not be found",
      });
    }

    const filePath = `${__dirname}/../${file.path}`;

    res.download(filePath);
  } catch (err) {
    return res.render("download", { error: err.message });
  }
});

router.post("/send", async (req, res) => {
  try {
    const { uuid, emailTo, emailFrom } = req.body;
    const file = await File.findOne({ uuid });

    if (!uuid || !emailFrom || !emailTo) {
      return res.render("upload", {
        error: "All fields are required",
      });
    }

    if (file.sender) {
      return res.render("upload", {
        error: "Email already sent",
      });
    }

    file.sender = emailFrom;
    file.reciever = emailTo;
    await file.save();

    sendMail({
      from: emailFrom,
      to: emailTo,
      subject: "Sharp Share service",
      text: `${emailFrom} shared a file with you`,
      html: require("../services/emailTemplate")({
        emailFrom,
        downloadLink: `http://localhost:3000/${file.uuid}`,
        size: (bytes = file.size) => {
          const k = 1024;
          const sizes = ["Bytes", "KB", "MB", "GB"];
          const i = Math.floor(Math.log(bytes) / Math.log(k));
          return (
            parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
          );
        },
        expires: "24 hours",
      }),
    });
    return res.json({ success: true });
  } catch (err) {
    return res.render("upload", { error: err.message });
  }
});

module.exports = router;
