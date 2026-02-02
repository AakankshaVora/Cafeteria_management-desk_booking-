import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { ActionCard } from "../../components/ui/Card";
import { TableContainer, Thead, Tbody, Tr, Th, Td } from "../../components/ui/Table";
import { ShoppingBag, Calendar, CheckCircle, Star } from 'lucide-react';

const EmployeeDashboard = () => {
  return (
    <DashboardLayout>

      {/* Welcome Section */}
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-gray-800 tracking-tight">
          Welcome Back 👋
        </h2>
        <p className="text-lg text-gray-600 mt-2">
          What would you like to do today?
        </p>
      </div>

      {/* Primary Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <ActionCard
          title="Order Food"
          desc="Browse today’s cafeteria menu and place your order"
          icon={<ShoppingBag />}
          big
          path="/employee/order-food"
        />

        <ActionCard
          title="Book Desk"
          desc="Check availability and reserve your workspace"
          icon={<Calendar />}
          big
          path="/employee/book-desk"
        />
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <ActionCard
          title="My Orders & Bookings"
          desc="View your past food orders and desk bookings"
          icon={<CheckCircle />}
          path="/employee/my-orders-bookings"
        />
        <ActionCard
          title="Submit Review"
          desc="Share your feedback about cafeteria services"
          icon={<Star />}
          path="/employee/submit-review"
        />
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Menu Preview */}
        <div className="lg:col-span-2">
          <TableContainer title="Cafeteria Menu - Today's Specials">
            <Thead>
              <Th>Item</Th>
              <Th>Price</Th>
            </Thead>
            <Tbody>
              <Tr>
                <Td className="font-medium text-gray-800">Veg Sandwich</Td>
                <Td className="text-gray-600">₹60</Td>
              </Tr>
              <Tr>
                <Td className="font-medium text-gray-800">Pasta</Td>
                <Td className="text-gray-600">₹80</Td>
              </Tr>
              <Tr>
                <Td className="font-medium text-gray-800">Masala Tea</Td>
                <Td className="text-gray-600">₹20</Td>
              </Tr>
            </Tbody>
          </TableContainer>
        </div>

        {/* Desk Availability */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-lg border border-white/50 p-8 h-full">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Desk Status</h3>
          <div className="space-y-4">
            <StatusRow label="Desk 1" status="Available" />
            <StatusRow label="Desk 2" status="Booked" />
            <StatusRow label="Desk 3" status="Available" />
            <StatusRow label="Desk 4" status="Maintenance" />
          </div>
        </div>

      </div>

    </DashboardLayout>
  );
};

const StatusRow = ({ label, status }) => (
  <div className="flex justify-between items-center p-4 bg-white/50 rounded-2xl border border-gray-100 hover:bg-white transition-colors duration-200">
    <span className="font-medium text-gray-700">{label}</span>
    <span
      className={`px-3 py-1 rounded-full text-sm font-bold ${status === "Available" ? "bg-green-100 text-green-700" :
          status === "Booked" ? "bg-red-100 text-red-600" :
            "bg-yellow-100 text-yellow-700"
        }`}
    >
      {status}
    </span>
  </div>
);

export default EmployeeDashboard;
