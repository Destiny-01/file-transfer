const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    uuid: { type: String, required: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: String, required: true },
    sender: String,
    reciever: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);
