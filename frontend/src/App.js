import {ToastContainer} from "react-toastify";
import "./App.css";
import {AuthProvider} from "./context/AuthContext";
import AppRoutes from "./routes/routes";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppRoutes />
        <ToastContainer />
      </div>
    </AuthProvider>
  );
}

export default App;
