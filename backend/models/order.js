import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  customerRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CustomerRequest",
    required: true,
  },
  artistRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ArtistRequest",
    required: true,
  },
  status: {
    statusId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Status",
      required: true,
    },
    comment: {
      type: String,
      required: false
    }
  },
  isCustomerView : {
    type: Boolean,
    default: false
  },
  review: {
    type: Boolean, 
    default: false
  }
});

export default mongoose.model("Order", OrderSchema);
