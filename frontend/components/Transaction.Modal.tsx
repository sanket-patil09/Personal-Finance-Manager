"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/Modal";
import EmojiPicker from "emoji-picker-react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  INCOME_CATEGORY_CONSTANTS,
  EXPENSE_CATEGORY_CONSTANTS,
  TRANSACTION_CATEGORY_CONSTANTS,
} from "@/utils/constants";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { ITransactionData } from "@/utils/types";
import { toast } from "sonner";

const TransactionModal = ({
  onAddTransaction,
  onUpdateTransaction,
  showTransactionModal,
  setShowTransactionModal,
  transactionObj,
  isEditMode,
  setisEditMode,
  type,
  showTransactionType = false,
}: {
  onAddTransaction: (transactionData: ITransactionData) => void;
  onUpdateTransaction: (transactionData: ITransactionData) => void;
  showTransactionModal: boolean;
  setShowTransactionModal: (value: boolean) => void;
  transactionObj: ITransactionData | null;
  isEditMode: boolean;
  setisEditMode: (value: boolean) => void;
  type: string;
  showTransactionType?: boolean;
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(
    transactionObj?.emoji || "🚀",
  );
  const [title, setTitle] = useState(transactionObj?.title || "");
  const [amount, setAmount] = useState(transactionObj?.amount || "");
  const [date, setDate] = useState<Date | null>(transactionObj?.date || null);
  const [category, setCategory] = useState(transactionObj?.category || "");
  const [open, setopen] = useState(false);
  const [transactionType, setTransactionType] = useState(
    transactionObj?.transactionType || "",
  );

  const handleEmojiSelect = (emojiObj: any) => {
    setSelectedEmoji(emojiObj.emoji);
    setShowEmojiPicker(false);
  };

  const handleAddIncome = () => {
    const incomeData: ITransactionData = {
      emoji: selectedEmoji,
      title,
      date,
      amount,
      category,
      _id: transactionObj?._id,
      transactionType,
    };

    if (!title || !amount || !date || !category || !selectedEmoji) {
      toast.error("Please fill in all the fields");
      return;
    }
    if (isEditMode) {
      onUpdateTransaction(incomeData);
    } else {
      onAddTransaction(incomeData);
    }
    setShowTransactionModal(false);
  };

  const handleResetForm = () => {
    (setSelectedEmoji("🚀"),
      setTitle(""),
      setAmount(""),
      setDate(null),
      setCategory(""));
  };

  const handleOpenChange = () => {
    setShowTransactionModal(!showTransactionModal);
    if (!showTransactionModal) {
      handleResetForm();
    }
  };

  useEffect(() => {
    if (transactionObj) {
      setSelectedEmoji(transactionObj.emoji);
      setTitle(transactionObj.title);
      setAmount(transactionObj.amount);
      setDate(transactionObj.date);
      setCategory(transactionObj.category);
      setTransactionType(transactionObj.transactionType || "");
    }
  }, [transactionObj]);

  const modalTitle =
    type === "income"
      ? "Add Income "
      : type === "transaction"
        ? "Add Transaction "
        : "Add Expense ";
  const TransactionCategory =
    type === "income" || transactionType === "income"
      ? INCOME_CATEGORY_CONSTANTS
      : EXPENSE_CATEGORY_CONSTANTS;

  const footerBtnTitle =
    type === "income"
      ? "Income"
      : type === "transaction"
        ? "Transaction"
        : "Expense";

  return (
    <Dialog open={showTransactionModal} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">{modalTitle}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold">{modalTitle}</DialogTitle>
          <DialogDescription>
            {modalTitle}
            to the list in just few steps
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-start justify-center gap-4">
          <div className="relative">
            <span
              className="text-4xl border border-gray-300 py-1 px-2 rounded-md cursor-pointer"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              {selectedEmoji}
            </span>
            {showEmojiPicker ? (
              <div className="absolute top-0 left-15">
                <EmojiPicker onEmojiClick={handleEmojiSelect} />
              </div>
            ) : null}
          </div>

          {showTransactionType ? (
            <div className="w-full">
              <span className="font-medium">Transaction</span>
              <Select
                onValueChange={(value) => setTransactionType(value)}
                disabled={isEditMode}
              >
                <SelectTrigger className="mt-2 w-full cursor-pointer">
                  <SelectValue placeholder="Select Transaction Type" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    <SelectLabel>Label</SelectLabel>
                    {TRANSACTION_CATEGORY_CONSTANTS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.value}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ) : null}

          <div className="w-full">
            <span className="font-bold">Title</span>
            <Input
              className="mt-2"
              placeholder={
                type === "income"
                  ? "Enter Income Title"
                  : type === "transaction"
                    ? "Enter Transaction Title"
                    : "Enter Expense Title"
              }
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>

          <div className="w-full">
            <span className="font-medium">Category</span>
            <Select
              onValueChange={(value) => setCategory(value)}
              value={category}
            >
              <SelectTrigger className="mt-2 w-full cursor-pointer">
                <SelectValue placeholder="Select a Category" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  {TransactionCategory.map((item) => (
                    <SelectItem
                      key={item.title}
                      value={item.title}
                      className="cursor-pointer"
                    >
                      {item.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full">
            <span className="font-medium">Amount</span>
            <Input
              className="mt-2"
              placeholder="0.00"
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <span className="font-medium">Date</span>
            <Popover open={open} onOpenChange={setopen}>
              <PopoverTrigger asChild className="cursor-pointer">
                <Button variant="outline" className="flex justify-between">
                  {date ? new Date(date).toLocaleDateString() : "Select Date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="overflow-hidden w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date ?? undefined}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setDate(date ?? null);
                    setopen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="cursor-pointer" variant="outline">
              Close
            </Button>
          </DialogClose>
          <Button className="cursor-pointer" onClick={handleAddIncome}>
            {isEditMode
              ? `Update ${footerBtnTitle}`
              : `Update ${footerBtnTitle}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default TransactionModal;
