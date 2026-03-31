"use client";
import { useState } from "react";
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
import { INCOME_CATEGORY_CONSTANTS } from "@/utils/constants";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";

const IncomeModal = () => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("🚀");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [category, setCategory] = useState("");
  const [open, setopen] = useState(false);

  const handleEmojiSelect = (emojiObj: any) => {
    setSelectedEmoji(emojiObj.emoji);
    setShowEmojiPicker(false);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">Add Income</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold">Add Income</DialogTitle>
          <DialogDescription>
            Add expenses to keep track of your finances and manage your budget
            in few steps
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
          <div className="w-full">
            <span className="font-bold">Title</span>
            <Input
              className="mt-2"
              placeholder="Enter Income Title"
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
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  {INCOME_CATEGORY_CONSTANTS.map((item) => (
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
          <Button className="cursor-pointer">Add Income</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default IncomeModal;
