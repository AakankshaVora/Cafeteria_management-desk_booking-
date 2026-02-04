import React, { useState, useEffect } from "react";
import Topbar from "../../components/Topbar";
import { toast } from "react-toastify";
import DeskLayout from "../../components/DeskLayout";
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
  Plus,
  XCircle
} from "lucide-react";
import api from "../../services/api";

const DeskDashboard = () => {
  const [view, setView] = useState("dashboard");
  const [desks, setDesks] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total_desks: 0, available_today: 0, booked_today: 0 });

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");

  useEffect(() => {
    fetchStats();
    fetchDesks();
    fetchBookings();
  }, [selectedDate, fromTime, toTime]);

  const fetchStats = async () => {
    try {
      const response = await api.get("/desks/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Failed to load stats", error);
    }
  };

  const fetchDesks = async () => {
    try {
      let query = `?date=${selectedDate}`;
      if (fromTime) query += `&start_time=${fromTime}`;
      if (toTime) query += `&end_time=${toTime}`;

      const response = await api.get(`/desks${query}`);
      // Map API response
      const mappedDesks = response.data.map((d) => ({
        db_id: d.id, // Primary Key for API calls
        id: d.desk_code, // Display code
        desk_code: d.desk_code, // Required by DeskLayout
        location: d.location,
        block: d.block,
        row: d.row,
        col: d.col,
        status: d.status.charAt(0).toUpperCase() + d.status.slice(1),
        bookedBy: d.booked_by || "-", // Kept in state if needed, but removed from UI
        date: d.date,
        startTime: d.start_time,
        endTime: d.end_time
      }));
      setDesks(mappedDesks);
    } catch (error) {
      toast.error("Failed to load desks");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await api.get("/desk-bookings/all");
      // Backend: { id, desk_id, user_name, booking_date, start_time, end_time, status }
      setBookings(response.data);
    } catch (error) {
      console.error("Failed to load bookings", error);
    }
  };

  const [newDesk, setNewDesk] = useState({
    id: "",
    location: "",
  });

  const totalDesks = stats.total_desks;
  const availableToday = stats.available_today;
  const bookedToday = stats.booked_today;

  const addDesk = async () => {
    const id = newDesk.id.trim();
    const location = newDesk.location.trim();

    if (!id || !location) {
      toast.error("Please enter Desk ID and Location");
      return;
    }

    try {
      await api.post("/desks", { desk_code: id, location });
      toast.success("Desk added successfully");
      setNewDesk({ id: "", location: "" });
      fetchDesks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add desk");
    }
  };

  const updateStatus = async (deskId, status) => {
    try {
      await api.put(`/desks/${deskId}/status`, { status: status.toLowerCase() });
      toast.success(`Desk status updated to ${status}`);
      fetchDesks();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
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

            {/* LAYOUT PREVIEW */}
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-lg border border-white/50">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h3 className="text-xl font-bold text-gray-800">Live Desk Layout</h3>
                <div className="flex gap-4 items-center bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border-none bg-transparent focus:ring-0"
                  />
                  <div className="h-6 w-px bg-gray-200"></div>
                  <Input
                    type="time"
                    value={fromTime}
                    onChange={(e) => setFromTime(e.target.value)}
                    className="border-none bg-transparent focus:ring-0"
                  />
                  <span className="text-gray-400">-</span>
                  <Input
                    type="time"
                    value={toTime}
                    onChange={(e) => setToTime(e.target.value)}
                    className="border-none bg-transparent focus:ring-0"
                  />
                </div>
              </div>
              {loading ? <p>Loading...</p> : (
                <DeskLayout
                  desks={desks}
                  bookings={bookings
                    .filter(b => {
                      if (b.booking_date !== selectedDate) return false;
                      if (fromTime && toTime) {
                        return b.start_time < toTime && b.end_time > fromTime;
                      }
                      return true;
                    })
                    .reduce((acc, b) => {
                      // Map desk_id (code) to booking object
                      if (b.status === 'booked') {
                        acc[b.desk_id] = b;
                      }
                      return acc;
                    }, {})}
                  isAdmin={true}
                  onCancelBooking={async (bookingId) => {
                    if (window.confirm("Are you sure you want to cancel this booking?")) {
                      try {
                        await api.put(`/desk-bookings/${bookingId}/cancel`);
                        toast.success("Booking cancelled");
                        fetchBookings();
                        fetchDesks();
                        fetchStats();
                      } catch (e) {
                        toast.error("Failed to cancel");
                      }
                    }
                  }}
                />
              )}
            </div>

            {/* RECENT BOOKINGS */}
            <TableContainer title="Recent Desk Bookings">
              <Thead>
                <Th>Desk ID</Th>
                <Th>User</Th>
                <Th>Date</Th>
                <Th>Time</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </Thead>
              <Tbody>
                {bookings.map((booking) => (
                  <Tr key={booking.id}>
                    <Td className="font-bold text-gray-800">{booking.desk_id}</Td>
                    <Td className="text-gray-600">{booking.user_name}</Td>
                    <Td className="text-gray-500">{booking.booking_date}</Td>
                    <Td className="text-gray-500">{booking.start_time} - {booking.end_time}</Td>
                    <Td>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${booking.status === 'booked' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100'
                        }`}>
                        {booking.status}
                      </span>
                    </Td>
                    <Td>
                      {booking.status === 'booked' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => {
                            // Re-use logic or call API directly
                            const handleCancel = async () => {
                              if (window.confirm("Are you sure you want to cancel this booking?")) {
                                try {
                                  await api.put(`/desk-bookings/${booking.id}/cancel`);
                                  toast.success("Booking cancelled");
                                  fetchBookings();
                                  fetchDesks();
                                  fetchStats();
                                } catch (e) {
                                  toast.error("Failed to cancel");
                                }
                              }
                            };
                            handleCancel();
                          }}
                          icon={XCircle}
                        >
                          Cancel
                        </Button>
                      )}
                    </Td>
                  </Tr>
                ))}
                {bookings.length === 0 && (
                  <Tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500 italic">
                      No bookings found.
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
                <Th>Date</Th>
                <Th>From Time</Th>
                <Th>To Time</Th>
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
                    <Td className="text-gray-500">{desk.date}</Td>
                    <Td className="text-gray-500">{desk.startTime}</Td>
                    <Td className="text-gray-500">{desk.endTime}</Td>
                    <Td>
                      <div className="flex gap-2">
                        {desk.status !== "Available" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(desk.db_id, "Available")}
                            className="text-xs"
                          >
                            Make Available
                          </Button>
                        )}
                        {desk.status !== "Maintenance" && desk.status !== "Booked" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateStatus(desk.db_id, "Maintenance")}
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
