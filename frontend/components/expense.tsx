"use client";
import { SquarePen, Trash2, TrendingDown } from "lucide-react";
import TransactionModal from "./Transaction.Modal";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { IChartSeriesPoint, ITransactionData } from "@/utils/types";
import { useEffect, useMemo, useState } from "react";
import { Spinner } from "./ui/spinner";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { fetchTransactionsList, getChartOptions } from "../utils/helpers";
import {
  addExpense,
  deleteExpense,
  fetchExpense,
  updateExpense,
} from "@/services/expense.services";

const Expense = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [expenseList, setExpenseList] = useState<ITransactionData[]>([]);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [expenseObj, setExpenseObj] = useState<ITransactionData | null>(null);
  const [seriesData, setSeriesData] = useState<IChartSeriesPoint[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const handleAddExpense = async (expenseObj: ITransactionData) => {
    try {
      const token = await getToken();
      if (!token) return;

      await addExpense(expenseObj, token);
      toast.success("Expense added successfully!");
      await handlefetchUserExpense();
    } catch (error) {
      toast.error("Failed to add expense. Please try again.");
      console.log(error);
    }
  };

  const handlefetchUserExpense = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) return;
      const expenseList = await fetchExpense(token);
      setExpenseList(expenseList);

      const { newSeriesData = [], newCategories = [] } =
        fetchTransactionsList(expenseList);
      (setSeriesData(newSeriesData), setCategories(newCategories));

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleUpdateExpense = async (expense: ITransactionData) => {
    try {
      const token = await getToken();
      if (!token || !expense._id) return;
      await updateExpense(expense, token, expense._id);
      await handlefetchUserExpense();
      toast.success("Expense updated successfully!");
    } catch (error) {
      toast.error("Failed to update Expense. Please try again.");
      console.log(error);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      const token = await getToken();
      if (!token) return;
      await deleteExpense(token, id);
      await handlefetchUserExpense();
      toast.success("Expense deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete expense. Please try again.");
      console.log(error);
    }
  };

  useEffect(() => {
    handlefetchUserExpense();
  }, []);

  const options: Highcharts.Options = useMemo(() => {
    return getChartOptions(categories, seriesData);
  }, [categories, seriesData]);

  return (
    <div className="w-[75%] ml-8 mr-8 mt-6">
      <div className="flex w-full justify-between">
        <h1 className="text-xl font-medium text-black">Expenses</h1>
        <TransactionModal
          onAddTransaction={handleAddExpense}
          onUpdateTransaction={handleUpdateExpense}
          showTransactionModal={showExpenseModal}
          setShowTransactionModal={setShowExpenseModal}
          transactionObj={expenseObj}
          isEditMode={isEditMode}
          setisEditMode={setIsEditMode}
          type="expense"
        />
      </div>
      {expenseList?.length ? (
        <div className="border border-gray-300 mt-4 py-3 px-6 rounded-3xl flex-1">
          <div className="font-medium text-lg">Expense Overview</div>
          <div className="text-sm text-gray-500">
            Monitor your Expense over time and gain insights into your earnings
          </div>

          <div className="mt-8 ">
            <HighchartsReact highcharts={Highcharts} options={options} />
          </div>
        </div>
      ) : null}

      {expenseList?.length ? (
        <div className="h-83 border border-gray-300 mt-6 py-6 px-6 rounded-3xl overflow-y-scroll no-scrollbar ">
          <div className="grid grid-cols-2 gap-10">
            {expenseList.map((expense: ITransactionData, index: number) => {
              return (
                <div
                  key={index}
                  className="flex gap-2 justify-between items-center"
                >
                  <div className="flex gap-2">
                    <span className="bg-gray-100 shadow-2xl text-2xl w-12 h-12 rounded-full flex justify-center items-center">
                      {expense.emoji}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-medium ">{expense.title}</span>
                      <span className="text-gray-500 text-sm">
                        {expense.category}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        {expense.date
                          ? new Date(expense.date).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-center items-center gap-3">
                    <div className="flex items-center justify-center gap-3 py-1 px-4 rounded-md h-fit bg-green-100">
                      <span className="text-red-600 font-bold">
                        - {expense.amount}
                      </span>
                      <TrendingDown className="text-red-600 font-bold w-4 h-4" />
                    </div>
                    <div className="flex justify-center itmes-center gap-2">
                      <SquarePen
                        className="w-5 h-5 text-gray-500 cursor-pointer"
                        onClick={() => {
                          setIsEditMode(true);
                          setShowExpenseModal(true);
                          setExpenseObj(expense);
                        }}
                      />
                      <Trash2
                        className="text-red-500 cursor-pointer w-5 h-5"
                        onClick={() => {
                          handleDeleteExpense(expense._id || "");
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : loading ? (
        <div className="h-full w-full flex items-center justify-center">
          <Spinner className="w-10 h-10" />
        </div>
      ) : (
        <div className="justify-center items-center w-full h-full flex font-medium">
          Click &quot;Add Expense&quot; button to add expense
        </div>
      )}
    </div>
  );
};

export default Expense;
