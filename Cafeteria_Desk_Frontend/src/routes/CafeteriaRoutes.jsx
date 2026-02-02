import { Route } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";

import Dashboard from "../pages/cafeteria/Dashboard";
import ManageMenu from "../pages/cafeteria/ManageMenu";
import Orders from "../pages/cafeteria/Orders";
import DailySummaryReviews from "../pages/cafeteria/DailySummaryReviews";

const CafeteriaRoutes = () => (
  <>
    <Route
      path="/cafeteria"
      element={
        <ProtectedRoute role="cafeteria">
          <Dashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/cafeteria/menu"
      element={
        <ProtectedRoute role="cafeteria">
          <ManageMenu />
        </ProtectedRoute>
      }
    />

    <Route
      path="/cafeteria/orders"
      element={
        <ProtectedRoute role="cafeteria">
          <Orders />
        </ProtectedRoute>
      }
    />

    <Route
      path="/cafeteria/daily-summary-reviews"
      element={
        <ProtectedRoute role="cafeteria">
          <DailySummaryReviews />
        </ProtectedRoute>
      }
    />
  </>
);

export default CafeteriaRoutes;
