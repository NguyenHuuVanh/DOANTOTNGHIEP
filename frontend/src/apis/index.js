import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3001", // Cấu hình base URL
  timeout: 5000, // Thời gian timeout
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
