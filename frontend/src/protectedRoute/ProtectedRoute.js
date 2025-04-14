import {Navigate, useLocation} from "react-router-dom";
import {useAuth} from "~/context/AuthContext";

const ProtectedRoute = ({children}) => {
  const {user, loading} = useAuth();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!user) {
    // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
    return <Navigate to="/signin" state={{from: location}} replace />;
  }

  // Nếu đã đăng nhập, cho phép truy cập trang
  return children;
};

export default ProtectedRoute;
