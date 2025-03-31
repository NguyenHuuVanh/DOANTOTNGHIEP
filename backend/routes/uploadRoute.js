// backend/routes/uploadRoute.js
import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

const router = express.Router();

// Tạo thư mục upload nếu chưa tồn tại
const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${uuidv4()}${ext}`;
    cb(null, filename);
  },
});

// Filter file ảnh
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WEBP)"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
  },
});

// Endpoint upload ảnh
router.post("/upload-image", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn file ảnh",
      });
    }

    // Tạo URL truy cập ảnh
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    res.json({
      success: true,
      message: "Upload ảnh thành công",
      url: imageUrl,
    });
  } catch (error) {
    console.error("❌ Lỗi upload ảnh:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Lỗi server khi upload ảnh",
    });
  }
});

// Endpoint xóa ảnh
router.delete("/delete-image", (req, res) => {
  try {
    const { url } = req.body;
    const filename = path.basename(url);
    const filePath = path.join(uploadDir, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.json({
        success: true,
        message: "Xóa ảnh thành công",
      });
    }

    res.status(404).json({
      success: false,
      message: "Không tìm thấy ảnh",
    });
  } catch (error) {
    console.error("❌ Lỗi xóa ảnh:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa ảnh",
    });
  }
});

export default router;
