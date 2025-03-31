import React, {lazy, Suspense} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
// import HomeRoutes from "./HomeRoutes";
// import Node2Routes from "./Node2Routes";
// import NodeControlRoutes from "./NodeControlRoutes";
// import Node1Routes from "./Node1Routes";
// import SignUpRouter from "./SignUpRouter";
// import SignInRouter from "./SignInRouter";
// import ForgotPassword from "./ForgotPassword";
// import AboutRouter from "./AboutRouter";
import Delayed from "~/helper/delayed";
import Loading from "~/components/Loading/Loading";
import {PATH} from "~/constants/paths";

const Home = lazy(() => Delayed(import("../pages/Home/Home")), 3000);
const About = lazy(() => Delayed(import("~/components/About/About")), 3000);
const ForgotPassword = lazy(() => Delayed(import("../pages/Registration/ForgotPassword"), 3000));
const Node1 = lazy(() => Delayed(import("../pages/Node/Node1")), 3000);
const Node2 = lazy(() => Delayed(import("../pages/Node/Node2")), 3000);
const SignInForm = lazy(() => Delayed(import("../pages/Registration/SignIn"), 3000));
const SignUpForm = lazy(() => Delayed(import("../pages/Registration/SignUp"), 3000));
const NodeControl = lazy(() => Delayed(import("../pages/Control/NodeControl"), 3000));
const ErrorPage = lazy(() => Delayed(import("../pages/ErrorPage/ErrorPage"), 3000));
const AccountDetail = lazy(() => Delayed(import("../pages/AccountDetail/AccountDetail"), 3000));
const ChangePassword = lazy(() => Delayed(import("../pages/ChangePassword/ChangePassword"), 3000));
const ChangeInfomation = lazy(() => Delayed(import("../pages/ChangeInfomation/ChangeInfomation"), 3000));

const AppRoutes = () => {
  // return (
  //   <BrowserRouter>
  //     <HomeRoutes />
  //     <AboutRouter />
  //     <Node1Routes />
  //     <Node2Routes />
  //     <NodeControlRoutes />
  //     <SignUpRouter />
  //     <SignInRouter />
  //     <ForgotPassword />
  //   </BrowserRouter>
  // );
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />} fullscreen={true}>
        <Routes>
          <Route exact path={PATH.HOME} element={<Home />} />
          <Route
            exact
            path={PATH.ABOUT}
            element={
              <Suspense fallback={<Loading />}>
                <About />
              </Suspense>
            }
          />
          <Route
            exact
            path={PATH.NODE1}
            element={
              <Suspense fallback={<Loading />}>
                <Node1 />
              </Suspense>
            }
          />
          <Route
            exact
            path={PATH.NODE2}
            element={
              <Suspense fallback={<Loading />}>
                <Node2 />
              </Suspense>
            }
          />
          <Route
            exact
            path={PATH.NODECONTROL}
            element={
              <Suspense fallback={<Loading />}>
                <NodeControl />
              </Suspense>
            }
          />
          <Route
            exact
            path={PATH.SIGNIN}
            element={
              <Suspense fallback={<Loading />}>
                <SignInForm />
              </Suspense>
            }
          />
          <Route
            exact
            path={PATH.FORGOTPASSWORD}
            element={
              <Suspense fallback={<Loading />}>
                <ForgotPassword />
              </Suspense>
            }
          />
          <Route
            exact
            path={PATH.SIGNUP}
            element={
              <Suspense fallback={<Loading />}>
                <SignUpForm />
              </Suspense>
            }
          />
          <Route
            exact
            path={PATH.ERRORPAGE}
            element={
              <Suspense fallback={<Loading />}>
                <ErrorPage />
              </Suspense>
            }
          />
          <Route
            exact
            path={PATH.ACCOUNTDETAIL}
            element={
              <Suspense fallback={<Loading />}>
                <AccountDetail />
              </Suspense>
            }
          />
          <Route
            exact
            path={PATH.CHANGEPASSWORD}
            element={
              <Suspense fallback={<Loading />}>
                <ChangePassword />
              </Suspense>
            }
          />
          <Route
            exact
            path={PATH.CHANGEINFOMATION}
            element={
              <Suspense fallback={<Loading />}>
                <ChangeInfomation />
              </Suspense>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
