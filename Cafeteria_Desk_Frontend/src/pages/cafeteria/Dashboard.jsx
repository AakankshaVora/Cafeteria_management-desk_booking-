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

const CafeteriaDashboard = () => {
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
          <StatCard title="Total Orders Today" value="128" color="indigo" />
          <StatCard title="Revenue Today" value="₹18,450" color="green" />
          <StatCard title="Pending Orders" value="12" color="orange" />
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
            <Tr>
              <Td className="font-medium text-gray-800">Veg Thali</Td>
              <Td>42</Td>
              <Td>6,300</Td>
            </Tr>
            <Tr>
              <Td className="font-medium text-gray-800">Paneer Wrap</Td>
              <Td>31</Td>
              <Td>4,650</Td>
            </Tr>
            <Tr>
              <Td className="font-medium text-gray-800">Masala Dosa</Td>
              <Td>27</Td>
              <Td>4,050</Td>
            </Tr>
            <Tr>
              <Td className="font-medium text-gray-800">Cold Coffee</Td>
              <Td>28</Td>
              <Td>3,450</Td>
            </Tr>
          </Tbody>
        </TableContainer>

      </div>
    </div>
  );
};

export default CafeteriaDashboard;
