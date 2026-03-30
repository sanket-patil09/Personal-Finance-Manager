import mongoose, { Schema } from "mongoose";

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
  },
  { timestamps: true },
);

export const User = mongoose.model("User", UserSchema);
