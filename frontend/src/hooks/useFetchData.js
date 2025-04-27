import {useState, useEffect, useCallback} from "react";
import axiosInstance from "~/apis/index";

const useFetchData = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(url);
      setData(response.data);
      return response.data;
    } catch (err) {
      console.error("Error fetching node data:", err);
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [url]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData(); // Gọi hàm fetch dữ liệu khi component mount
  }, [fetchData]); // Chạy lại khi fetchData thay đổi

  return {data, error, loading, refetch};
};

export default useFetchData;
