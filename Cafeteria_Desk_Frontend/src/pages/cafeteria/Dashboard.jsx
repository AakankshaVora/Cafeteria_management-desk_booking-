import React from "react";
import Topbar from "../../components/Topbar";
import { ActionCard, StatCard } from "../../components/ui/Card";
import { TableContainer, Thead, Tbody, Tr, Th, Td } from "../../components/ui/Table";
import {
  Utensils,
  ClipboardList,
  BarChart3,
  Star,
} from "lucide-react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

const CafeteriaDashboard = () => {
  const [stats, setStats] = useState({
    orders_today: 0,
    revenue_today: 0,
    pending_orders: 0
  });
  const [itemDemand, setItemDemand] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/orders/stats");
        setStats({
          orders_today: response.data.orders_today,
          revenue_today: response.data.revenue_today,
          pending_orders: response.data.pending_orders
        });
        setItemDemand(response.data.item_demand);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        // toast.error("Failed to load dashboard stats"); 
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-violet-50">
      <Topbar />

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Cafeteria Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Manage menu, monitor orders and track daily performance
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard title="Total Orders Today" value={stats.orders_today} color="indigo" />
          <StatCard title="Revenue Today" value={`₹${stats.revenue_today}`} color="green" />
          <StatCard title="Pending Orders" value={stats.pending_orders} color="orange" />
        </div>

        {/* Actions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ActionCard
              title="Manage Menu"
              desc="Add, update or remove cafeteria food items"
              icon={<Utensils />}
              path="/cafeteria/menu"
            />

            <ActionCard
              title="View Orders"
              desc="Track and process employee food orders"
              icon={<ClipboardList />}
              path="/cafeteria/orders"
            />

            <ActionCard
              title="Daily Summary & Reviews"
              desc="Analyze daily sales, order performance & feedback"
              icon={<BarChart3 />}
              path="/cafeteria/daily-summary-reviews"
            />
          </div>
        </div>

        {/* Item Wise Demand Table */}
        <TableContainer title="Item Wise Demand (Today)">
          <Thead>
            <Th>Item Name</Th>
            <Th>Orders</Th>
            <Th>Revenue (₹)</Th>
          </Thead>
          <Tbody>
            {loading ? (
              <Tr><Td colSpan="3" className="text-center text-gray-500 py-4">Loading stats...</Td></Tr>
            ) : itemDemand.length > 0 ? (
              itemDemand.map((item, index) => (
                <Tr key={index}>
                  <Td className="font-medium text-gray-800">{item.name}</Td>
                  <Td>{item.orders}</Td>
                  <Td>{item.revenue}</Td>
                </Tr>
              ))
            ) : (
              <Tr><Td colSpan="3" className="text-center text-gray-500 py-4">No orders today</Td></Tr>
            )}
          </Tbody>
        </TableContainer>

      </div>
    </div>
  );
};

export default CafeteriaDashboard;
