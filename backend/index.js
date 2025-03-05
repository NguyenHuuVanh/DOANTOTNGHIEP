const express = require("express");
const cors = require("cors");
const app = express();

// const data = require("./output.json");

const data = {
  controler: [
    {
      id: 1,
      name: "RELAY1",
      description: "RELAY điều khiển",
      status: "OFF",
      date: "2024-12-01",
      time: "10:00",
    },
    {
      id: 2,
      name: "RELAY2",
      description: "RELAY điều khiển",
      status: "OFF",
      date: "2024-12-01",
      time: "10:00",
    },
    {
      id: 3,
      name: "RELAY3",
      description: "RELAY điều khiển",
      status: "OFF",
      date: "2024-12-01",
      time: "10:00",
    },
    {
      id: 4,
      name: "RELAY4",
      description: "RELAY điều khiển",
      status: "OFF",
      date: "2024-12-01",
      time: "10:00",
    },
    {
      id: 5,
      name: "RELAY5",
      description: "RELAY điều khiển",
      status: "OFF",
      date: "2024-12-01",
      time: "10:00",
    },
    {
      id: 6,
      name: "RELAY6",
      description: "RELAY điều khiển",
      status: "OFF",
      date: "2024-12-01",
      time: "10:00",
    },
    {
      id: 7,
      name: "RELAY7",
      description: "RELAY điều khiển",
      status: "OFF",
      date: "2024-12-01",
      time: "10:00",
    },
    {
      id: 8,
      name: "RELAY8",
      description: "RELAY điều khiển",
      status: "OFF",
      date: "2024-12-01",
      time: "10:00",
    },
  ],
};

// Middleware để xử lý JSON
app.use(express.json());
app.use(cors());

// Route cơ bản
app.get("/", (req, res) => {
  res.send("Chào mừng đến với API của tôi!");
});

// Route trả về thông tin
app.get("/data_node", (req, res) => {
  res.json({
    data,
  });
});

// Route xử lý POST
app.post("/api/data", (req, res) => {
  const { name, age } = req.body;
  res.json({
    message: `Dữ liệu đã nhận: ${name}, ${age}`,
  });
});

// Khởi động server
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
