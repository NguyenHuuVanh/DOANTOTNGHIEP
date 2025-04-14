require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const moment = require("moment");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
const { format } = require("date-fns");
const fs = require("fs");

// Nhập Sequelize và models
const { sequelize, User, NodeData, NodeAction, PasswordReset, syncDatabase } = require("./models");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Middleware CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Dữ liệu tĩnh (cho node_control, vì không có bảng trong DB)
const data = [
  {
    id: 1,
    name: "RELAY 1",
    description: "RELAY điều khiển",
    status: "OFF",
    date: "2024-12-01",
    time: "10:00",
  },
  {
    id: 2,
    name: "RELAY 2",
    description: "RELAY điều khiển",
    status: "OFF",
    date: "2024-12-01",
    time: "10:00",
  },
  {
    id: 3,
    name: "RELAY 3",
    description: "RELAY điều khiển",
    status: "OFF",
    date: "2024-12-01",
    time: "10:00",
  },
  {
    id: 4,
    name: "RELAY 4",
    description: "RELAY điều khiển",
    status: "OFF",
    date: "2024-12-01",
    time: "10:00",
  },
  {
    id: 5,
    name: "RELAY 5",
    description: "RELAY điều khiển",
    status: "OFF",
    date: "2024-12-01",
    time: "10:00",
  },
  {
    id: 6,
    name: "RELAY 6",
    description: "RELAY điều khiển",
    status: "OFF",
    date: "2024-12-01",
    time: "10:00",
  },
  {
    id: 7,
    name: "RELAY 7",
    description: "RELAY điều khiển",
    status: "OFF",
    date: "2024-12-01",
    time: "10:00",
  },
  {
    id: 8,
    name: "RELAY 8",
    description: "RELAY điều khiển",
    status: "OFF",
    date: "2024-12-01",
    time: "10:00",
  },
];

// Đồng bộ cơ sở dữ liệu khi server khởi động
syncDatabase();

// Reset password
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// API Node Control
app.get("/node_control", (req, res) => {
  res.json({ data });
});

app.put("/node_control/:id", (req, res) => {
  const { id } = req.params;
  const relay = data.find((r) => r.id === parseInt(id));

  if (!relay) {
    return res.status(404).json({ message: "Relay không tồn tại" });
  }

  relay.status = relay.status === "ON" ? "OFF" : "ON";
  relay.time = new Date().toLocaleTimeString();
  relay.date = new Date().toISOString().split("T")[0];

  res.json(relay);
});

app.get("/node_data", async (req, res) => {
  try {
    // Lấy ngày mới nhất
    const latestDate = await NodeData.max("created_at", {
      where: sequelize.where(
        sequelize.fn("DATE", sequelize.col("created_at")),
        sequelize.fn("DATE", sequelize.fn("NOW"))
      ),
    });

    if (!latestDate) {
      return res.status(404).send({ message: "Không có dữ liệu trong bảng" });
    }

    // Lấy dữ liệu của ngày mới nhất
    const data = await NodeData.findAll({
      where: sequelize.where(sequelize.fn("DATE", sequelize.col("created_at")), sequelize.fn("DATE", latestDate)),
    });

    const dataNodes = {
      node1: [],
      node2: [],
    };

    const formattedResults = data.map((row) => ({
      ...row.toJSON(),
      created_at: moment(row.created_at).format("YYYY-MM-DD HH:mm:ss"),
    }));

    formattedResults.forEach((item) => {
      if (item.device_id === 1) {
        dataNodes.node1.push(item);
      } else if (item.device_id === 2) {
        dataNodes.node2.push(item);
      }
    });

    res.status(200).json(dataNodes);
  } catch (error) {
    console.error("Lỗi khi truy vấn dữ liệu:", error.message);
    res.status(500).send({ error: "Lỗi server khi truy vấn dữ liệu" });
  }
});

