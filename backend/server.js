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
let verificationCodes = {}; // Lưu mã xác nhận tạm thời

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
const data = require("./dataControl.json");

// Thêm middleware cors
app.use(
  cors({
    origin: "*", // Hoặc chỉ định domain của frontend, ví dụ: 'https://example.com'
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const connection = mysql.createConnection(dbConfig);

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
  // Truy vấn để lấy ngày mới nhất
  const latestDateQuery = "SELECT MAX(DATE(created_at)) AS latest_date FROM node_data";

  connection.query(latestDateQuery, (err, result) => {
    if (err) {
      console.error("Lỗi khi truy vấn ngày mới nhất:", err.message);
      res.status(500).send({ error: "Lỗi server khi truy vấn ngày mới nhất" });
      return;
    }

    const latestDate = result[0].latest_date;

    if (!latestDate) {
      res.status(404).send({ message: "Không có dữ liệu trong bảng" });
      return;
    }

    // Truy vấn để lấy dữ liệu của ngày mới nhất
    const query = "SELECT * FROM node_data WHERE DATE(created_at) = ?";
    connection.query(query, [latestDate], (err, data) => {
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
});

app.post("/register", (req, res) => {
  const { username, firstname, lastname, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please enter complete information" });
  }

  const checkQuery = "SELECT username, email FROM users WHERE username = ? OR email = ?";
  connection.query(checkQuery, [username, email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Server error while checking data", error: err });
    }

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

    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) return res.status(500).json({ message: "Password encryption error" });

      const insertQuery =
        "INSERT INTO users (`username`, `firstname`, `lastname`, `email`, `password`, `role`) VALUES (?, ?, ?, ?, ?, ?)";
      connection.query(insertQuery, [username, firstname, lastname, email, hash, role || "user"], (err, result) => {
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
  const { email, password } = req.body;

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

      if (!process.env.JWT_SECRET) {
        console.error("Error: JWT_SECRET is not defined in .env");
        return res.status(500).json({ message: "Server Error: JWT_SECRET is not configured" });
      }

      const expiresIn = req.body.rememberMe ? "7d" : "1h";
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn });

      // Định dạng lại birthday trước khi trả về
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

// thay đổi mật khẩu
app.post("/change-password", (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const token = req.headers.authorization?.split(" ")[1]; // Lấy token từ header (Bearer token)

  // Kiểm tra xem người dùng đã đăng nhập chưa
  if (!token) {
    return res.status(401).json({ success: false, message: "Bạn chưa đăng nhập" });
  }

  try {
    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Kiểm tra dữ liệu đầu vào
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ thông tin" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Mật khẩu mới và xác nhận mật khẩu không khớp" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Mật khẩu mới phải có ít nhất 6 ký tự" });
    }

    // Lấy mật khẩu hiện tại từ cơ sở dữ liệu
    const query = "SELECT password FROM users WHERE id = ?";
    connection.query(query, [userId], (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Lỗi kết nối cơ sở dữ liệu" });
      }
      if (result.length === 0) {
        return res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
      }

      const hashedPassword = result[0].password;

      // So sánh mật khẩu hiện tại
      bcrypt.compare(currentPassword, hashedPassword, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ success: false, message: "Lỗi khi so sánh mật khẩu" });
        }
        if (!isMatch) {
          return res.status(401).json({ success: false, message: "Mật khẩu hiện tại không đúng" });
        }

        // Mã hóa mật khẩu mới
        bcrypt.hash(newPassword, saltRounds, (err, hash) => {
          if (err) {
            return res.status(500).json({ success: false, message: "Lỗi khi mã hóa mật khẩu" });
          }

          // Cập nhật mật khẩu mới vào cơ sở dữ liệu
          const updateQuery = "UPDATE users SET password = ? WHERE id = ?";
          connection.query(updateQuery, [hash, userId], (err) => {
            if (err) {
              return res.status(500).json({ success: false, message: "Lỗi khi cập nhật mật khẩu" });
            }
            res.json({ success: true, message: "Đổi mật khẩu thành công" });
          });
        });
      });
    });
  } catch (error) {
    console.error("JWT Error:", error.message);
    return res.status(401).json({ success: false, message: "Token không hợp lệ" });
  }
});

app.put("/update-user", (req, res) => {
  const { id, username, firstname, lastname, language, birthday, phonenumber, country, address, message } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }

  // Kiểm tra định dạng ngày sinh
  try {
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

  const sql = `
    UPDATE users 
    SET 
      username = ?,
      firstname = ?,
      lastname = ?,
      language = ?, 
      birthday = ?, 
      phonenumber = ?, 
      country = ?, 
      address = ?, 
      message = ?
    WHERE id = ?
  `;

  const values = [username, firstname, lastname, language, birthday, phonenumber, country, address, message, id];

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
      const formattedBirthday = user.birthday ? moment(user.birthday).format("DD/MM/YYYY") : "";

      // Trả về user mới sau khi cập nhật
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
      };
      return res.status(200).json({ success: true, message: "Cập nhật thành công!", updatedUser });
    });
  });
});

app.get("/user/:id", (req, res) => {
  const userId = req.params.id;
  const query = "SELECT * FROM users WHERE id = ?";
  connection.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Lỗi khi lấy thông tin người dùng" });
    }
    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
    }
    const user = result[0];
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
        role: user.role,
      },
    });
  });
});

// Backend route
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

app.delete("/delete-user/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await connection.query("DELETE FROM users WHERE id = ?", [userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Database error", error });
  }
});

// Endpoint để lưu lịch sử command
app.post("/node_actions", async (req, res) => {
  const { device_id, command, status } = req.body;
  try {
    const result = await connection.query("INSERT INTO node_actions (device_id, command, status) VALUES (?, ?, ?)", [
      device_id,
      command,
      status || "Pending",
    ]);
    res.status(201).json({
      message: "Lịch sử command đã được lưu",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Lỗi khi lưu lịch sử command:", error);
    res.status(500).json({ message: "Lỗi cơ sở dữ liệu", error });
  }
});

app.post("/contact", async (req, res) => {
  try {
    const { first_name, last_name, email, message } = req.body;

    // Lưu vào CSDL
    const [result] = await connection.query(
      "INSERT INTO contacts (first_name, last_name, email, message) VALUES (?, ?, ?, ?)",
      [first_name, last_name, email, message]
    );

    // Gửi email
    await sendContactEmail({ first_name, last_name, email, message });

    res.status(201).json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

const PORT = process.env.PORT;

app.listen(PORT || 3001, () => {
  console.log("Server is running on http:localhost:3001");
});
