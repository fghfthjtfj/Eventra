import mongoose from "mongoose";

const TarifSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    term: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});


export default mongoose.model("Tarif", TarifSchema);
