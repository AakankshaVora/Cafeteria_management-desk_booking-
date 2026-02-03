import { Route } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";

import Dashboard from "../pages/employee/Dashboard";
import Menu from "../pages/employee/Menu";
import OrderFood from "../pages/employee/OrderFood";
import BookDesk from "../pages/employee/BookDesk";
import MyOrdersBookings from "../pages/employee/MyOrdersBookings";
import DeskBooking from "../pages/employee/DeskBooking";
import SubmitReview from "../pages/employee/SubmitReview.jsx"

const EmployeeRoutes = () => (
    <>
        <Route
            path="/employee"
            element={
                <ProtectedRoute role="employee">
                    <Dashboard />
                </ProtectedRoute>
            }
        />

        <Route
            path="/employee/menu"
            element={
                <ProtectedRoute role="employee">
                    <Menu />
                </ProtectedRoute>
            }
        />

        <Route
            path="/employee/order-food"
            element={
                <ProtectedRoute role="employee">
                    <OrderFood />
                </ProtectedRoute>
            }
        />

        <Route
            path="/employee/book-desk"
            element={
                <ProtectedRoute role="employee">
                    <BookDesk />
                </ProtectedRoute>
            }
        />

        <Route
            path="/employee/desk-booking"
            element={
                <ProtectedRoute role="employee">
                    <DeskBooking />
                </ProtectedRoute>
            }
        />

        <Route
            path="/employee/my-orders-bookings"   // use lowercase & consistent naming
            element={
                <ProtectedRoute role="employee">
                    <MyOrdersBookings />
                </ProtectedRoute>
            }
        />
        <Route
            path="/employee/submit-review"
            element={
                <ProtectedRoute role="employee">
                    <SubmitReview/>
                </ProtectedRoute>
            }
        />
    </>
);

export default EmployeeRoutes;
