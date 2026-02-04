import React, { useState, useEffect } from "react";
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
  Receipt,
  Clock
} from "lucide-react";
import api from "../../services/api";

import { useConfirm } from "../../context/ConfirmationContext";

const MyOrdersBookings = () => {
  const [activeTab, setActiveTab] = useState("food"); // default open
  const [viewData, setViewData] = useState(null);
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [foodOrders, setFoodOrders] = useState([]);
  const [deskBookings, setDeskBookings] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchBookings();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders/my");
      // Handle paginated response
      if (response.data.orders) {
        setFoodOrders(response.data.orders);
      } else {
        setFoodOrders(response.data);
      }
    } catch (e) {
      console.error("Failed to load orders");
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await api.get("/desk-bookings/my");
      setDeskBookings(response.data);
    } catch (e) {
      console.error("Failed to load bookings");
    }
  };

  const handleCancel = async (type, id) => {
    const isConfirmed = await confirm({
      title: "Cancel Booking/Order",
      message: type === 'food'
        ? "Are you sure you want to cancel this order? This cannot be undone."
        : "Are you sure you want to cancel this desk booking?",
      confirmText: "Yes, Cancel",
      cancelText: "Keep it",
      variant: "danger"
    });

    if (isConfirmed) {
      try {
        if (type === 'food') {
          await api.put(`/orders/${id}/cancel`);
          toast.success("Order cancelled");
          fetchOrders();
        } else {
          await api.put(`/desk-bookings/${id}/cancel`); // Changed to PUT as per backend update
          toast.success("Booking cancelled");
          fetchBookings();
        }
        setViewData(null);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to cancel");
      }
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
                  <Td className="text-gray-600">{o.created_at}</Td>
                  <Td className="font-medium text-gray-800">
                    {/* Items are now objects { name, quantity, price } */}
                    {o.items.map(i => `${i.name} (x${i.quantity})`).join(", ")}
                  </Td>
                  <Td className="font-bold text-gray-800">₹{o.total_amount}</Td>
                  <Td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${o.status === "completed"
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
                      {o.status === "pending" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleCancel('food', o.id)}
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
                  <Td className="text-gray-600">{d.booking_date}</Td>
                  <Td className="font-bold text-gray-800">
                    {d.desk_code || d.desk_id}
                  </Td>
                  <Td className="text-gray-600">{d.location || "N/A"}</Td>
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
                      {d.status !== "cancelled" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleCancel('desk', d.id)}
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
                    <h3 className="text-2xl font-bold text-gray-800">₹{viewData.total_amount}</h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Date</span>
                    <span className="text-gray-800 font-semibold">{viewData.created_at}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Status</span>
                    <span className={`font-bold ${viewData.status === "completed" ? "text-green-600" : "text-orange-600"}`}>{viewData.status}</span>
                  </div>
                  {viewData.scheduled_time && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">Scheduled For</span>
                      <span className="text-indigo-600 font-bold">
                        {new Date(viewData.scheduled_time).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="block text-gray-500 font-medium mb-2">Items</span>
                    <div className="flex flex-wrap gap-2">
                      {viewData.items.map((item, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200">
                          {item.name} <span className="text-xs text-gray-500 ml-1">x{item.quantity}</span>
                          <span className="ml-2 font-bold text-indigo-600">₹{item.price}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4 bg-indigo-50 p-4 rounded-xl border border-indigo-100 mb-6">
                  <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
                    <Armchair size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Desk ID</p>
                    <h3 className="text-2xl font-bold text-gray-800">{viewData.desk_code || viewData.desk_id}</h3>
                  </div>
                  <div className="ml-auto">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide border ${viewData.status === 'booked'
                      ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                      : viewData.status === 'cancelled'
                        ? 'bg-red-50 text-red-600 border-red-100'
                        : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}>
                      {viewData.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-4">
                    <div className="bg-white p-2 rounded-lg text-gray-400 shadow-sm border border-gray-100">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase">Date</p>
                      <p className="text-gray-800 font-semibold">{viewData.booking_date}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-4">
                    <div className="bg-white p-2 rounded-lg text-gray-400 shadow-sm border border-gray-100">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase">Time</p>
                      <p className="text-gray-800 font-semibold">
                        {viewData.start_time || "09:00"} - {viewData.end_time || "18:00"}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-4 md:col-span-2">
                    <div className="bg-white p-2 rounded-lg text-gray-400 shadow-sm border border-gray-100">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase">Location</p>
                      <p className="text-gray-800 font-semibold">{viewData.location || "N/A"}</p>
                    </div>
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
