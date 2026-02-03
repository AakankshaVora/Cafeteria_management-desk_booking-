import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Card } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { ArrowLeft } from "lucide-react";

const menuItems = [
  { id: 1, name: "Veg Sandwich", price: 50 },
  { id: 2, name: "Paneer Wrap", price: 80 },
  { id: 3, name: "Cold Coffee", price: 40 },
  { id: 4, name: "Chicken Burger", price: 120 },
  { id: 5, name: "Masala Dosa", price: 70 },
  { id: 6, name: "Fresh Juice", price: 60 },
];

const Menu = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/employee")}
          icon={ArrowLeft}
          className="pl-0 hover:bg-transparent hover:text-indigo-600 mb-4"
        >
          Back to Dashboard
        </Button>
        <h2 className="text-3xl font-bold text-gray-800">Cafeteria Menu</h2>
        <p className="text-gray-600 mt-1">Browse today's delicious offerings</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Card key={item.id} className="hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-xl text-gray-800">{item.name}</h3>
              <span className="text-lg font-bold text-indigo-600">₹{item.price}</span>
            </div>

            <Button className="w-full mt-2" variant="primary">
              Add to Order
            </Button>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Menu;
