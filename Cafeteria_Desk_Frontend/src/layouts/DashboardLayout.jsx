// import React from "react";
// import Topbar from "../components/Topbar";

// const DashboardLayout = ({ children }) => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200">
//       <Topbar />
//       <div className="px-6 py-10">
//         {children}
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;
import React from "react";
import Topbar from "../components/Topbar";

const DashboardLayout = ({ children }) => {
    return (
        // <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200">

        //   {/* Background Blobs */}
        //   <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-300 rounded-full blur-3xl opacity-30"></div>
        //   <div className="absolute top-1/2 -right-24 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-30"></div>

        //   <Topbar />

        //   <div className="relative px-6 py-10">
        //     {children}
        //   </div>
        // </div>
        <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-slate-100 to-purple-50 overflow-hidden">

            {/* Gradient Layers */}
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-indigo-300 rounded-full blur-[120px] opacity-30"></div>
            <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-purple-300 rounded-full blur-[120px] opacity-30"></div>

            <Topbar />

            <div className="relative max-w-7xl mx-auto px-6 py-10">
                {children}
            </div>
        </div>

    );
};

export default DashboardLayout;
