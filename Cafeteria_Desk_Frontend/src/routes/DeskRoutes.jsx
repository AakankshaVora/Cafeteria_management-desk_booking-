import { Route } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";

import Dashboard from "../pages/desk/Dashboard";
import DeskStatus from "../pages/desk/DeskStatus";

const DeskRoutes = () => (
  <>
    <Route
      path="/desk"
      element={
        <ProtectedRoute role="desk">
          <Dashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/desk/status"
      element={
        <ProtectedRoute role="desk">
          <DeskStatus />
        </ProtectedRoute>
      }
    />
  </>
);

export default DeskRoutes;
