import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ role }) => {
    return (
        <div className="w-64 bg-indigo-700 text-white min-h-screen p-5">
            <h2 className="text-xl font-bold mb-8">
                {role === "employee" && "Employee Panel"}
                {role === "cafeteria" && "Cafeteria Panel"}
                {role === "desk" && "Desk Manager Panel"}
            </h2>

            <nav className="space-y-4">
                <Link to={`/${role}`} className="block hover:text-indigo-200">
                    Dashboard
                </Link>

                {role === "employee" && (
                    <>
                        <Link to="/employee/menu" className="block hover:text-indigo-200">
                            View Menu
                        </Link>
                        <Link to="/employee/desk-booking" className="block hover:text-indigo-200">
                            Desk Booking
                        </Link>
                    </>
                )}


                {role === "cafeteria" && (
                    <>
                        <Link to="/cafeteria/menu" className="block hover:text-indigo-200">
                            Manage Menu
                        </Link>
                        <Link to="/cafeteria/orders" className="block hover:text-indigo-200">
                            Orders
                        </Link>
                    </>
                )}


                {role === "desk" && (
                    <>
                        <Link to="/desk/status" className="block hover:text-indigo-200">
                            Desk Status
                        </Link>
                    </>
                )}

            </nav>
        </div>
    );
};

export default Sidebar;
