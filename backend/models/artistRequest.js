import mongoose from "mongoose";

const ArtistRequestSchema = new mongoose.Schema({
  city: { type: String, required: true },
  categoryId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  ],
  description: { type: String, required: false },
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  price: {
    type: String,
    require: true,
  },
  approved: { type: Boolean, required: true, default: false },
  mainPhoto: { type: String, required: false },
  backGroundPhoto: { type: String, required: false },
  photo: { type: [String], required: false },
  link_video: { type: [String], required: false },
  vk: { type: String, required: false },
  instagram: { type: String, required: false },
  youtube: { type: String, required: false },
  tiktok: { type: String, required: false },
  isRejected: { type: Boolean, default: false },
});

export default mongoose.model("ArtistRequest", ArtistRequestSchema);
