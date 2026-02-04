import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import { Card } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { ShoppingBag, Plus, Minus, ArrowLeft, Clock } from "lucide-react";
import api from "../../services/api";

const OrderFood = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({});
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/menu${searchQuery ? `?q=${searchQuery}` : ""}`);
        const availableItems = response.data.filter(item => item.is_available);
        setFoodItems(availableItems);
      } catch (error) {
        toast.error("Failed to load menu", { toastId: "menu_load_error_employee" });
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [searchQuery]);

  const updateQty = (id, change) => {
    setCart((prev) => {
      const qty = (prev[id] || 0) + change;
      if (qty <= 0) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }
      return { ...prev, [id]: qty };
    });
  };

  const totalAmount = Object.entries(cart).reduce((total, [id, qty]) => {
    const item = foodItems.find((i) => i.id === Number(id));
    return total + (item?.price || 0) * qty;
  }, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const items = Object.entries(cart).map(([id, qty]) => {
      const item = foodItems.find((i) => i.id === Number(id));
      if (!item) return null; // Safe guard
      return {
        item_id: Number(id),
        quantity: qty,
        price: item.price
      };
    }).filter(i => i !== null); // Remove nulls

    if (items.length === 0) {
      toast.error("Cart is invalid or empty");
      return;
    }

    // Validate Scheduled Time
    if (scheduledTime) {
      const scheduled = new Date(scheduledTime);
      const now = new Date();
      if (scheduled < now) {
        toast.error("Scheduled time cannot be in the past");
        return;
      }
    }

    try {
      await api.post("/orders", {
        items,
        total_amount: totalAmount,
        scheduled_time: scheduledTime ? new Date(scheduledTime).toISOString() : null
      });
      toast.success(scheduledTime ? "Order scheduled successfully" : "Order placed successfully");
      navigate("/employee");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    }
  };


  return (
    <DashboardLayout>

      {/* Page Header */}
      <div className="mb-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/employee")}
          icon={ArrowLeft}
          className="pl-0 hover:bg-transparent hover:text-indigo-600 mb-4"
        >
          Back to Dashboard
        </Button>
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 tracking-tight">
              Order Food 🍽️
            </h2>
            <p className="text-lg text-gray-600 mt-2">
              Select food items and place your order
            </p>
            {/* Search Bar */}
            <div className="mt-6 max-w-md">
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-shadow"
              />
            </div>
          </div>

          {/* Scheduling Input */}
          <div className="bg-white/50 backdrop-blur-md p-4 rounded-xl border border-white/50 shadow-sm w-full md:w-auto">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Schedule Order (Optional)</label>
            <div className="flex items-center gap-2">
              <Clock className="text-indigo-600" size={20} />
              <input
                type="datetime-local"
                min={new Date().toISOString().slice(0, 16)}
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 pl-7">Leave empty for immediate order</p>
          </div>
        </div>
      </div>

      {/* Food Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
        {loading ? (
          <p className="col-span-3 text-center text-gray-500">Loading menu...</p>
        ) : (
          foodItems.map((item) => (
            <FoodCard
              key={item.id}
              item={{ ...item, desc: item.description }} // Map description
              qty={cart[item.id] || 0}
              onAdd={() => updateQty(item.id, 1)}
              onRemove={() => updateQty(item.id, -1)}
            />
          ))
        )}
      </div>

      {/* Order Summary Footer */}
      {totalAmount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-xl border-t border-gray-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-40 animate-in slide-in-from-bottom duration-300">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
                <ShoppingBag size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Amount</p>
                <h3 className="text-2xl font-bold text-gray-800">₹{totalAmount}</h3>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              {scheduledTime && (
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-indigo-600 font-bold uppercase">Scheduled For</p>
                  <p className="text-sm font-medium text-gray-800">{new Date(scheduledTime).toLocaleString()}</p>
                </div>
              )}
              <Button
                variant="primary"
                size="lg"
                onClick={handlePlaceOrder}
                className="w-full sm:w-auto shadow-xl shadow-indigo-200"
              >
                {scheduledTime ? "Schedule Order" : "Confirm Order"}
              </Button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default OrderFood;

/* ===================== FOOD CARD ===================== */

const FoodCard = ({ item, qty, onAdd, onRemove }) => (
  <Card className={`flex flex-col h-full hover:scale-[1.02] transition-transform duration-300 ${item.is_special ? 'ring-2 ring-yellow-400 bg-yellow-50/30' : ''}`}>
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {item.name}
          </h3>
          {item.is_special && (
            <span className="inline-block px-2 py-0.5 rounded-md bg-yellow-100 text-yellow-700 text-xs font-bold mb-2 tracking-wide border border-yellow-200">
              ⭐ Today's Special
            </span>
          )}
        </div>
        <span className="text-lg font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
          ₹{item.price}
        </span>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed mb-6">
        {item.desc}
      </p>
    </div>

    {/* Quantity Controls */}
    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
      <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Quantity</span>
      <div className="flex items-center gap-3">
        <button
          onClick={onRemove}
          disabled={qty === 0}
          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <Minus size={14} />
        </button>

        <span className="text-lg font-bold w-6 text-center text-gray-800">
          {qty}
        </span>

        <button
          onClick={onAdd}
          className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 shadow-md transition"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  </Card>
);
