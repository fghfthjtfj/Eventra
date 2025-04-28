import mongoose from "mongoose"

const ModeratorSchema = new mongoose.Schema({
    telegramId: {
        type: String,
        require: true
    }
})

export default mongoose.model("Moderator", ModeratorSchema);