import React, {lazy, Suspense} from "react";
import {Route, Routes} from "react-router-dom";
import Loading from "~/components/Loading/Loading";
import {PATH} from "~/constants/paths";
const SignInForm = lazy(() => import("../pages/Registration/SignIn"));

const SignUpRouter = () => {
  return (
    <Routes>
      <Route
        exact
        path={PATH.SIGNIN}
        element={
          <Suspense fallback={<Loading />}>
            <SignInForm />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default SignUpRouter;
