import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { toast } from "react-toastify";
import Button from "../../components/ui/Button";
import { Input, Select } from "../../components/ui/Input";
import { TableContainer, Thead, Tbody, Tr, Th, Td } from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";
import { ArrowLeft } from "lucide-react";
import api from "../../services/api";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, filterStatus, filterDate]);

  const fetchOrders = async (page) => {
    setLoading(true);
    try {
      let query = `/orders?page=${page}&per_page=10`;
      if (filterStatus && filterStatus !== "All Status") query += `&status=${filterStatus}`;
      if (filterDate) query += `&date=${filterDate}`;

      const response = await api.get(query);
      const { orders, total_pages } = response.data;

      setTotalPages(total_pages);

      // Map API response to UI model
      const mappedOrders = orders.map((order) => ({
        id: order.order_id,
        // employee: order.user_name, // Removed as per request
        datetime: new Date(order.created_at).toLocaleDateString(),
        items: order.items.map(i => ({ name: i.name, qty: i.quantity, price: i.price })),
        total: order.total_amount,
        status: order.status.charAt(0).toUpperCase() + order.status.slice(1), // Capitalize
        scheduledTime: order.scheduled_time // Add this
      }));
      setOrders(mappedOrders);
    } catch (error) {
      toast.error("Failed to load orders", { toastId: "orders_load_error" });
    } finally {
      setLoading(false);
    }
  };

  // Use orders directly instead of filteredOrders
  const filteredOrders = orders;

  const markAsComplete = async () => {
    try {
      await api.put(`/orders/${selectedOrder.id}/complete`);
      toast.success("Order marked as completed");
      fetchOrders(currentPage); // Reload
      setSelectedOrder(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update order");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-violet-50">
      <Topbar />

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* Header */}
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate("/cafeteria")}
            icon={ArrowLeft}
            className="pl-0 hover:bg-transparent hover:text-indigo-600 mb-4"
          >
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">View Orders</h1>
          <p className="text-gray-600 mt-1">
            Monitor and process cafeteria food orders
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-white/50 p-6">
          <Input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="min-w-[200px]"
          />

          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="min-w-[200px]"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </Select>
        </div>

        {/* Orders Table */}
        <TableContainer>
          <Thead>
            <Th>Order ID</Th>
            <Th>Date</Th>
            <Th>Items Ordered</Th>
            <Th>Total (₹)</Th>
            <Th>Scheduled</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Thead>

          <Tbody>
            {filteredOrders.map((order) => (
              <Tr key={order.id}>
                <Td className="font-bold text-gray-800">{order.id}</Td>
                <Td className="text-gray-500">{order.datetime}</Td>
                <Td className="text-gray-600 max-w-xs truncate">
                  {order.items.map((i) => i.name).join(", ")}
                </Td>
                <Td className="font-semibold text-gray-800">{order.total}</Td>
                <Td className="text-gray-500">
                  {order.scheduledTime ? new Date(order.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}
                </Td>
                <Td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                      }`}
                  >
                    {order.status}
                  </span>
                </Td>
                <Td>
                  <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                    View
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </TableContainer>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center bg-white/50 p-4 rounded-xl border border-white/50">
          <Button
            variant="secondary"
            disabled={currentPage === 1 || loading}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <span className="text-gray-600 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="secondary"
            disabled={currentPage === totalPages || loading}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          >
            Next
          </Button>
        </div>

        {/* Order Detail Modal */}
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title="Order Details"
          maxWidth="max-w-2xl"
        >
          {selectedOrder && (
            <div className="space-y-8">
              {/* Order Info Grid */}
              <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Order ID</p>
                  <p className="text-lg font-bold text-gray-800">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${selectedOrder.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                      }`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Date</p>
                  <p className="text-gray-600">{selectedOrder.datetime}</p>
                </div>
                {selectedOrder.scheduledTime && (
                  <div>
                    <p className="text-xs text-indigo-400 uppercase font-bold tracking-wider mb-1">Scheduled For</p>
                    <p className="text-indigo-700 font-bold">
                      {new Date(selectedOrder.scheduledTime).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div>
                <h4 className="font-bold text-gray-800 mb-4">Items Ordered</h4>
                <div className="rounded-xl border border-gray-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold text-left">
                      <tr>
                        <th className="px-4 py-3">Item</th>
                        <th className="px-4 py-3">Qty</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {selectedOrder.items.map((item, i) => (
                        <tr key={i}>
                          <td className="px-4 py-3 font-medium text-gray-700">{item.name}</td>
                          <td className="px-4 py-3 text-gray-600">{item.qty}</td>
                          <td className="px-4 py-3 text-gray-600">₹{item.price}</td>
                          <td className="px-4 py-3 font-bold text-gray-800">₹{item.qty * item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 font-bold text-gray-800">
                      <tr>
                        <td colSpan="3" className="px-4 py-3 text-right">Total Amount:</td>
                        <td className="px-4 py-3">₹{selectedOrder.total}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-gray-100 justify-end">
                <Button variant="secondary" onClick={() => setSelectedOrder(null)}>
                  Close
                </Button>

                {selectedOrder.status === "Pending" && (
                  <Button variant="primary" onClick={markAsComplete}>
                    Mark as Complete
                  </Button>
                )}
              </div>
            </div>
          )}
        </Modal>

      </div>
    </div>
  );
};

export default Orders;
