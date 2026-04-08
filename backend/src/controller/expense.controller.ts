import { clerkClient, getAuth } from "@clerk/express";
import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Expense } from "../models/expense.model";

const addExpense = async (req: Request, res: Response) => {
  try {
    const { emoji, title, amount, category, date } = req.body;
    const { userId } = getAuth(req);
    const clerkUser = await clerkClient.users.getUser(userId || "");
    const email = clerkUser.primaryEmailAddress?.emailAddress;

    const isExpenseDateEmpty = [title, amount, category, date, emoji].some(
      (field) => field.trim() === "",
    );
    if (isExpenseDateEmpty) {
      return res
        .status(400)
        .json({ message: "All expense fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const expense = await Expense.create({
      transactionType: "expense",
      title,
      amount,
      category,
      date,
      emoji,
      userId: user._id,
    });

    if (!expense) {
      return res.status(500).json({ message: "Failed to create expense" });
    }

    user.expenses.push(expense._id);
    await user.save();

    return res.status(201).json({ message: "Expense added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserExpense = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    const clerkUser = await clerkClient.users.getUser(userId || "");
    const email = clerkUser.primaryEmailAddress?.emailAddress;

    const user = await User.findOne({ email }).populate({
      path: "expenses",
      select: "-__v -userId",
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userExpense = user.expenses;

    return res.status(200).json({
      Expense: userExpense,
      message: "Successfully retrieved user expense",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { emoji, title, amount, category, date } = req.body;
    const isExpenseDateEmpty = [title, amount, category, date, emoji].some(
      (field) => field.trim() === "",
    );

    if (isExpenseDateEmpty) {
      return res
        .status(400)
        .json({ message: "All expense fields are required" });
    }

    const { userId } = getAuth(req);
    const clerkUser = await clerkClient.users.getUser(userId || "");
    const email = clerkUser.primaryEmailAddress?.emailAddress;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedExpense = await Expense.findOneAndUpdate(
      {
        _id: id,
        userId: user._id,
      },
      {
        $set: {
          title,
          amount,
          category,
          date,
          emoji,
        },
      },
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    return res.status(200).json({ message: "Expense updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = getAuth(req);
    const clerkUser = await clerkClient.users.getUser(userId || "");
    const email = clerkUser.primaryEmailAddress?.emailAddress;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedExpense = await Expense.findOneAndDelete({
      _id: id,
      userId: user._id,
    });

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await User.updateOne({ _id: user._id }, { $pull: { expenses: id } });

    return res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { addExpense, updateExpense, deleteExpense, getUserExpense };
