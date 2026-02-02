import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import { toast } from "react-toastify";
import { TableContainer, Thead, Tbody, Tr, Th, Td } from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import { Input, Textarea } from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import { Pencil, Trash2, Plus, ArrowLeft } from "lucide-react";

const initialItems = [
  {
    id: 1,
    name: "Veg Thali",
    desc: "Complete meal with roti, sabzi and dal",
    price: 150,
    available: true,
  },
  {
    id: 2,
    name: "Paneer Wrap",
    desc: "Soft wrap filled with spicy paneer",
    price: 120,
    available: true,
  },
  {
    id: 3,
    name: "Cold Coffee",
    desc: "Chilled coffee with ice cream",
    price: 90,
    available: false,
  },
];

const ManageMenu = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    desc: "",
    price: "",
    available: true,
  });

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      setFormData({ name: "", desc: "", price: "", available: true });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setItems(items.filter((item) => item.id !== id));
      toast.success("Item deleted successfully");
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.price) {
      toast.error("Please fill required fields");
      return;
    }

    if (editingItem) {
      setItems(
        items.map((item) =>
          item.id === editingItem.id ? { ...formData, id: editingItem.id } : item
        )
      );
      toast.success("Item updated successfully");
    } else {
      setItems([...items, { ...formData, id: Date.now() }]);
      toast.success("Item added successfully");
    }
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-violet-50">
      <Topbar />

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate("/cafeteria")}
              icon={ArrowLeft}
              className="pl-0 hover:bg-transparent hover:text-indigo-600 mb-4"
            >
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Manage Cafeteria Menu
            </h1>
            <p className="text-gray-600 mt-1">
              Add, update or remove food items from menu
            </p>
          </div>

          <Button
            onClick={() => handleOpenModal()}
            icon={Plus}
            variant="primary"
          >
            Add New Item
          </Button>
        </div>

        {/* Menu Table */}
        <TableContainer>
          <Thead>
            <Th>Item</Th>
            <Th>Description</Th>
            <Th>Price (₹)</Th>
            <Th>Availability</Th>
            <Th>Action</Th>
          </Thead>
          <Tbody>
            {items.map((item) => (
              <Tr key={item.id}>
                <Td className="font-bold text-gray-800">{item.name}</Td>
                <Td className="text-gray-600 max-w-xs">{item.desc}</Td>
                <Td className="font-semibold text-gray-800">{item.price}</Td>
                <Td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${item.available
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                      }`}
                  >
                    {item.available ? "Available" : "Unavailable"}
                  </span>
                </Td>
                <Td>
                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleOpenModal(item)}
                      icon={Pencil}
                    >
                      Edit
                    </Button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </TableContainer>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItem ? "Edit Menu Item" : "Add Menu Item"}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Item Name"
                placeholder="e.g. Veg Burger"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Price (₹)"
                type="number"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <Textarea
              label="Description"
              placeholder="Brief description of the item"
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              rows={3}
            />

            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <input
                type="checkbox"
                id="isAvailable"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
              />
              <label htmlFor="isAvailable" className="text-gray-700 font-medium cursor-pointer select-none">
                Available for Order
              </label>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-100 justify-end">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                {editingItem ? "Save Changes" : "Create Item"}
              </Button>
            </div>
          </div>
        </Modal>

      </div>
    </div>
  );
};

export default ManageMenu;
