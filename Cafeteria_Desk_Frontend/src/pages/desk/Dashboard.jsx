import React, { useState } from "react";
import Topbar from "../../components/Topbar";
import { toast } from "react-toastify";
import { StatCard } from "../../components/ui/Card";
import { TableContainer, Thead, Tbody, Tr, Th, Td } from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import {
  LayoutDashboard,
  Settings,
  MonitorCheck,
  MonitorX,
  MonitorDot,
  Plus
} from "lucide-react";

const DeskDashboard = () => {
  const [view, setView] = useState("dashboard");

  const [desks, setDesks] = useState([
    {
      id: "D-101",
      location: "Block A",
      status: "Available",
      bookedBy: "-",
    },
    {
      id: "D-102",
      location: "Block A",
      status: "Booked",
      bookedBy: "Rahul Sharma",
    },
    {
      id: "D-201",
      location: "Block B",
      status: "Maintenance",
      bookedBy: "-",
    },
    {
      id: "D-202",
      location: "Block B",
      status: "Booked",
      bookedBy: "Anjali Patel",
    },
    {
      id: "D-203",
      location: "Block C",
      status: "Available",
      bookedBy: "-",
    },
  ]);

  const [newDesk, setNewDesk] = useState({
    id: "",
    location: "",
  });

  const totalDesks = desks.length;
  const availableToday = desks.filter(d => d.status === "Available").length;
  const bookedToday = desks.filter(d => d.status === "Booked").length;

  const addDesk = () => {
    const id = newDesk.id.trim();
    const location = newDesk.location.trim();

    if (!id || !location) {
      toast.error("Please enter Desk ID and Location");
      return;
    }

    const exists = desks.some(d => d.id === id);
    if (exists) {
      toast.error("Desk ID already exists");
      return;
    }

    setDesks([
      ...desks,
      {
        id,
        location,
        status: "Available",
        bookedBy: "-"
      }
    ]);

    toast.success("Desk added successfully");
    setNewDesk({ id: "", location: "" });
  };

  const updateStatus = (id, status) => {
    setDesks(
      desks.map(d =>
        d.id === id ? { ...d, status, bookedBy: status === "Booked" ? d.bookedBy : "-" } : d
      )
    );
    toast.success(`Desk marked as ${status}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-violet-50">
      <Topbar />

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Desk Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage desk availability and bookings
            </p>
          </div>

          <div className="flex bg-white/50 backdrop-blur-md p-1 rounded-xl border border-white/50">
            <button
              onClick={() => setView("dashboard")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${view === 'dashboard'
                  ? 'bg-white shadow-sm text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <LayoutDashboard size={18} />
              Overview
            </button>
            <button
              onClick={() => setView("manage")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${view === 'manage'
                  ? 'bg-white shadow-sm text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <Settings size={18} />
              Manage Desks
            </button>
          </div>
        </div>

        {/* DASHBOARD VIEW */}
        {view === "dashboard" && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StatCard title="Total Desks" value={totalDesks} icon={MonitorDot} color="indigo" />
              <StatCard title="Available Today" value={availableToday} icon={MonitorCheck} color="green" />
              <StatCard title="Booked Today" value={bookedToday} icon={MonitorX} color="purple" />
            </div>

            {/* RECENT BOOKINGS */}
            <TableContainer title="Recent Desk Bookings">
              <Thead>
                <Th>Desk ID</Th>
                <Th>Employee</Th>
                <Th>Status</Th>
              </Thead>
              <Tbody>
                {desks
                  .filter(d => d.status === "Booked")
                  .map((desk) => (
                    <Tr key={desk.id}>
                      <Td className="font-bold text-gray-800">{desk.id}</Td>
                      <Td className="font-medium text-gray-600">{desk.bookedBy}</Td>
                      <Td>
                        <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wide">
                          Booked
                        </span>
                      </Td>
                    </Tr>
                  ))}
                {desks.filter(d => d.status === "Booked").length === 0 && (
                  <Tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-gray-500 italic">
                      No bookings found for today.
                    </td>
                  </Tr>
                )}
              </Tbody>
            </TableContainer>
          </div>
        )}

        {/* MANAGE DESKS VIEW */}
        {view === "manage" && (
          <div className="space-y-8 animate-in fade-in duration-300">

            {/* ADD DESK CARD */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-lg border border-white/50 p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Desk</h2>
              <div className="flex flex-col md:flex-row gap-6 items-end">
                <Input
                  label="Desk ID"
                  placeholder="e.g. D-105"
                  value={newDesk.id}
                  onChange={(e) => setNewDesk({ ...newDesk, id: e.target.value })}
                />
                <Input
                  label="Location"
                  placeholder="e.g. Block C"
                  value={newDesk.location}
                  onChange={(e) => setNewDesk({ ...newDesk, location: e.target.value })}
                />
                <div className="h-full">
                  <Button
                    onClick={addDesk}
                    icon={Plus}
                    className="h-[50px] whitespace-nowrap"
                  >
                    Add Desk
                  </Button>
                </div>
              </div>
            </div>

            {/* DESK AVAILABILITY TABLE */}
            <TableContainer title="Desk Availability Management">
              <Thead>
                <Th>Desk ID</Th>
                <Th>Location</Th>
                <Th>Status</Th>
                <Th>Booked By</Th>
                <Th>Action</Th>
              </Thead>
              <Tbody>
                {desks.map((desk) => (
                  <Tr key={desk.id}>
                    <Td className="font-bold text-gray-800">{desk.id}</Td>
                    <Td className="text-gray-600">{desk.location}</Td>
                    <Td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${desk.status === "Available"
                            ? "bg-green-100 text-green-700"
                            : desk.status === "Booked"
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {desk.status}
                      </span>
                    </Td>
                    <Td className="text-gray-500">{desk.bookedBy}</Td>
                    <Td>
                      <div className="flex gap-2">
                        {desk.status !== "Available" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(desk.id, "Available")}
                            className="text-xs"
                          >
                            Make Available
                          </Button>
                        )}
                        {desk.status !== "Maintenance" && desk.status !== "Booked" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateStatus(desk.id, "Maintenance")}
                            className="text-xs text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                          >
                            Maintenance
                          </Button>
                        )}
                      </div>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </TableContainer>
          </div>
        )}

      </div>
    </div>
  );
};

export default DeskDashboard;
