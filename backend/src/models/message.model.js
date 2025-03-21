import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    recieverId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    messageBody: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
