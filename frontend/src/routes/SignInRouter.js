import React, {lazy, Suspense} from "react";
import {Route, Routes} from "react-router-dom";
import Loading from "~/components/Loading/Loading";
import {PATH} from "~/constants/paths";
import Delayed from "~/helper/delayed";
// const SignInForm = lazy(() => import("../pages/Registration/SignIn"));
const SignInForm = lazy(() => Delayed(import("../pages/Registration/SignIn"), 3000));

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
