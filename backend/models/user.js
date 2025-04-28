import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  lastName: { type: String, required: false },
  firstName: { type: String, required: false },
  userName: { type: String, required: true },
  telegramId: { type: String, required: true },
  phoneNumber: { type: String, required: false },
  role: { type: String, required: false },
  setCitySearch: {type: String, required: false, default: "Москва"},
    email: { type: String, required: false },

});

export default mongoose.model("User", UserSchema);
