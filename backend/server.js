require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const moment = require("moment");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
const { format } = require("date-fns");
// import router from "./routes/uploadRoute";
let verificationCodes = {}; // Lưu mã xác nhận tạm thời

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
// app.use("/api", router);
// app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const connection = mysql.createConnection(dbConfig);

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

connection.connect((err) => {
  if (err) {
    console.error("Kết nối thất bại:", err.message);
    return;
  }
  console.log("Kết nối thành công đến MySQL!");
});

// reset password
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, // Thay bằng email của bạn
    pass: process.env.EMAIL_PASS, // Thay bằng mật khẩu ứng dụng của bạn
  },
});

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER, // Email của bạn
//     pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng Gmail
//   },
// });

// api node control
app.get("/node_control", (req, res) => {
  res.json({
    data,
  });
});

app.put("/node_control/:id", (req, res) => {
  const { id } = req.params;
  const relay = data.find((r) => r.id === parseInt(id));

  if (!relay) {
    return res.status(404).json({ message: "Relay không tồn tại" });
  }

  // Cập nhật trạng thái
  relay.status = relay.status === "ON" ? "OFF" : "ON";
  relay.time = new Date().toLocaleTimeString();
  relay.date = new Date().toISOString().split("T")[0];

  res.json(relay);
});

app.get("/node_data", (req, res) => {
  // const query = "SELECT * FROM node_data"; // Truy vấn lấy toàn bộ dữ liệu từ bảng node_data
  const query = "SELECT * FROM node_data WHERE DATE(created_at) = '2024-12-24'"; // Truy vấn lấy toàn bộ dữ liệu từ bảng node_data
  connection.query(query, (err, data) => {
    const dataNodes = {
      node1: [],
      node2: [],
    };

    if (err) {
      console.error("Lỗi khi truy vấn dữ liệu:", err.message);
      res.status(500).send({ error: "Lỗi server khi truy vấn dữ liệu" });
      return;
    }

    // Định dạng lại trường created_at
    const formattedResults = data.map((row) => ({
      ...row,
      created_at: moment(row.created_at).format("YYYY-MM-DD HH:mm:ss"),
    }));

    formattedResults.forEach((item) => {
      if (item.device_id === 1) {
        dataNodes.node1.push(item);
      } else if (item.device_id === 2) {
        dataNodes.node2.push(item);
      }
    });

    res.status(200).json(dataNodes); // Trả về kết quả dưới dạng JSON
  });
});

app.post("/register", (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please enter complete information" });
  }

  // Kiểm tra xem username và email có bị trùng không
  const checkQuery = "SELECT username, email FROM users WHERE username = ? OR email = ?";
  connection.query(checkQuery, [username, email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Server error while checking data", error: err });
    }

    // Xác định lỗi riêng biệt
    let errors = {};
    if (result.some((user) => user.username === username)) {
      errors.username = "Username already exists!";
    }
    if (result.some((user) => user.email === email)) {
      errors.email = "Email already exists!";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // Nếu không trùng, tiến hành mã hóa mật khẩu và lưu vào database
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) return res.status(500).json({ message: "Password encryption error" });

      const insertQuery = "INSERT INTO users (`username`, `email`, `password`, `role`) VALUES (?, ?, ?, ?)";
      connection.query(insertQuery, [username, email, hash, role || "user"], (err, result) => {
        if (err) {
          return res.status(500).json({ message: "Server error when adding user" });
        }
        res.status(201).json({ message: "Registered successfully", userId: result.insertId });
      });
    });
  });
});

app.post("/login", (req, res) => {
  const query = "SELECT * FROM users WHERE email = ?";
  const { email, password, username, birthday, message, timezone, create_at, country, language, phonenumber } =
    req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter email and password" });
  }

  connection.query(query, [email], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database query error", error: err });
    }

    if (data.length === 0) {
      return res.status(404).json({ message: "Account does not exist" });
    }

    const user = data[0];

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error when comparing passwords", error: err });
      }
      if (!result) {
        return res.status(401).json({ message: "Wrong password" });
      }

      // Kiểm tra biến môi trường JWT_SECRET
      if (!process.env.JWT_SECRET) {
        console.error("Error: JWT_SECRET is not defined in .env");
        return res.status(500).json({ message: "Server Error: JWT_SECRET is not configured" });
      }

      // Tạo token JWT
      const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({
        message: "Log in successfully",
        token,
        user: {
          id: user.id,
          username: user.username,
          birthday: user.birthday,
          message: user.message,
          timezone: user.timezone,
          create_at: user.create_at,
          country: user.country,
          language: user.language,
          email: user.email,
          password: user.password,
          phonenumber: user.phonenumber,
          role: user.role,
        },
      });
    });
  });
});

