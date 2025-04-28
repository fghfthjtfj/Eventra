import mongoose from "mongoose";

const StatusSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roleStatus: { type: String, required: true },
});

export default mongoose.model("Status", StatusSchema);
