import multer from "multer";
import fs from "fs";
import path from "path";

// Directory for file uploads
const uploadDir = "src/uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter to allow only CSV files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "text/csv") {
    cb(null, true);
  } else {
    cb(new Error("Only CSV files are allowed!"), false);
  }
};

// Multer upload middleware with file size limit (100MB)
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
}).single("file");

// Handle file upload response
export const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "No file uploaded or invalid file type (Only CSV allowed)",
    });
  }

  res.json({
    message: "File uploaded successfully",
    filename: req.file.filename,
    filePath: path.join(uploadDir, req.file.filename),
  });
};

// Get file path if it exists
export const getFilePath = (filename) => {
  const filePath = path.join(uploadDir, filename);
  return fs.existsSync(filePath) ? filePath : null;
};
