// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import "./index.css";
// import { AuthProvider } from "./auth/AuthContext";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// <ToastContainer position="top-right" autoClose={3000} />


// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <AuthProvider>
//       <App />
//     </AuthProvider>
//   </React.StrictMode>
// );
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./auth/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  </React.StrictMode>
);


