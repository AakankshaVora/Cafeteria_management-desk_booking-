import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/ui/Button";
import { Input, Select } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import api from "../../services/api";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "employee" // Default role
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculatePasswordStrength = (pass) => {
        let strength = 0;
        if (pass.length >= 8) strength += 25;
        if (pass.match(/[A-Z]/)) strength += 25;
        if (pass.match(/[0-9]/)) strength += 25;
        if (pass.match(/[^A-Za-z0-9]/)) strength += 25;
        return strength;
    };

    const passwordStrength = calculatePasswordStrength(formData.password);

    const handleSubmit = async () => {
        const { name, email, password, confirmPassword, role } = formData;

        if (!name || !email || !password || !confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        // Role validation (Although fixed to employee in UI mostly)
        if (role !== "employee") {
            toast.error("Only Employee registration is allowed publicly");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        // Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Invalid email format");
            return;
        }

        setLoading(true);
        try {
            await api.post("/auth/register", {
                name,
                email,
                password,
                role
            });

            toast.success("Registration successful! Please login.");
            setTimeout(() => navigate("/login"), 1500); // Small delay for user to read toast

        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-slate-100 to-purple-50 relative overflow-hidden py-10">

            {/* Background Blobs */}
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-indigo-300 rounded-full blur-[120px] opacity-30"></div>
            <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] bg-purple-300 rounded-full blur-[120px] opacity-30"></div>

            <Card className="w-full max-w-lg p-8 z-10 shadow-2xl border-white/60">

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight mb-2">
                        Create Account 🚀
                    </h2>
                    <p className="text-gray-500">
                        Join the Cafeteria & Desk System
                    </p>
                </div>

                <div className="space-y-5">
                    <Input
                        label="Full Name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                    />

                    <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <Select
                        label="Role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="employee">Employee</option>
                        <option value="cafeteria_admin" disabled>Cafeteria Admin (Contact IT)</option>
                        <option value="desk_admin" disabled>Desk Admin (Contact IT)</option>
                    </Select>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Password"
                            name="password"
                            placeholder="Min 8 chars"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            rightElement={
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-indigo-600">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            }
                        />
                        <Input
                            label="Confirm Password"
                            name="confirmPassword"
                            placeholder="Repeat password"
                            type={showPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Password Strength Indicator */}
                    {formData.password && (
                        <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-1">
                            <div
                                className={`h-full transition-all duration-300 ${passwordStrength < 50 ? 'bg-red-500' :
                                        passwordStrength < 75 ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}
                                style={{ width: `${passwordStrength}%` }}
                            />
                        </div>
                    )}

                    <Button
                        onClick={handleSubmit}
                        variant="primary"
                        className="w-full h-12 text-lg shadow-indigo-200 mt-4"
                        disabled={loading}
                        icon={UserPlus}
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </Button>

                    <div className="text-center mt-6">
                        <span className="text-gray-500 text-sm">Already have an account? </span>
                        <Link to="/login" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
                            Sign In
                        </Link>
                    </div>
                </div>
            </Card>

        </div>
    );
};

export default Register;
