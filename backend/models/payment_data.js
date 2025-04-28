import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    user_email: { type: String, required: true },
    price: { type: Number, required: true },
    date: { type: Date, required: true },
    status: { type: String, default: "in_progress" },
    tarif_name: { type: String, required: true },

  },
  { strict: true } // Убедитесь, что strict включён
);


export default mongoose.model("Payments", PaymentSchema);
