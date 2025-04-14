import React, {lazy, Suspense} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Loading from "~/components/Loading/Loading";
import {PATH} from "~/constants/paths";
import ProtectedRoute from "~/protectedRoute/ProtectedRoute";

const Home = lazy(() => import("../pages/Home/Home"));
const About = lazy(() => import("~/components/About/About"));
const ForgotPassword = lazy(() => import("../pages/FogotPassword/ForgotPassword"));
const Node1 = lazy(() => import("../pages/Node/Node1"));
const Node2 = lazy(() => import("../pages/Node/Node2"));
const SignInForm = lazy(() => import("../pages/Registration/SignIn"));
const SignUpForm = lazy(() => import("../pages/Registration/SignUp"));
const NodeControl = lazy(() => import("../pages/Control/NodeControl"));
const ErrorPage = lazy(() => import("../pages/ErrorPage/ErrorPage"));
const AccountDetail = lazy(() => import("../pages/AccountDetail/AccountDetail"));
const ChangePassword = lazy(() => import("../pages/ChangePassword/ChangePassword"));
const ChangeInfomation = lazy(() => import("../pages/ChangeInfomation/ChangeInfomation"));
const Contact = lazy(() => import("../pages/Contact/Contact"));

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />} fullscreen={true}>
        <Routes>
          <Route exact path={PATH.HOME} element={<Home />} />
          <Route exact path={PATH.ABOUT} element={<About />} />
          <Route exact path={PATH.NODE1} element={<Node1 />} />
          <Route exact path={PATH.NODE2} element={<Node2 />} />
          <Route
            exact
            path={PATH.NODECONTROL}
            element={
              <ProtectedRoute>
                <NodeControl />
              </ProtectedRoute>
            }
          />
          <Route exact path={PATH.SIGNIN} element={<SignInForm />} />
          <Route exact path={PATH.FORGOTPASSWORD} element={<ForgotPassword />} />
          <Route exact path={PATH.SIGNUP} element={<SignUpForm />} />
          <Route exact path={PATH.ERRORPAGE} element={<ErrorPage />} />
          <Route
            exact
            path={PATH.ACCOUNTDETAIL}
            element={
              <ProtectedRoute>
                <AccountDetail />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path={PATH.CHANGEPASSWORD}
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path={PATH.CHANGEINFOMATION}
            element={
              <ProtectedRoute>
                <ChangeInfomation />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path={PATH.CONTACT}
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
