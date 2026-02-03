import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { Mail, ArrowRight } from "lucide-react";
import api from "../../services/api";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        setLoading(true);
        try {
            const response = await api.post("/auth/forgot-password", { email });
            toast.success(response.data.message);

            // For Demo: Redirect to reset password immediately with token in query param
            // In real life, user clicks email link
            if (response.data.token) {
                setTimeout(() => {
                    navigate(`/reset-password?token=${response.data.token}`);
                }, 1500);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to process request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-100 to-purple-50 relative overflow-hidden">

            {/* Background Blobs (Same as Login) */}
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-indigo-300 rounded-full blur-[120px] opacity-30"></div>
            <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-purple-300 rounded-full blur-[120px] opacity-30"></div>

            <Card className="w-full max-w-md p-10 z-10 shadow-2xl border-white/60">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight mb-2">
                        Forgot Password? 🔒
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Enter your email to receive a reset link
                    </p>
                </div>

                <div className="space-y-6">
                    <Input
                        label="Email Address"
                        placeholder="role@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                    />

                    <Button
                        onClick={handleSubmit}
                        variant="primary"
                        className="w-full h-12 text-lg shadow-indigo-200"
                        disabled={loading}
                        icon={loading ? null : ArrowRight}
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </Button>

                    <Link to="/login" className="block text-center text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
                        Back to Login
                    </Link>
                </div>
            </Card>

            <p className="absolute bottom-10 text-center text-xs text-gray-400">
                © 2026 Cafeteria & Desk Booking System
            </p>
        </div>
    );
};

export default ForgotPassword;
