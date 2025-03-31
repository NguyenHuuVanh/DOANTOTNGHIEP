import React, {lazy, Suspense} from "react";
import {Route, Routes} from "react-router-dom";
import Loading from "~/components/Loading/Loading";
import {PATH} from "~/constants/paths";
import Delayed from "~/helper/delayed";
const About = lazy(() => Delayed(import("~/components/About/About")), 3000);

const AboutRouter = () => {
  return (
    <Routes>
      <Route
        exact
        path={PATH.ABOUT}
        element={
          <Suspense fallback={<Loading />}>
            <About />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default AboutRouter;
