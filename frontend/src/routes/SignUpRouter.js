import React, {lazy, Suspense} from "react";
import {Route, Routes} from "react-router-dom";
import Loading from "~/components/Loading/Loading";
import {PATH} from "~/constants/paths";
const SignUpForm = lazy(() => import("../pages/Registration/SignUp"));

const SignUpRouter = () => {
  return (
    <Routes>
      <Route
        exact
        path={PATH.SIGNUP}
        element={
          <Suspense fallback={<Loading />}>
            <SignUpForm />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default SignUpRouter;
