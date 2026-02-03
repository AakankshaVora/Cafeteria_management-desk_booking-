import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { ActionCard } from "../../components/ui/Card";
import { TableContainer, Thead, Tbody, Tr, Th, Td } from "../../components/ui/Table";
import { ShoppingBag, Calendar, CheckCircle, Star } from 'lucide-react';
import api from "../../services/api";

const EmployeeDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get("/dashboard/daily-summary");
        setDashboardData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard summary", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

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

      {/* Smart Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* My Next Action Smart Card 🤖 */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>

          {/* Decorative Blur */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-100 rounded-full blur-3xl opacity-60"></div>

          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-100 p-3 rounded-2xl">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 tracking-tight">My Next Action</h3>
            </div>

            {loading ? (
              <div className="animate-pulse flex items-center gap-4">
                <div className="h-10 w-10 bg-gray-100 rounded-full"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              </div>
            ) : (
              <>
                {/* Dynamic Next Action State */}
                {dashboardData?.next_action && (
                  <div className="flex-1 flex flex-col">
                    <h2 className="text-3xl font-bold mb-3 text-gray-900 leading-tight">
                      {dashboardData.next_action.title}
                    </h2>
                    <p className="text-gray-500 mb-8 text-lg">{dashboardData.next_action.subtitle}</p>

                    <div className="mt-auto">
                      <Link
                        to={dashboardData.next_action.link}
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      >
                        {dashboardData.next_action.action_text} <CheckCircle size={20} />
                      </Link>
                    </div>
                  </div>
                )}

                {/* Pending Order Nudge */}
                {dashboardData?.pending_orders_count > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-100 p-2 rounded-full">
                        <ShoppingBag size={16} className="text-orange-600" />
                      </div>
                      <span className="font-medium text-gray-600">
                        {dashboardData.pending_orders_count} food order{dashboardData.pending_orders_count > 1 ? 's' : ''} pending
                      </span>
                    </div>
                    <Link to="/employee/my-orders-bookings" className="text-sm font-bold text-indigo-600 hover:underline">Check Status</Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Cafeteria Highlight / Special Dish 🍽️ */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50/50 to-red-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>

          {/* Decorative Blur */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-100 rounded-full blur-3xl opacity-60"></div>

          <div className="relative z-10 h-full flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-3 rounded-2xl">
                  <span className="text-2xl">🍽️</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 tracking-tight">Today’s Special</h3>
                  <p className="text-xs text-orange-600 font-bold uppercase tracking-wider mt-0.5">Chef's Choice</p>
                </div>
              </div>
              {loading ? null : (
                <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
                  <Star size={14} className="text-orange-500 fill-orange-500" />
                  <span className="text-sm font-bold text-gray-700">{dashboardData?.special_dish?.rating || 4.8}</span>
                </div>
              )}
            </div>

            {loading ? (
              <div className="space-y-4 mt-4">
                <div className="h-6 bg-gray-100 rounded w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              </div>
            ) : dashboardData?.special_dish ? (
              <div className="flex-1 flex flex-col mt-auto hover:-translate-y-1 transition-transform duration-300">
                <h2 className="text-3xl font-black text-gray-900 mb-4 line-clamp-2">
                  {dashboardData.special_dish.name}
                </h2>
                <div className="mt-auto flex items-end justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Price</p>
                    <p className="text-4xl font-black text-gray-800">
                      <span className="text-2xl font-bold text-gray-400 align-top">₹</span>
                      {dashboardData.special_dish.price}
                    </p>
                  </div>
                  <Link to="/employee/order-food" className="bg-black text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-gray-800 transition-all active:scale-95 shadow-gray-200">
                    Order Now
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
                <p>No specials today.</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </DashboardLayout>
  );
};



export default EmployeeDashboard;
