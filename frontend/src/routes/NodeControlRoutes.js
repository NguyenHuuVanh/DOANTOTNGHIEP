import React, {lazy, Suspense} from "react";
import {Route, Routes} from "react-router-dom";
import Loading from "~/components/Loading/Loading";
import {PATH} from "~/constants/paths";
import Delayed from "~/helper/delayed";
const NodeControl = lazy(() => Delayed(import("../pages/Control/NodeControl")), 3000);

const NodeControlRoutes = () => {
  return (
    <Routes>
      <Route
        exact
        path={PATH.NODECONTROL}
        element={
          <Suspense fallback={<Loading />}>
            <NodeControl />
          </Suspense>
        }
      />
    </Routes>
  );
};

export default NodeControlRoutes;