app.post("/check-email", async (req, res) => {
  const { email } = req.body;
  const query = "SELECT * FROM users WHERE email = ?";

  connection.query(query, [email], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Lỗi kết nối cơ sở dữ liệu" });
    }
    if (result.length === 0) {
      return res.json({ exists: false });
    }
    res.json({ exists: true });
  });
});

// send-reset-code endpoint
app.post("/send-reset-code", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email is required" });

  const code = Math.floor(100000 + Math.random() * 900000).toString(); // Mã 6 chữ số
  verificationCodes[email] = { code, expiresAt: Date.now() + 15 * 60 * 1000 }; // Hết hạn sau 15 phút

  const mailOptions = {
    from: "your-email@gmail.com",
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
        <p style="text-align: center; font-size: 12px; color: #999;">&copy; 2025 Your Company. All rights reserved.</p>
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

  delete verificationCodes[email]; // Xóa mã sau khi xác minh thành công
  res.json({ success: true, message: "Verification successful!" });
});

// 🔑 Cập nhật mật khẩu mới vào MySQL
app.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ success: false, message: "Email và mật khẩu mới là bắt buộc" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, saltRounds); // Mã hóa mật khẩu trước khi lưu

  const query = "UPDATE users SET password = ? WHERE email = ?";
  connection.query(query, [hashedPassword, email], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Lỗi cập nhật mật khẩu" });
    }
    res.json({ success: true, message: "Mật khẩu đã được cập nhật thành công!" });
  });
});

//update infomation account
app.put("/update-user", (req, res) => {
  const { id, username, language, birthday, phonenumber, country, address, message, profileimage } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }

  try {
    // Parse ngày từ chuỗi YYYY-MM-DD
    const parsedDate = new Date(birthday);
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date");
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Định dạng ngày sinh không hợp lệ (YYYY-MM-DD)",
    });
  }

  // Câu lệnh SQL để cập nhật thông tin user
  const sql = `
    UPDATE users 
    SET 
      username = ?, 
      language = ?, 
      birthday = ?, 
      phonenumber = ?, 
      country = ?, 
      address = ?, 
      message = ?, 
      profileimage = ? 
    WHERE id = ?
  `;

  const values = [username, language, birthday, phonenumber, country, address, message, profileimage, id];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Lỗi cập nhật user:", err);
      return res.status(500).json({ success: false, message: "Lỗi server khi cập nhật user" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Không tìm thấy user để cập nhật" });
    }

    // Query lại user từ database để lấy dữ liệu chính xác
    const getSql = "SELECT * FROM users WHERE id = ?";
    connection.query(getSql, [id], (err, users) => {
      if (err || users.length === 0) {
        return res.status(500).json({ success: false, message: "Lỗi khi lấy thông tin user" });
      }

      const user = users[0];

      // Định dạng lại birthday từ database
      const formattedBirthday = moment(user.birthday).format("DD/MM/YYYY");
      // Trả về user mới sau khi cập nhật
      const updatedUser = {
        id: user.id,
        username: user.username,
        language: user.language,
        birthday: formattedBirthday,
        phoneNumber: user.phonenumber, // Lấy từ database
        country: user.country, // Lấy từ database
        address: user.address, // Lấy từ database
        message: user.message, // Lấy từ database
        profileImage: user.profileimage, // Lấy từ database
      };
      return res.status(200).json({ success: true, message: "Cập nhật thành công!", updatedUser });
    });
  });
});

// 🟢 API lấy thông tin user theo ID
app.get("/user/:id", (req, res) => {
  const userId = req.params.id;

  connection.query("SELECT * FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) {
      console.error("❌ Lỗi lấy thông tin user:", err);
      return res.status(500).json({ success: false, message: "Lỗi server khi lấy user" });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "User không tồn tại" });
    }

    return res.status(200).json({ success: true, user: results[0] });
  });
});

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("Welcome to my application");
});

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
