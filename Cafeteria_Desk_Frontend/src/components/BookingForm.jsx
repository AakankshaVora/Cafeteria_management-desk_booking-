import React, { useState } from "react";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import { Input } from "./ui/Input";
import api from "../services/api";

const BookingForm = ({ desk, isOpen, onClose, onSuccess }) => {
    const [bookingDate, setBookingDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!bookingDate) {
                throw new Error("Please select a date.");
            }

            await api.post("/desk-bookings", {
                desk_id: desk.id,
                booking_date: bookingDate,
            });

            // Show success message and close modal
            alert("Desk booked successfully!");
            onSuccess();
            onClose();
            setBookingDate("");
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message || err.message || "Failed to book desk."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Book Desk ${desk?.id}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-100 text-red-700 p-2 rounded text-sm">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                    </label>
                    <Input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        required
                        min={new Date().toISOString().split("T")[0]}
                    />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Booking..." : "Confirm Booking"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default BookingForm;
