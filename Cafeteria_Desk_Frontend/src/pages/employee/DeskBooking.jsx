import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

const desks = [
  { id: 1, status: "Available" },
  { id: 2, status: "Booked" },
  { id: 3, status: "Available" },
  { id: 4, status: "Available" },
];

const DeskBooking = () => {
  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">Desk Booking</h2>

      <div className="grid grid-cols-4 gap-6">
        {desks.map((desk) => (
          <div
            key={desk.id}
            className={`p-6 rounded text-center font-semibold ${
              desk.status === "Available"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            Desk {desk.id}
            <p className="mt-2">{desk.status}</p>

            {desk.status === "Available" && (
              <button className="mt-3 bg-green-600 text-white px-3 py-1 rounded">
                Book
              </button>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default DeskBooking;
