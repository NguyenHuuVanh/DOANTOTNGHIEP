import axiosRetry from "axios-retry";
import axios from "./index";
import {useAuth} from "~/context/AuthContext";

// Hàm lấy dữ liệu từ API
// export const fetchNodeData = async () => {
//   try {
//     const response = await axios.get("/node_data");
//     console.log(response.data);
//     return response.data; // Trả về dữ liệu từ API
//   } catch (error) {
//     console.error("Error fetching node data:", error);
//     throw error; // Ném lỗi để xử lý ở component
//   }
// };
const api = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 15000,
  headers: {
    "Cache-Control": "no-cache",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptor cho request
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     // Thêm device fingerprint
//     config.headers["X-Device-ID"] = getDeviceFingerprint();

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
// apiService.js
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Xóa token và chuyển hướng
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Interceptor cho response
api.interceptors.response.use(
  (response) => {
    // Xử lý response thành công
    if (response.data?.pagination) {
      response.data = normalizePagination(response.data);
    }
    return response;
  },
  (error) => {
    // Xử lý lỗi toàn cục
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Xử lý logout khi hết phiên
          const {logout} = useAuth();
          logout();
          window.location.href = "/login";
          break;
        case 429:
          alert("Quá nhiều yêu cầu, vui lòng thử lại sau");
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  }
);

// axiosRetry(api, {
//   retries: 3, // Số lần thử lại
//   retryDelay: (retryCount) => {
//     return retryCount * 1000; // Khoảng cách giữa các lần thử
//   },
//   retryCondition: (error) => {
//     // Chỉ retry khi gặp timeout hoặc lỗi mạng
//     return error.code === "ECONNABORTED" || !error.response;
//   },
// });

axiosRetry(api, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error) || error.code === "ECONNABORTED";
  },
  onRetry: (retryCount, error, requestConfig) => {
    console.warn(`Retry ${retryCount} for ${requestConfig.url}`);
  },
});

const getDeviceFingerprint = () => {
  const fingerprint = {
    userAgent: navigator.userAgent,
    screen: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
  return btoa(JSON.stringify(fingerprint));
};

const normalizePagination = (data) => {
  return {
    items: data.items,
    meta: {
      currentPage: data.current_page,
      totalItems: data.total,
      itemsPerPage: data.per_page,
      totalPages: data.last_page,
    },
  };
};

export const apiService = {
  fetchNodeData: async () => {
    try {
      const response = await api.get("/node_data", {
        params: {
          cacheBuster: Date.now(), // Tránh cache
        },
      });

      if (!response.data || typeof response.data !== "object") {
        throw new Error("INVALID_RESPONSE_STRUCTURE");
      }

      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Thêm các API endpoints khác
  login: async (credentials) => {
    try {
      const response = await api.post("/login", credentials);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

const handleApiError = (error) => {
  const errorMap = {
    ECONNABORTED: "REQUEST_TIMEOUT",
    ERR_NETWORK: "NETWORK_ERROR",
    INVALID_RESPONSE_STRUCTURE: "INVALID_API_RESPONSE",
  };

  const errorCode = error.code || error.message;
  const message = error.response?.data?.message || errorMap[errorCode] || "UNKNOWN_ERROR";

  console.error(`API Error: ${message}`, {
    code: error.response?.status,
    config: error.config,
    stack: error.stack,
  });

  return new Error(message);
};

export default api;

// export const fetchNodeData = async () => {
//   try {
//     const response = await api.get("/node_data");

//     // Validate response structure
//     if (!response.data || typeof response.data !== "object") {
//       throw new Error("Invalid API response format");
//     }

//     return response.data;
//   } catch (error) {
//     console.error("API Error:", error);
//     throw new Error(error.response?.data?.message || error.message || "Failed to fetch data");
//   }
// };
