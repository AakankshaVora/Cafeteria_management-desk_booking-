import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { Lock, Eye, EyeOff, Save } from "lucide-react";
import api from "../../services/api";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            toast.error("Invalid or missing reset token");
            navigate("/login");
        }
    }, [token, navigate]);

    const handleSubmit = async () => {
        if (!password || !confirmPassword) {
            toast.error("Please fill all fields");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            await api.post("/auth/reset-password", {
                token,
                new_password: password
            });
            toast.success("Password reset successfully. Please login.");
            navigate("/login");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password");
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
                        Reset Password 🔑
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Create a new secure password
                    </p>
                </div>

                <div className="space-y-6">
                    <Input
                        label="New Password"
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        rightElement={
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400 hover:text-indigo-600 focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        }
                    />

                    <Input
                        label="Confirm Password"
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <Button
                        onClick={handleSubmit}
                        variant="primary"
                        className="w-full h-12 text-lg shadow-indigo-200"
                        disabled={loading}
                        icon={Save}
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </Button>
                </div>
            </Card>

            <p className="absolute bottom-10 text-center text-xs text-gray-400">
                © 2026 Cafeteria & Desk Booking System
            </p>
        </div>
    );
};

export default ResetPassword;
