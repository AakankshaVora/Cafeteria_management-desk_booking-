import React, { useState } from "react";
import Topbar from "../../components/Topbar";
import { Card } from "../../components/ui/Card";
import Button from "../../components/ui/Button";

import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const DeskStatus = () => {
  const navigate = useNavigate();

  // Mock Data
  const [desks, setDesks] = useState([
    { id: 1, status: "Available" },
    { id: 2, status: "Booked" },
    { id: 3, status: "Available" },
    { id: 4, status: "Maintenance" },
    { id: 5, status: "Available" },
  ]);

  const toggleStatus = (id) => {
    setDesks(desks.map(desk => {
      if (desk.id === id) {
        return {
          ...desk,
          status: desk.status === "Available" ? "Maintenance" : "Available"
        };
      }
      return desk;
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-violet-50">
      <Topbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <Button
            variant="ghost"
            onClick={() => navigate("/desk")}
            icon={ArrowLeft}
            className="pl-0 hover:bg-transparent hover:text-indigo-600 mb-4"
          >
            Back to Dashboard
          </Button>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Desk Status Overview</h2>
          <p className="text-gray-600 mt-1">Real-time status of all desks in the facility</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {desks.map((desk) => (
            <Card
              key={desk.id}
              className={`flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 ${desk.status === "Available" ? "border-green-100" :
                desk.status === "Booked" ? "border-indigo-100" : "border-yellow-100"
                }`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold mb-4 ${desk.status === "Available" ? "bg-green-100 text-green-600" :
                desk.status === "Booked" ? "bg-indigo-100 text-indigo-600" : "bg-yellow-100 text-yellow-600"
                }`}>
                {desk.id}
              </div>

              <h3 className="font-bold text-gray-800 text-lg">Desk {desk.id}</h3>

              <span className={`mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${desk.status === "Available" ? "bg-green-50 text-green-700" :
                desk.status === "Booked" ? "bg-indigo-50 text-indigo-700" : "bg-yellow-50 text-yellow-700"
                }`}>
                {desk.status}
              </span>

              {desk.status !== "Booked" && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="mt-6 w-full text-xs"
                  onClick={() => toggleStatus(desk.id)}
                >
                  Toggle Maintenance
                </Button>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeskStatus;
