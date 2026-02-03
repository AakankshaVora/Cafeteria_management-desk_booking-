import React, { useState, useEffect } from "react";
import { User, Mail, Shield, Calendar, Edit2, Save, X } from "lucide-react";
import Topbar from "../../components/Topbar";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useAuth } from "../../auth/AuthContext";

const Profile = () => {
    const { user: authUser, login } = useAuth(); // We might need to update context user on save
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: "" });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get("/auth/profile");
            setProfile(response.data);
            setFormData({ name: response.data.name });
        } catch (error) {
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await api.put("/auth/profile", { name: formData.name });
            toast.success("Profile updated successfully");
            setIsEditing(false);
            fetchProfile();

            // Ideally we should also update the auth context if name is stored there, 
            // but for now a refresh will sync it.
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    if (loading) {
        return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-violet-50">
            <Topbar />

            <div className="max-w-4xl mx-auto px-6 py-10">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-white/50">

                    {/* Header Banner */}
                    <div className="h-48 bg-gradient-to-r from-indigo-600 to-violet-600 relative">
                        <div className="absolute -bottom-16 left-10">
                            <div className="p-1 bg-white rounded-full">
                                <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 border-4 border-white shadow-lg">
                                    <User size={64} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 px-10 pb-10">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{profile?.name}</h1>
                                <p className="text-gray-500 font-medium capitalize">{profile?.role}</p>
                            </div>
                            {!isEditing ? (
                                <Button variant="secondary" onClick={() => setIsEditing(true)} icon={Edit2}>
                                    Edit Profile
                                </Button>
                            ) : (
                                <div className="flex gap-3">
                                    <Button variant="ghost" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </Button>
                                    <Button variant="primary" onClick={handleSave} icon={Save}>
                                        Save Changes
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Basic Info */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Personal Information</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                                            <User size={16} /> Full Name
                                        </label>
                                        {isEditing ? (
                                            <Input
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        ) : (
                                            <p className="text-lg font-semibold text-gray-800">{profile?.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                                            <Mail size={16} /> Email Address
                                        </label>
                                        <p className="text-lg font-medium text-gray-600">{profile?.email}</p>
                                        <p className="text-xs text-amber-600 mt-1">Email cannot be changed</p>
                                    </div>
                                </div>
                            </div>

                            {/* Account Info */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Account Details</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                                            <Shield size={16} /> Role
                                        </label>
                                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold uppercase tracking-wide">
                                            {profile?.role}
                                        </span>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                                            <Calendar size={16} /> Joined Date
                                        </label>
                                        <p className="text-lg font-medium text-gray-600">{profile?.created_at}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
