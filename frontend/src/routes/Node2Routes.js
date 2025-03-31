import React, {lazy, Suspense} from "react";
import {Route, Routes} from "react-router-dom";
import Loading from "~/components/Loading/Loading";
import {PATH} from "~/constants/paths";
import Delayed from "~/helper/delayed";
const Node2 = lazy(() => Delayed(import("../pages/Node/Node2")), 3000);

const Node2Routes = () => {
  return (
    <Routes>
      <Route
        exact
        path={PATH.NODE2}
        element={
          <Suspense fallback={<Loading />}>
            <Node2 />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default Node2Routes;
