import axios from "axios";

const baseURL = process.env.REACT_APP_API_KEY;

const axiosInstance = axios.create({
  baseURL: `${baseURL}`, // Cấu hình base URL
  timeout: 5000, // Thời gian timeout
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
