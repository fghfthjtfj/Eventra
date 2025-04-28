import mongoose from "mongoose";

const CustomerRequestSchema = new mongoose.Schema({
  city: { type: String, required: true },
  categoryId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  }],
  eventName: {
    type: String,
    require: true,
  },

  fee: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: false },
  guestCount: { type: String, required: true },
  description: { type: String, required: false },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  approved: { type: Boolean, required: true, default:false },
  isReject: { type: Boolean, required: true, default:false },
  order: { type: Boolean, required: true, default:false },
});

export default mongoose.model(
  "CustomerRequest",
  CustomerRequestSchema
);
