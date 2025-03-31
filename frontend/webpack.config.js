import Dotenv from "dotenv-webpack";

export const plugins = [
  new Dotenv({
    path: `./.env.${process.env.NODE_ENV}`, // Load file env tương ứng
    systemvars: true, // Cho phép đọc biến môi trường hệ thống
    safe: true, // Kiểm tra file .env.example nếu có
  }),
];
