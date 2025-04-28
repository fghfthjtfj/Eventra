import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reviewText: {
    type: String,
    require: true,
  },
  reviewTitle: {
    type: String,
    require: true,
  },
  grade: {
    type: Number,
    required: true
  },
  approved: { 
    type: Boolean, 
    required: true, 
    default: false 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Review", ReviewSchema);
