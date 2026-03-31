import { SquarePen, Trash2, TrendingUp } from "lucide-react";
import IncomeModal from "./IncomeModal";

const Income = () => {
  return (
    <div className="w-[75%] ml-8 mr-8 mt-6">
      <div className="flex w-full justify-between">
        <h1 className="text-xl font-medium text-black">INCOMES</h1>
        <IncomeModal />
      </div>

      <div className="h-83 border border-gray-300 mt-6 py-6 px-6 rounded-3xl overflow-y-scroll no-scrollbar ">
        <div className="grid grid-cols-2 gap-10">
          <div className="flex gap-2 justify-between items-center">
            <div className="flex gap-2">
              <span className="bg-gray-100 shadow-2xl text-2xl w-12 h-12 rounded-full flex justify-center items-center">
                🚀
              </span>
              <div className="flex flex-col">
                <span className="font-medium ">Title</span>
                <span className="text-gray-500 text-sm">Category</span>
                <span className="text-xs text-gray-400 font-medium">Date</span>
              </div>
            </div>
            <div className="flex justify-center items-center gap-3">
              <div className="flex items-center justify-center gap-3 py-1 px-4 rounded-md h-fit bg-green-100">
                <span className="text-green-800 font-medium">+1000</span>
                <TrendingUp className="text-green-800 font-bold w-4 h-4" />
              </div>
              <div className="flex justify-center itmes-center gap-2">
                <SquarePen className="w-5 h-5 text-gray-500 cursor-pointer" />
                <Trash2 className="text-red-500 cursor-pointer w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Income;
