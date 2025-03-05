import React, {lazy, Suspense} from "react";
import {Route, Routes} from "react-router-dom";
import Loading from "~/components/Loading/Loading";
import {PATH} from "~/constants/paths";
const Home = lazy(() => import("../pages/Home/Home"));

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
