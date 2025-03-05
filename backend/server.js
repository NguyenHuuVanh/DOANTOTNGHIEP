require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const moment = require("moment");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

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

app.get("/node_data", (req, res) => {
  const query = "SELECT * FROM node_data"; // Truy vấn lấy toàn bộ dữ liệu từ bảng node_data
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
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
  }

  const sql = "INSERT INTO users (`username`, `email`, `password`, `role`) VALUES (?, ?, ?, ?)";

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) return res.status(500).json({ message: "Lỗi mã hóa mật khẩu" });

    connection.query(sql, [username, email, hash, role || "user"], (err, result) => {
      if (err) {
        console.error("Lỗi khi thêm user:", err);
        return res.status(500).json({ message: "Lỗi server khi thêm user" });
      }
      res.status(201).json({ message: "Đăng ký thành công", userId: result.insertId });
    });
  });
});

app.post("/login", (req, res) => {
  const query = "SELECT * FROM users WHERE email = ?";
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu" });
  }

  connection.query(query, [email], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Lỗi truy vấn cơ sở dữ liệu", error: err });
    }

    if (data.length === 0) {
      return res.status(404).json({ message: "Tài khoản không tồn tại" });
    }

    const user = data[0];

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Lỗi khi so sánh mật khẩu", error: err });
      }
      if (!result) {
        return res.status(401).json({ message: "Sai mật khẩu" });
      }

      // Kiểm tra biến môi trường JWT_SECRET
      if (!process.env.JWT_SECRET) {
        console.error("Lỗi: JWT_SECRET chưa được định nghĩa trong .env");
        return res.status(500).json({ message: "Lỗi máy chủ: JWT_SECRET không được cấu hình" });
      }

      // Tạo token JWT
      const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ message: "Đăng nhập thành công", token });
    });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
