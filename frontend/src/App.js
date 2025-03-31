import {ToastContainer} from "react-toastify";
import "./App.css";
import {AuthProvider} from "./context/AuthContext";
import Routes from "./routes/routes";
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
