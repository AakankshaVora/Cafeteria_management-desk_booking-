import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import { Card } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { ShoppingBag, Plus, Minus, ArrowLeft } from "lucide-react";

const foodItemsData = [
  {
    id: 1,
    name: "Veg Sandwich",
    price: 50,
    desc: "Fresh vegetables with mint chutney and butter toasted bread",
  },
  {
    id: 2,
    name: "Paneer Wrap",
    price: 80,
    desc: "Spiced paneer cubes wrapped in a soft tortilla with veggies",
  },
  {
    id: 3,
    name: "Cold Coffee",
    price: 40,
    desc: "Chilled creamy coffee topped with chocolate powder",
  },
  {
    id: 4,
    name: "Chicken Burger",
    price: 120,
    desc: "Juicy chicken patty with lettuce, cheese, and special sauce",
  },
  {
    id: 5,
    name: "Masala Dosa",
    price: 70,
    desc: "Crispy rice crepe filled with spiced potato mix, with chutney",
  },
  {
    id: 6,
    name: "Fresh Juice",
    price: 60,
    desc: "Seasonal fresh fruit juice, no added sugar",
  },
];

const OrderFood = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({});

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
    const item = foodItemsData.find((i) => i.id === Number(id));
    return total + item.price * qty;
  }, 0);

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
        <h2 className="text-4xl font-bold text-gray-800 tracking-tight">
          Order Food 🍽️
        </h2>
        <p className="text-lg text-gray-600 mt-2">
          Select food items and place your order
        </p>
      </div>

      {/* Food Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
        {foodItemsData.map((item) => (
          <FoodCard
            key={item.id}
            item={item}
            qty={cart[item.id] || 0}
            onAdd={() => updateQty(item.id, 1)}
            onRemove={() => updateQty(item.id, -1)}
          />
        ))}
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

            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                toast.success("Order placed successfully");
                navigate("/employee");
              }}
              className="w-full sm:w-auto shadow-xl shadow-indigo-200"
            >
              Confirm Order
            </Button>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default OrderFood;

/* ===================== FOOD CARD ===================== */

const FoodCard = ({ item, qty, onAdd, onRemove }) => (
  <Card className="flex flex-col h-full hover:scale-[1.02] transition-transform duration-300">
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {item.name}
        </h3>
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
