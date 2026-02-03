import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Input } from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { TableContainer, Thead, Tbody, Tr, Th, Td } from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import { Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";
import api from "../../services/api";

const BookDesk = () => {
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [selectedDesk, setSelectedDesk] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [desks, setDesks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial load for today
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
    fetchDesks(today);
  }, []);

  const fetchDesks = async (searchDate = "") => {
    setLoading(true);
    try {
      const query = searchDate ? `?date=${searchDate}` : "";
      const response = await api.get(`/desks${query}`);

      const mappedDesks = response.data.map(d => ({
        originalId: d.id, // Keep backend ID for booking
        id: d.desk_code,  // Display code
        location: d.location,
        status: d.status.charAt(0).toUpperCase() + d.status.slice(1), // Capitalize
        isAvailable: d.status === 'available'
      }));
      setDesks(mappedDesks);
    } catch (error) {
      toast.error("Failed to load desks");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!date) {
      fetchDesks(); // Defaults to today if empty, or we could require date
      // toast.info("Showing availability for today");
    } else {
      fetchDesks(date);
    }
  };

  const handleBookClick = (desk) => {
    if (!date) {
      toast.error("Please select a date first");
      return;
    }
    setSelectedDesk(desk);
    setIsModalOpen(true);
  };

  const confirmBooking = async () => {
    try {
      const bookingDate = date || new Date().toISOString().split('T')[0];

      await api.post("/desk-bookings", {
        desk_id: selectedDesk.originalId,
        booking_date: bookingDate,
        start_time: fromTime || "09:00",
        end_time: toTime || "18:00"
      });
      toast.success("Desk booked successfully");
      setIsModalOpen(false);
      navigate("/employee");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to book desk");
    }
  };

  return (
    <DashboardLayout>

      {/* Header */}
      <div className="mb-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/employee")}
          icon={ArrowLeft}
          className="pl-0 hover:bg-transparent hover:text-indigo-600 mb-4"
        >
          Back to Dashboard
        </Button>
        <h2 className="text-4xl font-bold text-gray-800 tracking-tight">
          Book a Desk 🪑
        </h2>
        <p className="text-lg text-gray-600 mt-2">
          Find and reserve your perfect workspace
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-lg border border-white/50 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Input
            label="From Time"
            type="time"
            value={fromTime}
            onChange={(e) => setFromTime(e.target.value)}
          />
          <Input
            label="To Time"
            type="time"
            value={toTime}
            onChange={(e) => setToTime(e.target.value)}
          />
          <div className="h-full">
            <Button
              variant="primary"
              className="w-full h-[50px] shadow-indigo-200"
              onClick={handleSearch}
            >
              Search Availability
            </Button>
          </div>
        </div>
      </div>

      {/* Desk Table */}
      <TableContainer title="Available Desks">
        <Thead>
          <Th>Desk ID</Th>
          <Th>Location</Th>
          <Th>Date</Th>
          <Th>Time Slot</Th>
          <Th>Status</Th>
          <Th>Action</Th>
        </Thead>
        <Tbody>
          {loading ? (
            <Tr><Td colSpan="6" className="text-center text-gray-500">Loading desks...</Td></Tr>
          ) : (
            desks.map((desk) => (
              <Tr key={desk.originalId}>
                <Td className="font-bold text-gray-800">{desk.id}</Td>
                <Td className="flex items-center gap-2 text-gray-600">
                  <MapPin size={16} className="text-gray-400" /> {desk.location}
                </Td>
                <Td className="text-gray-600">{date || "—"}</Td>
                <Td className="text-gray-600">{fromTime && toTime ? `${fromTime} - ${toTime}` : "—"}</Td>
                <Td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${desk.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                      }`}
                  >
                    {desk.status}
                  </span>
                </Td>
                <Td>
                  {desk.isAvailable ? (
                    <Button size="sm" onClick={() => handleBookClick(desk)}>
                      Book Now
                    </Button>
                  ) : (
                    <span className="text-gray-400 text-sm font-medium italic pl-2">
                      Unavailable
                    </span>
                  )}
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </TableContainer>

      {/* Confirm Booking Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Booking"
      >
        {selectedDesk && (
          <div className="space-y-6">
            <div className="bg-indigo-50 p-6 rounded-2xl flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-2xl">
                {selectedDesk.id}
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-lg">Desk {selectedDesk.id}</h4>
                <p className="text-gray-600">{selectedDesk.location}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="text-gray-400" size={20} />
                <span className="font-medium">Date:</span>
                <span>{date || "Not selected (Demo)"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Clock className="text-gray-400" size={20} />
                <span className="font-medium">Time:</span>
                <span>{fromTime && toTime ? `${fromTime} - ${toTime}` : "Not selected (Demo)"}</span>
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <Button variant="secondary" className="flex-1" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" className="flex-1" onClick={confirmBooking}>
                Confirm Booking
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </DashboardLayout>
  );
};

export default BookDesk;
