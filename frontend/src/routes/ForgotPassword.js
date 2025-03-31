import React, {lazy, Suspense} from "react";
import {Route, Routes} from "react-router-dom";
import Loading from "~/components/Loading/Loading";
import {PATH} from "~/constants/paths";
import Delayed from "~/helper/delayed";
const ForgotPassword = lazy(() => Delayed(import("../pages/Registration/ForgotPassword"), 3000));

const SignUpRouter = () => {
  return (
    <Routes>
      <Route
        exact
        path={PATH.FORGOTPASSWORD}
        element={
          <Suspense fallback={<Loading />}>
            <ForgotPassword />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default SignUpRouter;
