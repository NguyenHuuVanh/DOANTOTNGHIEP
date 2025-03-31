import React, {lazy, Suspense} from "react";
import {Route, Routes} from "react-router-dom";
import Loading from "~/components/Loading/Loading";
import {PATH} from "~/constants/paths";
import Delayed from "~/helper/delayed";
const Node1 = lazy(() => Delayed(import("../pages/Node/Node1")), 3000);

const Node1Routes = () => {
  return (
    <Routes>
      <Route
        exact
        path={PATH.NODE1}
        element={
          <Suspense fallback={<Loading />}>
            <Node1 />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default Node1Routes;
