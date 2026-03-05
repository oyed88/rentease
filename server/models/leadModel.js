import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property"
  },
  buyerName: String,
  buyerEmail: String,
  buyerPhone: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Lead", leadSchema);