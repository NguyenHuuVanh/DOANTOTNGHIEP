// import {createContext, useContext, useState, useEffect} from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({children}) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const loadUser = () => {
//       try {
//         const token = localStorage.getItem("token");
//         const storedUser = localStorage.getItem("user");

//         if (token && storedUser) {
//           setUser(JSON.parse(storedUser)); // Đồng bộ state từ localStorage
//         }
//       } catch (error) {
//         console.error("Error loading user:", error);
//         logout();
//       }
//     };

//     loadUser();
//   }, []);

//   const login = (userData) => {
//     setUser(userData);
//     localStorage.setItem("user", JSON.stringify(userData));
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//   };

//   // Trong AuthContext
//   const updateUser = (newData) => {
//     if (!user) return; // Thêm kiểm tra null
//     const updatedUser = {...user, ...newData};
//     setUser(updatedUser);
//     localStorage.setItem("user", JSON.stringify(updatedUser));
//   };

//   return <AuthContext.Provider value={{user, setUser, login, logout, updateUser}}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => useContext(AuthContext);

// import {createContext, useContext, useState, useEffect} from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({children}) => {
//   const [user, setUser] = useState(null);

//   // Load user khi khởi động app
//   useEffect(() => {
//     const loadUser = () => {
//       try {
//         // Ưu tiên localStorage trước
//         const token = localStorage.getItem("token") || sessionStorage.getItem("token");
//         const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");

//         if (token && storedUser) {
//           setUser(JSON.parse(storedUser));
//         }
//       } catch (error) {
//         console.error("Error loading user:", error);
//         logout();
//       }
//     };

//     loadUser();
//   }, []);

//   // Hàm login cải tiến
//   const login = (userData, rememberMe = false) => {
//     setUser(userData);

//     if (rememberMe) {
//       localStorage.setItem("user", JSON.stringify(userData));
//       localStorage.setItem("token", userData.token);
//     } else {
//       sessionStorage.setItem("user", JSON.stringify(userData));
//       sessionStorage.setItem("token", userData.token);
//     }
//   };

//   // Hàm logout cải tiến
//   const logout = () => {
//     setUser(null);
//     // Xóa cả 2 storage
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     sessionStorage.removeItem("user");
//     sessionStorage.removeItem("token");
//   };

//   // Hàm update user
//   const updateUser = (newData) => {
//     if (!user) return;

//     const updatedUser = {...user, ...newData};
//     setUser(updatedUser);

//     // Cập nhật cả 2 storage cùng lúc
//     const storage = localStorage.getItem("user") ? localStorage : sessionStorage;
//     storage.setItem("user", JSON.stringify(updatedUser));
//     storage.setItem("token", updatedUser.token);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         login,
//         logout,
//         updateUser,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import {createContext, useContext, useState, useEffect} from "react";
import axios from "~/utils/axiosConfig";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user khi khởi động app
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");

        if (token && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Đồng bộ dữ liệu từ server
          const response = await axios.get(`/user/${parsedUser.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data.success) {
            setUser(response.data.user);
            const storage = localStorage.getItem("token") ? localStorage : sessionStorage;
            storage.setItem("user", JSON.stringify(response.data.user));
          } else {
            logout();
          }
        }
      } catch (error) {
        console.error("Error loading user:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (userData, rememberMe = false) => {
    setUser(userData);

    if (rememberMe) {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userData.token);
    } else {
      sessionStorage.setItem("user", JSON.stringify(userData));
      sessionStorage.setItem("token", userData.token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  };

  const updateUser = (newData) => {
    if (!user) return;

    const updatedUser = {...user, ...newData};
    setUser(updatedUser);

    const storage = localStorage.getItem("user") ? localStorage : sessionStorage;
    storage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loading,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
