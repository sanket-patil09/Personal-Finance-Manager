import mongoose, { Schema } from "mongoose";
import { ref } from "node:process";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    ImageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    expenses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expense",
      },
    ],
    income: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Income",
      },
    ],
  },
  { timestamps: true },
);

export const User = mongoose.model("User", UserSchema);
