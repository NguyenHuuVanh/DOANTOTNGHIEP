import axios from "./index";

// Hàm lấy dữ liệu từ API
export const fetchNodeData = async () => {
  try {
    const response = await axios.get("/node_data");
    console.log(response.data);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Error fetching node data:", error);
    throw error; // Ném lỗi để xử lý ở component
  }
};
