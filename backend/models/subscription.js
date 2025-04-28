import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dateNow: {
    type: Date,
    require: true
  },
  dateExpression: {
    type: Date,
    require: true
  },
  nameSubscription: {
    type: String,
    require: true
  }
});

export default mongoose.model("Subscription", SubscriptionSchema);