app.post("/register", async (req, res) => {
  const { username, firstname, lastname, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please enter complete information" });
  }

  try {
    const existingUser = await User.findOne({
      where: { [sequelize.Op.or]: [{ username }, { email }] },
    });

    let errors = {};
    if (existingUser && existingUser.username === username) {
      errors.username = "Username already exists!";
    }
    if (existingUser && existingUser.email === email) {
      errors.email = "Email already exists!";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({
      username,
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    res.status(201).json({ message: "Registered successfully", userId: newUser.id });
  } catch (error) {
    res.status(500).json({ message: "Server error when adding user", error });
  }
});

app.post("/login", async (req, res) => {
  const { email, password, rememberMe } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter email and password" });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Account does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("Error: JWT_SECRET is not defined in .env");
      return res.status(500).json({ message: "Server Error: JWT_SECRET is not configured" });
    }

    const expiresIn = rememberMe ? "7d" : "1h";
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn });

    const formattedBirthday = user.birthday ? moment(user.birthday).format("DD/MM/YYYY") : "";

    res.json({
      message: "Log in successfully",
      token,
      user: {
        id: user.id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        language: user.language,
        birthday: formattedBirthday,
        phonenumber: user.phonenumber,
        country: user.country,
        address: user.address,
        message: user.message,
        profileimage: user.profileimage,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

app.post("/check-email", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    res.json({ exists: !!user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi kết nối cơ sở dữ liệu" });
  }
});

let verificationCodes = {};
app.post("/send-reset-code", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email is required" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationCodes[email] = { code, expiresAt: Date.now() + 15 * 60 * 1000 };

  const mailOptions = {
    from: "iotdevicemanager.id.vn",
    to: email,
    subject: "🔑 Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; background: #f4f4f4; border-radius: 8px;">
        <h2 style="color: #333; text-align: center;">🔐 Reset Your Password</h2>
        <p style="font-size: 16px; color: #555;">You requested a password reset. Use the verification code below:</p>
        <div style="font-size: 24px; font-weight: bold; text-align: center; padding: 10px; background: #fff; border-radius: 4px; border: 1px solid #ddd;">
          ${code}
        </div>
        <p style="font-size: 14px; color: #777; text-align: center;">This code will expire in <strong>15 minutes</strong>.</p>
        <p style="font-size: 14px; color: #777; text-align: center;">If you didn't request this, please ignore this email.</p>
        <p style="text-align: center; font-size: 12px; color: #999;">© 2025 Your Company. All rights reserved.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Verification code sent successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

app.post("/verify-reset-code", (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ success: false, message: "Email and code are required" });

  const data = verificationCodes[email];
  if (!data || data.code !== code || Date.now() > data.expiresAt) {
    return res.status(400).json({ success: false, message: "Invalid or expired code" });
  }

  delete verificationCodes[email];
  res.json({ success: true, message: "Verification successful!" });
});

app.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ success: false, message: "Email và mật khẩu mới là bắt buộc" });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    const user = await User.update({ password: hashedPassword }, { where: { email } });
    if (user[0] === 0) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
    }
    res.json({ success: true, message: "Mật khẩu đã được cập nhật thành công!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi cập nhật mật khẩu" });
  }
});

app.post("/change-password", async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Bạn chưa đăng nhập" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ thông tin" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Mật khẩu mới và xác nhận mật khẩu không khớp" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Mật khẩu mới phải có ít nhất 6 ký tự" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Mật khẩu hiện tại không đúng" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    await user.update({ password: hashedPassword });

    res.json({ success: true, message: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.error("JWT Error:", error.message);
    return res.status(401).json({ success: false, message: "Token không hợp lệ" });
  }
});

app.put("/update-user", async (req, res) => {
  const {
    id,
    username,
    firstname,
    lastname,
    language,
    birthday,
    phonenumber,
    country,
    address,
    message,
    profileimage,
  } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }

  try {
    const parsedDate = new Date(birthday);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Định dạng ngày sinh không hợp lệ (YYYY-MM-DD)",
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Không tìm thấy user để cập nhật" });
    }

    await user.update({
      username,
      firstname,
      lastname,
      language,
      birthday,
      phonenumber,
      country,
      address,
      message,
      profileimage,
    });

    const formattedBirthday = user.birthday ? moment(user.birthday).format("DD/MM/YYYY") : "";
    const updatedUser = {
      id: user.id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      language: user.language,
      birthday: formattedBirthday,
      phonenumber: user.phonenumber,
      country: user.country,
      address: user.address,
      message: user.message,
      profileimage: user.profileimage,
    };
    return res.status(200).json({ success: true, message: "Cập nhật thành công!", updatedUser });
  } catch (error) {
    console.error("❌ Lỗi cập nhật user:", error);
    return res.status(500).json({ success: false, message: "Lỗi server khi cập nhật user" });
  }
});

app.get("/user/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
    }

    const formattedBirthday = user.birthday ? moment(user.birthday).format("DD/MM/YYYY") : "";
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        language: user.language,
        birthday: formattedBirthday,
        phonenumber: user.phonenumber,
        country: user.country,
        address: user.address,
        message: user.message,
        profileimage: user.profileimage,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi lấy thông tin người dùng" });
  }
});

app.get("/validate-token", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.json({ valid: false });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true });
  } catch (error) {
    res.json({ valid: false });
  }
});

// Cấu hình Multer để lưu file ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/avatars/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Chỉ hỗ trợ file ảnh (jpeg, jpg, png)!"));
    }
  },
});

// Tạo thư mục uploads nếu chưa tồn tại
if (!fs.existsSync("uploads/avatars")) {
  fs.mkdirSync("uploads/avatars", { recursive: true });
}

app.use("/uploads", express.static("uploads"));

app.post("/upload-avatar", upload.single("avatar"), async (req, res) => {
  const userId = req.body.userId;
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Vui lòng chọn file ảnh" });
  }

  const avatarUrl = `/uploads/avatars/${req.file.filename}`;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
    }
    await user.update({ profileimage: avatarUrl });
    res.json({ success: true, avatarUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi lưu ảnh vào cơ sở dữ liệu" });
  }
});

app.delete("/delete-user/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const deleted = await User.destroy({ where: { id: userId } });
    if (deleted === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Database error", error });
  }
});

app.post("/node_actions", async (req, res) => {
  const { device_id, command, status } = req.body;
  try {
    const nodeAction = await NodeAction.create({
      device_id,
      command,
      status: status || "pending",
    });
    res.status(201).json({
      message: "Lịch sử command đã được lưu",
      id: nodeAction.id,
    });
  } catch (error) {
    console.error("Lỗi khi lưu lịch sử command:", error);
    res.status(500).json({ message: "Lỗi cơ sở dữ liệu", error });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
