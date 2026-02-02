import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { TableContainer, Thead, Tbody, Tr, Th, Td } from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import {
  ShoppingBag,
  Armchair,
  ArrowLeft,
  XCircle,
  Eye,
  Calendar,
  MapPin,
  Receipt
} from "lucide-react";

const foodOrders = [
  {
    id: 1,
    date: "2026-01-20",
    items: ["Burger", "Fries"],
    amount: 180,
    status: "Pending",
  },
  {
    id: 2,
    date: "2026-01-18",
    items: ["Pizza"],
    amount: 250,
    status: "Completed",
  },
];

const deskBookings = [
  {
    id: 1,
    date: "2026-01-19",
    deskId: "D2",
    location: "Floor 1",
    status: "Booked",
  },
];

const MyOrdersBookings = () => {
  const [activeTab, setActiveTab] = useState("food"); // default open
  const [viewData, setViewData] = useState(null);
  const navigate = useNavigate();

  const handleCancel = (msg) => {
    if (window.confirm("Are you sure you want to cancel?")) {
      toast.success(msg);
      setViewData(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-10 flex flex-col items-start gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/employee")}
          icon={ArrowLeft}
          className="pl-0 hover:bg-transparent hover:text-indigo-600"
        >
          Back to Dashboard
        </Button>
        <h2 className="text-4xl font-bold text-gray-800 tracking-tight">
          My Orders & Bookings
        </h2>
      </div>

      {/* Toggle Buttons */}
      <div className="flex gap-4 mb-10 overflow-x-auto pb-2">
        <button
          onClick={() => {
            setActiveTab("food");
            setViewData(null);
          }}
          className={`px-8 py-3 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-3 ${activeTab === "food"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
              : "bg-white/50 text-gray-600 hover:bg-white"
            }`}
        >
          <ShoppingBag size={20} /> My Food Orders
        </button>

        <button
          onClick={() => {
            setActiveTab("desk");
            setViewData(null);
          }}
          className={`px-8 py-3 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-3 ${activeTab === "desk"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
              : "bg-white/50 text-gray-600 hover:bg-white"
            }`}
        >
          <Armchair size={20} /> My Desk Bookings
        </button>
      </div>

      {/* FOOD ORDERS */}
      {activeTab === "food" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <TableContainer title="My Food Orders">
            <Thead>
              <Th>Date</Th>
              <Th>Items</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </Thead>
            <Tbody>
              {foodOrders.map((o) => (
                <Tr key={o.id}>
                  <Td className="text-gray-600">{o.date}</Td>
                  <Td className="font-medium text-gray-800">{o.items.join(", ")}</Td>
                  <Td className="font-bold text-gray-800">₹{o.amount}</Td>
                  <Td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${o.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                        }`}
                    >
                      {o.status}
                    </span>
                  </Td>
                  <Td>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => setViewData(o)} icon={Eye}>
                        View
                      </Button>
                      {o.status !== "Completed" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleCancel("Food order cancelled successfully")}
                          icon={XCircle}
                        >
                          Cancel
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

      {/* DESK BOOKINGS */}
      {activeTab === "desk" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <TableContainer title="My Desk Bookings">
            <Thead>
              <Th>Date</Th>
              <Th>Desk ID</Th>
              <Th>Location</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </Thead>
            <Tbody>
              {deskBookings.map((d) => (
                <Tr key={d.id}>
                  <Td className="text-gray-600">{d.date}</Td>
                  <Td className="font-bold text-gray-800">{d.deskId}</Td>
                  <Td className="text-gray-600">{d.location}</Td>
                  <Td>
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                      {d.status}
                    </span>
                  </Td>
                  <Td>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => setViewData(d)} icon={Eye}>
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleCancel("Desk booking cancelled successfully")}
                        icon={XCircle}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </TableContainer>
        </div>
      )}

      {/* DETAILS MODAL */}
      <Modal
        isOpen={!!viewData}
        onClose={() => setViewData(null)}
        title={`${activeTab === "food" ? "Order" : "Booking"} Details`}
      >
        {viewData && (
          <div className="space-y-6">
            {activeTab === "food" ? (
              <>
                <div className="flex items-center gap-4 bg-orange-50 p-4 rounded-xl border border-orange-100">
                  <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
                    <Receipt size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Total Amount</p>
                    <h3 className="text-2xl font-bold text-gray-800">₹{viewData.amount}</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Date</span>
                    <span className="text-gray-800 font-semibold">{viewData.date}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Status</span>
                    <span className={`font-bold ${viewData.status === "Completed" ? "text-green-600" : "text-orange-600"}`}>{viewData.status}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 font-medium mb-2">Items</span>
                    <div className="flex flex-wrap gap-2">
                      {viewData.items.map((item, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                  <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
                    <Armchair size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Desk ID</p>
                    <h3 className="text-2xl font-bold text-gray-800">{viewData.deskId}</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="text-gray-400" size={20} />
                    <span className="text-gray-500 w-20 font-medium">Date:</span>
                    <span className="text-gray-800 font-semibold">{viewData.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="text-gray-400" size={20} />
                    <span className="text-gray-500 w-20 font-medium">Location:</span>
                    <span className="text-gray-800 font-semibold">{viewData.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-indigo-600 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-500 w-20 font-medium">Status:</span>
                    <span className="text-indigo-600 font-bold">{viewData.status}</span>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-50">
              <Button variant="secondary" onClick={() => setViewData(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </DashboardLayout>
  );
};

export default MyOrdersBookings;
