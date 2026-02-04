import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import {
    ArrowLeft,
    Calendar,
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
import api from "../../services/api";
import { Input, Select } from "../../components/ui/Input";
import { TableContainer, Thead, Tbody, Tr, Th, Td } from "../../components/ui/Table";
import Modal from "../../components/ui/Modal";

const DailySummaryReviews = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [feedbackFilter, setFeedbackFilter] = useState("All");
    const [showModal, setShowModal] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [loading, setLoading] = useState(false);

    // State for Dynamic Data
    const [widgetsData, setWidgetsData] = useState({
        total_orders: 0, revenue: "0", completed: 0, cancelled: 0, avg_value: "0"
    });
    const [topSellingItems, setTopSellingItems] = useState([]);
    const [allReviews, setAllReviews] = useState([]);
    const [reviewStats, setReviewStats] = useState({ avg: 0, total: 0 });

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Stats
            const statsRes = await api.get(`/dashboard/admin-stats?date=${selectedDate}`);
            setWidgetsData(statsRes.data.widgets);
            setTopSellingItems(statsRes.data.top_items);

            // 2. Fetch Reviews (Reviews are global for now, filtering by date in UI if needed, or backend could support it)
            // For now, we fetch all reviews to show the robust list.
            const reviewsRes = await api.get("/reviews/all");
            setAllReviews(reviewsRes.data.reviews);
            setReviewStats({
                avg: reviewsRes.data.average_rating,
                total: reviewsRes.data.total_reviews
            });

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Initial Load
    React.useEffect(() => {
        fetchDashboardData();
    }, []); // Run once on mount

    // Definition mapped to state
    const widgets = [
        { title: "Total Orders", value: widgetsData.total_orders, icon: <ShoppingBag className="w-6 h-6 text-blue-600" />, bg: "bg-blue-100" },
        { title: "Total Revenue", value: `₹${widgetsData.revenue}`, icon: <TrendingUp className="w-6 h-6 text-green-600" />, bg: "bg-green-100" },
        { title: "Completed Orders", value: widgetsData.completed, icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />, bg: "bg-emerald-100" },
        { title: "Cancelled Orders", value: widgetsData.cancelled, icon: <AlertCircle className="w-6 h-6 text-red-600" />, bg: "bg-red-100" },
        { title: "Avg Order Value", value: `₹${widgetsData.avg_value}`, icon: <Target className="w-6 h-6 text-purple-600" />, bg: "bg-purple-100" },
    ];

    const feedbackData = allReviews; // Use fetched reviews

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
        fetchDashboardData();
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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
                        <span className="text-5xl font-extrabold">{reviewStats.avg}</span>
                        <span className="text-2xl text-indigo-200">/ 5.0</span>
                    </div>
                    <div className="flex justify-center gap-1 mb-4 text-yellow-300">
                        {Array(5).fill(0).map((_, i) => (
                            <Star
                                key={i}
                                size={32}
                                fill={i < Math.round(reviewStats.avg) ? "currentColor" : "transparent"}
                                stroke={i < Math.round(reviewStats.avg) ? "none" : "currentColor"}
                            />
                        ))}
                    </div>
                    <p className="text-indigo-100 opacity-90">Based on {reviewStats.total} reviews</p>
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
