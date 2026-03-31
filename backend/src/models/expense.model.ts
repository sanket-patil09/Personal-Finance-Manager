import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    transactionType: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    emoji: {
      type: String,
      required: true,
      trime: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Expense = mongoose.model("Expense", expenseSchema);
