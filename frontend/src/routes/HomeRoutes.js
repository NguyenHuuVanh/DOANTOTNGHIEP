import React, {lazy, Suspense} from "react";
import {Route, Routes} from "react-router-dom";
import Loading from "~/components/Loading/Loading";
import {PATH} from "~/constants/paths";
import Delayed from "~/helper/delayed";

const Home = lazy(() => Delayed(import("../pages/Home/Home")), 3000);

const HomeRoutes = () => {
  return (
    <Routes>
      <Route
        exact
        path={PATH.HOME}
        element={
          <Suspense fallback={<Loading />}>
            <Home />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default HomeRoutes;
