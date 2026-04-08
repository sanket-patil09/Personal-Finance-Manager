"use client";
import { SquarePen, Trash2, TrendingUp } from "lucide-react";
import TransactionModal from "./Transaction.Modal";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import {
  addIncome,
  deleteIncome,
  fetchIncome,
  updateIncome,
} from "@/services/income.services";
import { IChartSeriesPoint, ITransactionData } from "@/utils/types";
import { useEffect, useMemo, useState } from "react";
import { Spinner } from "./ui/spinner";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { fetchTransactionsList, getChartOptions } from "../utils/helpers";

const Income = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [incomeList, setIncomeList] = useState<ITransactionData[]>([]);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [incomeObj, setIncomeObj] = useState<ITransactionData | null>(null);
  const [seriesData, setSeriesData] = useState<IChartSeriesPoint[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const handleAddIncome = async (incomeObj: ITransactionData) => {
    try {
      const token = await getToken();
      if (!token) return;

      await addIncome(incomeObj, token);
      toast.success("Income added successfully!");
      await handlefetchUserIncome();
    } catch (error) {
      toast.error("Failed to add income. Please try again.");
      console.log(error);
    }
  };

  const handlefetchUserIncome = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) return;
      const incomeList = await fetchIncome(token);
      setIncomeList(incomeList);

      const { newSeriesData = [], newCategories = [] } =
        fetchTransactionsList(incomeList);
      (setSeriesData(newSeriesData), setCategories(newCategories));

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleUpdateIncome = async (income: ITransactionData) => {
    try {
      const token = await getToken();
      if (!token || !income._id) return;
      await updateIncome(income, token, income._id);
      await handlefetchUserIncome();
      toast.success("Income updated successfully!");
    } catch (error) {
      toast.error("Failed to update income. Please try again.");
      console.log(error);
    }
  };

  const handleDeleteIncome = async (id: string) => {
    try {
      const token = await getToken();
      if (!token) return;
      await deleteIncome(token, id);
      await handlefetchUserIncome();
      toast.success("Income deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete income. Please try again.");
      console.log(error);
    }
  };

  useEffect(() => {
    handlefetchUserIncome();
  }, []);

  const options: Highcharts.Options = useMemo(() => {
    return getChartOptions(categories, seriesData);
  }, [categories, seriesData]);

  return (
    <div className="w-[75%] ml-8 mr-8 mt-6">
      <div className="flex w-full justify-between">
        <h1 className="text-xl font-medium text-black">INCOMES</h1>
        <TransactionModal
          onAddTransaction={handleAddIncome}
          onUpdateTransaction={handleUpdateIncome}
          showTransactionModal={showIncomeModal}
          setShowTransactionModal={setShowIncomeModal}
          transactionObj={incomeObj}
          isEditMode={isEditMode}
          setisEditMode={setIsEditMode}
          type="income"
        />
      </div>
      {incomeList?.length ? (
        <div className="border border-gray-300 mt-4 py-3 px-6 rounded-3xl flex-1">
          <div className="font-medium text-lg">Income Overview</div>
          <div className="text-sm text-gray-500">
            Monitor your income over time and gain insights into your earnings
          </div>

          <div className="mt-8 ">
            <HighchartsReact highcharts={Highcharts} options={options} />
          </div>
        </div>
      ) : null}

      {incomeList?.length ? (
        <div className="h-83 border border-gray-300 mt-6 py-6 px-6 rounded-3xl overflow-y-scroll no-scrollbar ">
          <div className="grid grid-cols-2 gap-10">
            {incomeList.map((income: ITransactionData, index: number) => {
              return (
                <div
                  key={index}
                  className="flex gap-2 justify-between items-center"
                >
                  <div className="flex gap-2">
                    <span className="bg-gray-100 shadow-2xl text-2xl w-12 h-12 rounded-full flex justify-center items-center">
                      {income.emoji}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-medium ">{income.title}</span>
                      <span className="text-gray-500 text-sm">
                        {income.category}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        {income.date
                          ? new Date(income.date).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-center items-center gap-3">
                    <div className="flex items-center justify-center gap-3 py-1 px-4 rounded-md h-fit bg-green-100">
                      <span className="text-green-900 font-bold">
                        + {income.amount}
                      </span>
                      <TrendingUp className="text-green-800 font-bold w-4 h-4" />
                    </div>
                    <div className="flex justify-center itmes-center gap-2">
                      <SquarePen
                        className="w-5 h-5 text-gray-500 cursor-pointer"
                        onClick={() => {
                          setIsEditMode(true);
                          setShowIncomeModal(true);
                          setIncomeObj(income);
                        }}
                      />
                      <Trash2
                        className="text-red-500 cursor-pointer w-5 h-5"
                        onClick={() => {
                          handleDeleteIncome(income._id || "");
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
          Click &quot;Add Income&quot; button to add income
        </div>
      )}
    </div>
  );
};

export default Income;
