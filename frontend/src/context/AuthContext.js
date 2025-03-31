import {createContext, useContext, useState, useEffect} from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
          setUser(JSON.parse(storedUser)); // Đồng bộ state từ localStorage
        }
      } catch (error) {
        console.error("Error loading user:", error);
        logout();
      }
    };

    loadUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
    console.log("✅ Lưu User:", userData); // Kiểm tra dữ liệu user
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    console.log("🔴 Đăng xuất");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Trong AuthContext
  const updateUser = (newData) => {
    if (!user) return; // Thêm kiểm tra null
    const updatedUser = {...user, ...newData};
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return <AuthContext.Provider value={{user, setUser, login, logout, updateUser}}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
