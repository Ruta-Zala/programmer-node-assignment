import express from "express";
import dotenv from "dotenv";
import { loginUser, verifyToken } from "./services/authService.js";
import { upload, uploadFile } from "./services/fileService.js";
import { transformData } from "./services/transformService.js";

dotenv.config();
const app = express();
app.use(express.json());

// User login and JWT token generation
app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;
  const token = loginUser(username, password);
  token
    ? res.json({ token })
    : res.status(401).json({ message: "Invalid credentials" });
});

// File upload with progress tracking
app.post("/upload", (req, res) => {
  const token = req.header("Authorization")?.split(" ")[1];
  const user = verifyToken(token);
  if (!user)
    return res.status(401).json({ message: "Access denied, invalid token" });

  let uploadedSize = 0;
  let totalSize = parseInt(req.headers["content-length"], 10) || 1;

  req.on("data", (chunk) => {
    uploadedSize += chunk.length;
    const progress = ((uploadedSize / totalSize) * 100).toFixed(2);
    console.log(`Upload Progress: ${progress}%`);
  });

  upload(req, res, (err) => {
    if (err)
      return res
        .status(400)
        .json({ message: "File upload failed", error: err.message });
    uploadFile(req, res);
  });
});

// Transform CSV data based on user-defined mapping
app.post("/transform", (req, res) => {
  const token = req.header("Authorization")?.split(" ")[1];
  const user = verifyToken(token);
  if (!user)
    return res.status(401).json({ message: "Access denied, invalid token" });

  const { mapping } = req.body;
  const filename = req.query.filename;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;

  if (!filename || !mapping) {
    return res
      .status(400)
      .json({ message: "Filename and mapping are required" });
  }

  transformData({ filename, mapping, page, limit }, (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Data transformation failed", error: err.message });
    res.json(results);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
