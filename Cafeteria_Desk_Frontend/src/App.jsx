// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/login/Login";
// import EmployeeDashboard from "./pages/employee/Dashboard";
// import OrderFood from "./pages/employee/OrderFood";
// import BookDesk from "./pages/employee/BookDesk";
// import CafeteriaDashboard from "./pages/cafeteria/Dashboard";
// import DeskDashboard from "./pages/desk/Dashboard";
// import Menu from "./pages/employee/Menu";
// import DeskBooking from "./pages/employee/DeskBooking";
// import ManageMenu from "./pages/cafeteria/ManageMenu";
// import Orders from "./pages/cafeteria/Orders";
// import DeskStatus from "./pages/desk/DeskStatus";
// import ProtectedRoute from "./auth/ProtectedRoute";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/login" element={<Login />} />

//         <Route
//           path="/employee"
//           element={
//             <ProtectedRoute role="employee">
//               <EmployeeDashboard />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/employee/menu"
//           element={
//             <ProtectedRoute role="employee">
//               <Menu />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/employee/desk-booking"
//           element={
//             <ProtectedRoute role="employee">
//               <DeskBooking />
//             </ProtectedRoute>
//           }
//         />


//         <Route
//           path="/cafeteria"
//           element={
//             <ProtectedRoute role="cafeteria">
//               <CafeteriaDashboard />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/cafeteria/menu"
//           element={
//             <ProtectedRoute role="cafeteria">
//               <ManageMenu />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/cafeteria/orders"
//           element={
//             <ProtectedRoute role="cafeteria">
//               <Orders />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/desk"
//           element={
//             <ProtectedRoute role="desk">
//               <DeskDashboard />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/desk/status"
//           element={
//             <ProtectedRoute role="desk">
//               <DeskStatus />
//             </ProtectedRoute>
//           }
//         />

//         <Route path="/employee/order-food" 
//         element={<OrderFood />} />

//         <Route path="/employee/book-desk" 
//         element={<BookDesk />} />

//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login/Login";
import ForgotPassword from "./pages/login/ForgotPassword";
import ResetPassword from "./pages/login/ResetPassword";
import Register from "./pages/login/Register";

import EmployeeRoutes from "./routes/EmployeeRoutes";
import CafeteriaRoutes from "./routes/CafeteriaRoutes";
import DeskRoutes from "./routes/DeskRoutes";

import Profile from "./pages/common/Profile";
import ProtectedRoute from "./auth/ProtectedRoute";

import { ConfirmationProvider } from "./context/ConfirmationContext";

function App() {
  return (
    <ConfirmationProvider>
      <BrowserRouter>
        <Routes>

          {/* Public */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Role based routes */}
          {EmployeeRoutes()}
          {CafeteriaRoutes()}
          {DeskRoutes()}

          {/* Common Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Login />} />

        </Routes>
      </BrowserRouter>
    </ConfirmationProvider>
  );
}

export default App;

