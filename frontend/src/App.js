import "./App.css";
import Main from "./pages/Node/Node1";
import ColumnLine from "./components/chart/Chart";
import Home from "./pages/Home/Home";
// import {Route, Routes} from "react-router-dom";
import Routes from "./routes/routes";

function App() {
  return <div className="App">{<Routes />}</div>;
}

export default App;
