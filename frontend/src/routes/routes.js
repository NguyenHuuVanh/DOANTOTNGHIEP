import React from "react";
import {BrowserRouter} from "react-router-dom";
import HomeRoutes from "./HomeRoutes";
import Node2Routes from "./Node2Routes";
import NodeControlRoutes from "./NodeControlRoutes";
import Node1Routes from "./Node1Routes";
import SignUpRouter from "./SignUpRouter";
import SignInRouter from "./SignInRouter";

const Routes = () => {
  return (
    <BrowserRouter>
      <HomeRoutes />
      <Node1Routes />
      <Node2Routes />
      <NodeControlRoutes />
      <SignUpRouter />
      <SignInRouter />
    </BrowserRouter>
  );
};

export default Routes;
