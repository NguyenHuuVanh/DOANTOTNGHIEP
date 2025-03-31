import {useState, useEffect} from "react";
import axiosInstance from "~/apis/index";

const useFetchData = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(url);
        console.log("API Response:", response.data); // Kiểm tra dữ liệu
        setData(response.data);
      } catch (err) {
        console.error("Error fetching node data:", err);
        setError(err); // Lưu lại lỗi để thông báo trong component
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Gọi hàm fetch dữ liệu khi component mount
  }, [url]); // Chạy lại khi URL thay đổi

  return {data, error, loading}; // Trả về các giá trị state cho component
};

export default useFetchData;
