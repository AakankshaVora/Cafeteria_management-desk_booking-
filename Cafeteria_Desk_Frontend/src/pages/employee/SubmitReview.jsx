import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Card } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Input, Textarea } from "../../components/ui/Input";
import { Star, Send, ArrowLeft } from "lucide-react";

const pastReviews = [
  {
    id: 1,
    rating: 4,
    feedback: "Good food quality",
    date: "2026-01-18",
    time: "13:30",
  },
];

const SubmitReview = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Please provide a rating");
      return;
    }
    toast.success("Feedback submitted successfully");
    navigate("/employee");
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col items-start gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/employee")}
          icon={ArrowLeft}
          className="pl-0 hover:bg-transparent hover:text-indigo-600"
        >
          Back to Dashboard
        </Button>
        <div>
          <h2 className="text-4xl font-bold text-gray-800 tracking-tight">Submit Review</h2>
          <p className="text-gray-600 mt-2">We value your feedback to improve our services</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* Review Form */}
        <Card className="shadow-xl">
          <h3 className="text-xl font-bold text-gray-800 mb-6">How was your experience?</h3>

          {/* Star Rating */}
          <div className="flex flex-col items-center justify-center py-6 bg-gray-50 rounded-2xl mb-8 border border-gray-100">
            <div className="flex gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    size={40}
                    fill={star <= (hoverRating || rating) ? "#FFB020" : "transparent"}
                    color={star <= (hoverRating || rating) ? "#FFB020" : "#CBD5E1"}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm font-medium text-gray-500">
              {rating > 0 ? `You rated ${rating} out of 5` : "Click a star to rate"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Input
                label="Date of Visit"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <Input
                label="Time of Visit"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <Textarea
              label="Your Feedback"
              rows="4"
              placeholder="Tell us what you liked or what we can improve..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />

            <div className="flex gap-4 pt-2">
              <Button
                variant="secondary"
                onClick={() => navigate("/employee")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                icon={Send}
                className="flex-1 shadow-indigo-200"
              >
                Submit Review
              </Button>
            </div>
          </div>
        </Card>

        {/* Past Reviews */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-6 px-2">My Past Reviews</h3>
          <div className="space-y-6">
            {pastReviews.map((r) => (
              <div
                key={r.id}
                className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-white/60 hover:bg-white/80 transition shadow-sm"
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array(5).fill(0).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill={i < r.rating ? "#FFB020" : "transparent"}
                      color={i < r.rating ? "#FFB020" : "#CBD5E1"}
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic text-lg leading-relaxed mb-4">"{r.feedback}"</p>
                <div className="flex items-center justify-between text-sm text-gray-400 font-medium">
                  <span>{r.date}</span>
                  <span>{r.time}</span>
                </div>
              </div>
            ))}

            {pastReviews.length === 0 && (
              <div className="text-center py-10 text-gray-400 italic">
                You have not submitted any reviews yet.
              </div>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default SubmitReview;
