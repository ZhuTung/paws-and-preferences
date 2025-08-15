const express = require("express");
const multer = require("multer");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const Image = require("./models/Image");

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose
  .connect(
    "mongodb+srv://<db_username>:<db_password>@dev.5n7ub.mongodb.net/paws-and-preferences?retryWrites=true&w=majority",
    {
      useNewURLParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch((err) => console.error("MongoDB connection error: ", err));

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("image"), async (req, res) => {
  const { userId } = req.body;

  if (!req.file || !userId) {
    return res.status(400).json({
      error: "Image and userId are required",
    });
  }

  try {
    const newImage = new Image({
      userId,
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
    });

    await newImage.save();
    res.json({
      message: "Upload successful",
      filePath: newImage.path,
    });
  } catch (err) {
    res.status(500).json({
      error: "Database save failed: " + err.message,
    });
  }
});

app.get("/images/:userId", async (req, res) => {
  try {
    const images = await Image.find({ userId: req.params.userId })
      .sort({
        uploadedAt: -1,
      })
      .select("path -_id");

    res.json(images);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch images: " + err.message,
    });
  }
});

app.use("/uploads", express.static("uploads"));

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
