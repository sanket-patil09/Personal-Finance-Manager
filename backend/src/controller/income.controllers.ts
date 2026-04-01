import { clerkClient, getAuth } from "@clerk/express";
import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Income } from "../models/income.model";

const addIncome = async (req: Request, res: Response) => {
  try {
    const { emoji, title, amount, category, date } = req.body;
    const { userId } = getAuth(req);
    const clerkUser = await clerkClient.users.getUser(userId || "");
    const email = clerkUser.primaryEmailAddress?.emailAddress;

    const isIncomeDateEmpty = [title, amount, category, date, emoji].some(
      (field) => field.trim() === "",
    );
    if (isIncomeDateEmpty) {
      return res
        .status(400)
        .json({ message: "All income fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const income = await Income.create({
      transactionType: "income",
      title,
      amount,
      category,
      date,
      emoji,
      userId: user._id,
    });

    if (!income) {
      return res.status(500).json({ message: "Failed to create income" });
    }

    user.income.push(income._id);
    await user.save();

    return res.status(201).json({ message: "Income added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserIncome = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    const clerkUser = await clerkClient.users.getUser(userId || "");
    const email = clerkUser.primaryEmailAddress?.emailAddress;

    const user = await User.findOne({ email }).populate({
      path: "income",
      select: "-__v -userId",
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userIncome = user.income;

    return res.status(200).json({
      incomes: userIncome,
      message: "Successfully retrieved user income",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateIncome = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { emoji, title, amount, category, date } = req.body;
    const isIncomeDateEmpty = [title, amount, category, date, emoji].some(
      (field) => field.trim() === "",
    );

    if (isIncomeDateEmpty) {
      return res
        .status(400)
        .json({ message: "All income fields are required" });
    }

    const { userId } = getAuth(req);
    const clerkUser = await clerkClient.users.getUser(userId || "");
    const email = clerkUser.primaryEmailAddress?.emailAddress;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedIncome = await Income.findOneAndUpdate(
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

    if (!updatedIncome) {
      return res.status(404).json({ message: "Income not found" });
    }

    return res.status(200).json({ message: "Income updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteIncome = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = getAuth(req);
    const clerkUser = await clerkClient.users.getUser(userId || "");
    const email = clerkUser.primaryEmailAddress?.emailAddress;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedIncome = await Income.findOneAndDelete({
      id: id,
      userId: user._id,
    });

    if (!deletedIncome) {
      return res.status(404).json({ message: "Income not found" });
    }

    await User.updateOne({ _id: user._id }, { $pull: { income: id } });

    return res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { addIncome, getUserIncome, updateIncome, deleteIncome };
