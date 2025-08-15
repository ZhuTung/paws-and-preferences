const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  filename: String,
  path: String,
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Image", ImageSchema);
