import mongoose from "mongoose";

const PromoSchema = new mongoose.Schema({
  promo: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  fixPrice: {
    type: Number
  }, 
  percentPrice: {
    type: Number
  },
  tarifs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TarifSchema",
    },
  ]
});

export default mongoose.model("Promo", PromoSchema);
