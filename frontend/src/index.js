import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {BrowserRouter, Route, Routes} from "react-router-dom";

import NodeControl from "./components/node/NodeControl";
import Node1 from "./components/node/Node1";
import Node2 from "./components/node/Node2";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="node-1" element={<Node1 />} />
      <Route path="node-2" element={<Node2 />} />
      <Route path="node-control" element={<NodeControl />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
