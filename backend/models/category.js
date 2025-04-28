import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  svgName: { type: String, require: true },
  color: {type: String, require: true},
  active: { type: Boolean, required: true, default: true },
});

export default mongoose.model("Category", CategorySchema);
