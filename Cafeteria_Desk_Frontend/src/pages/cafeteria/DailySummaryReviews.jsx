import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import {
    ArrowLeft,
    Calendar,
    Download,
    Star,
    TrendingUp,
    ShoppingBag,
    Target,
    AlertCircle,
    CheckCircle2,
    X,
    Eye
} from "lucide-react";
import Button from "../../components/ui/Button";
import { Input, Select } from "../../components/ui/Input";
import { TableContainer, Thead, Tbody, Tr, Th, Td } from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";

const DailySummaryReviews = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [feedbackFilter, setFeedbackFilter] = useState("All");
    const [showModal, setShowModal] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);

    // Mock Data Definition
    const widgets = [
        { title: "Total Orders", value: "312", icon: <ShoppingBag className="w-6 h-6 text-blue-600" />, bg: "bg-blue-100" },
        { title: "Total Revenue", value: "₹45,280", icon: <TrendingUp className="w-6 h-6 text-green-600" />, bg: "bg-green-100" },
        { title: "Completed Orders", value: "298", icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />, bg: "bg-emerald-100" },
        { title: "Cancelled Orders", value: "14", icon: <AlertCircle className="w-6 h-6 text-red-600" />, bg: "bg-red-100" },
        { title: "Avg Order Value", value: "₹145", icon: <Target className="w-6 h-6 text-purple-600" />, bg: "bg-purple-100" },
        { title: "Peak Hour", value: "01:00 PM", icon: <Calendar className="w-6 h-6 text-orange-600" />, bg: "bg-orange-100" },
    ];

    const topSellingItems = [
        { name: "Veg Deluxe Thali", qty: 120, revenue: "18,000", percentage: "35%" },
        { name: "Chicken Biryani", qty: 95, revenue: "14,250", percentage: "28%" },
        { name: "Masala Dosa", qty: 45, revenue: "3,150", percentage: "12%" },
        { name: "Paneer Butter Masala", qty: 30, revenue: "5,400", percentage: "10%" },
        { name: "Cold Coffee", qty: 22, revenue: "2,200", percentage: "5%" },
    ];

    const feedbackData = [
        { id: 1, name: "Alice Johnson", date: "2023-10-27 12:30 PM", rating: 5, feedback: "Excellent food and quick service! Loved the thali.", type: "Positive" },
        { id: 2, name: "Bob Smith", date: "2023-10-27 01:15 PM", rating: 2, feedback: "The coffee was cold and took too long to arrive.", type: "Negative" },
        { id: 3, name: "Charlie Davis", date: "2023-10-27 01:45 PM", rating: 4, feedback: "Good taste, but portion size could be a bit better.", type: "Positive" },
        { id: 4, name: "Dana White", date: "2023-10-27 02:20 PM", rating: 3, feedback: "It was okay. Nothing special.", type: "Positive" }, // Neutral treated as positive/mixed for simplicity or just 'All'
        { id: 5, name: "Evan Wright", date: "2023-10-27 08:10 PM", rating: 1, feedback: "Completely messed up my order.", type: "Negative" },
    ];

    const filteredFeedback = feedbackFilter === "All"
        ? feedbackData
        : feedbackData.filter(f => f.type === feedbackFilter);

    const handleOpenModal = (feedback) => {
        setSelectedFeedback(feedback);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedFeedback(null);
    };

    const handleLoadData = () => {
        // Mock load effect
        console.log("Loading data for date:", selectedDate);
    };

    const handleExport = () => {
        alert("Exporting report for " + selectedDate);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-violet-50 pb-12">
            <Topbar />

            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                            Daily Summary & Reviews
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Detailed analytics, sales performance and customer feedback
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate('/cafeteria')}
                        variant="secondary"
                        icon={ArrowLeft}
                    >
                        Back to Dashboard
                    </Button>
                </div>

                {/* Widgets Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                    {widgets.map((widget, index) => (
                        <div key={index} className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-sm border border-white/50 hover:shadow-md transition">
                            <div className={`p-3 rounded-xl w-fit mb-3 ${widget.bg}`}>
                                {widget.icon}
                            </div>
                            <p className="text-gray-500 text-sm font-medium">{widget.title}</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">{widget.value}</h3>
                        </div>
                    ))}
                </div>

                {/* Date Filter */}
                <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-sm border border-white/50 flex flex-wrap items-end gap-4">

                    <Input
                        label="Select Date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="min-w-[200px]"
                    />

                    <div className="h-full">
                        <Button
                            onClick={handleLoadData}
                            variant="primary"
                            className="mt-0 h-[50px] shadow-indigo-200"
                        >
                            Load Data
                        </Button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Top Selling Items Table */}
                    <TableContainer title="Top Selling Items">
                        <Thead>
                            <Th>Item Name</Th>
                            <Th>Quantity</Th>
                            <Th>Revenue (₹)</Th>
                            <Th>% Sales</Th>
                        </Thead>
                        <Tbody>
                            {topSellingItems.map((item, idx) => (
                                <Tr key={idx}>
                                    <Td className="font-bold text-gray-800">{item.name}</Td>
                                    <Td className="text-gray-600">{item.qty}</Td>
                                    <Td className="font-semibold text-gray-800">{item.revenue}</Td>
                                    <Td>
                                        <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-lg text-xs font-bold">{item.percentage}</span>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </TableContainer>

                    {/* Customer Feedback Table */}
                    <TableContainer
                        title="Customer Feedback"
                        actions={
                            <Select
                                value={feedbackFilter}
                                onChange={(e) => setFeedbackFilter(e.target.value)}
                                className="py-1 px-3 text-sm min-w-[140px]"
                            >
                                <option value="All">All Reviews</option>
                                <option value="Positive">Positive</option>
                                <option value="Negative">Negative</option>
                            </Select>
                        }
                    >
                        <Thead>
                            <Th>Employee</Th>
                            <Th>Rating</Th>
                            <Th>Feedback</Th>
                            <Th>Action</Th>
                        </Thead>
                        <Tbody>
                            {filteredFeedback.map((fb) => (
                                <Tr key={fb.id}>
                                    <Td>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-800">{fb.name}</span>
                                            <span className="text-xs text-gray-400">{fb.date.split(" ")[0]}</span>
                                        </div>
                                    </Td>
                                    <Td>
                                        <div className="flex text-yellow-500">
                                            {Array(fb.rating).fill(0).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                        </div>
                                    </Td>
                                    <Td className="max-w-xs truncate text-gray-500">{fb.feedback}</Td>
                                    <Td>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleOpenModal(fb)}
                                            icon={Eye}
                                            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                        >
                                            View
                                        </Button>
                                    </Td>
                                </Tr>
                            ))}
                            {filteredFeedback.length === 0 && (
                                <Tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                        No feedback found for this filter.
                                    </td>
                                </Tr>
                            )}
                        </Tbody>
                    </TableContainer>
                </div>

                {/* Rating Summary */}
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-[2rem] shadow-xl p-8 text-white text-center">
                    <h2 className="text-2xl font-bold mb-2">Average Rating</h2>
                    <div className="flex justify-center items-center gap-2 mb-2">
                        <span className="text-5xl font-extrabold">4.2</span>
                        <span className="text-2xl text-indigo-200">/ 5.0</span>
                    </div>
                    <div className="flex justify-center gap-1 mb-4 text-yellow-300">
                        <Star size={32} fill="currentColor" />
                        <Star size={32} fill="currentColor" />
                        <Star size={32} fill="currentColor" />
                        <Star size={32} fill="currentColor" />
                        <Star size={32} fill="transparent" stroke="currentColor" />
                    </div>
                    <p className="text-indigo-100 opacity-90">Based on 145 reviews today</p>
                </div>

                {/* Bottom Actions */}
                <div className="flex flex-wrap justify-end gap-4 pt-4">
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/cafeteria')}
                        size="lg"
                    >
                        Back to Dashboard
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleExport}
                        icon={Download}
                        size="lg"
                        className="bg-gray-900 hover:bg-gray-800 shadow-gray-400"
                    >
                        Export Report
                    </Button>
                </div>

            </div>

            {/* Feedback Modal */}
            <Modal
                isOpen={showModal && selectedFeedback}
                onClose={handleCloseModal}
                title="Feedback Details"
            >
                {selectedFeedback && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">
                                {selectedFeedback.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-800">{selectedFeedback.name}</h4>
                                <p className="text-sm text-gray-500">{selectedFeedback.date}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-1 text-yellow-500 mb-3">
                                {Array(5).fill(0).map((_, i) => (
                                    <Star key={i} size={20} fill={i < selectedFeedback.rating ? "currentColor" : "transparent"} stroke={i < selectedFeedback.rating ? "none" : "currentColor"} className={i < selectedFeedback.rating ? "" : "text-gray-300"} />
                                ))}
                            </div>
                            <p className="text-gray-700 leading-relaxed text-lg italic">
                                "{selectedFeedback.feedback}"
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide ${selectedFeedback.type === 'Positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {selectedFeedback.type} Feedback
                            </span>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

        </div>
    );
};

export default DailySummaryReviews;
