"use client";
import { useEffect, useMemo, useState } from "react";
import TransactionModal from "./Transaction.Modal";
import { ChartTypes, IChartSeriesPoint, ITransactionData } from "@/utils/types";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import {
  addIncome,
  deleteIncome,
  updateIncome,
} from "@/services/income.services";
import {
  addExpense,
  deleteExpense,
  updateExpense,
} from "@/services/expense.services";
import { fetchTransactions } from "@/services/transaction.services";
import { fetchTransactionsList, getChartOptions } from "@/utils/helpers";
import { Button } from "./ui/button";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  SquarePen,
  Trash2,
  TrendingDown,
  TrendingDownIcon,
  TrendingUp,
} from "lucide-react";
import { Spinner } from "./ui/spinner";
const Transactions = () => {
  const { getToken } = useAuth();
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionObj, settransactionObj] = useState<ITransactionData | null>(
    null,
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [seriesData, setSeriesData] = useState<IChartSeriesPoint[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [transactionList, setTransactionList] = useState<ITransactionData[]>(
    [],
  );
  const [chartType, setChartType] = useState<ChartTypes>("column");

  const handleAddTransaction = async (transactionObj: ITransactionData) => {
    try {
      const token = await getToken();
      if (!token) return;
      const { transactionType } = transactionObj;

      if (transactionType == "income") {
        await addIncome(transactionObj, token);
      } else {
        await addExpense(transactionObj, token);
      }
      handleFetchUserTransaction();
      toast.success("Transaction added successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error while adding the transaction");
    }
  };
  const handleUpdateTransaction = async (transactionObj: ITransactionData) => {
    try {
      const token = await getToken();
      if (!token) return;
      const { transactionType } = transactionObj;

      if (transactionType == "income") {
        await updateIncome(transactionObj, token, transactionObj._id || "");
      } else {
        await updateExpense(transactionObj, token, transactionObj._id || "");
      }
      handleFetchUserTransaction();
      toast.success("Transaction updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error while updating the transaction");
    }
  };

  const handleFetchUserTransaction = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) return;

      const transactions = await fetchTransactions(token);
      setTransactionList(transactions);
      const { newSeriesData = [], newCategories = [] } =
        fetchTransactionsList(transactions);
      setCategories(newCategories);
      setSeriesData(newSeriesData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleDeleteTransaction = async (transaction: ITransactionData) => {
    try {
      const token = await getToken();
      if (!token) return;

      const { _id = "", transactionType } = transaction;

      if (transactionType === "income") {
        await deleteIncome(token, _id);
      } else {
        await deleteExpense(token, _id);
      }
      await handleFetchUserTransaction();
      toast.success("Transaction deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error while deleting transactions");
    }
  };

  const handleChartType = () => {
    if (chartType === "column") {
      setChartType("line");
    } else {
      setChartType("column");
    }
  };

  useEffect(() => {
    handleFetchUserTransaction();
  }, []);

  const options: Highcharts.Options = useMemo(() => {
    return getChartOptions(categories, seriesData, chartType);
  }, [categories, seriesData, chartType]);

  return (
    <div className="ml-8 mt-6 w-[75%] mr-8 ">
      <div className="flex w-full justify-between">
        <h1 className="text-xl font-medium">Transactions</h1>
        <TransactionModal
          onAddTransaction={handleAddTransaction}
          onUpdateTransaction={handleUpdateTransaction}
          showTransactionModal={showTransactionModal}
          setShowTransactionModal={setShowTransactionModal}
          transactionObj={transactionObj}
          isEditMode={isEditMode}
          setisEditMode={setIsEditMode}
          type="transaction"
          showTransactionType={true}
        />
      </div>
      {transactionList.length ? (
        <div className="border rounded-lg border-gray-300 mt-4 py-3 px-6 flex-1 ">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium text-lg">Transaction Overview</div>
              <div>
                Monitor your transactions over time and gain insights into your
                income and expenses.
              </div>
            </div>
            <Button className="cursor-pointer" onClick={handleChartType}>
              {chartType === "line" ? "Line" : "Coloumn"}
            </Button>
          </div>
          <div className="mt-8">
            <HighchartsReact highcharts={Highcharts} options={options} />
          </div>
        </div>
      ) : null}

      {transactionList.length ? (
        <div className="border border-gray-300 mt-4 px-3 py-6 rounded-3xl h-83 overflow-y-scroll no-scrollbar">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Icon</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Edit</TableHead>
                <TableHead>Delete</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {transactionList.map(
                (transaction: ITransactionData, index: number) => {
                  return (
                    <TableRow key={index}>
                      <TableCell className="text-2xl">
                        {transaction.emoji}
                      </TableCell>
                      <TableCell className="font-medium">
                        {transaction.title}
                      </TableCell>
                      <TableCell className="font-medium">
                        {transaction.transactionType}
                      </TableCell>
                      <TableCell className="font-medium">
                        {transaction.category}
                      </TableCell>
                      <TableCell className="font-medium">
                        {transaction.date
                          ? new Date(transaction.date).toLocaleDateString()
                          : ""}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center border rounded-md bg-green-100">
                          {transaction.transactionType === "income" ? (
                            <TrendingUp className="w-4 h-4 text-green-500 font-bold" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500 font-bold" />
                          )}
                          <span
                            className={`ml-2 ${transaction.transactionType === "income" ? "text-green-500" : "500"} font-bold`}
                          >
                            ${transaction.amount}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <SquarePen
                          className="w-5 h-5 text-gray-500 cursor-pointer"
                          onClick={() => {
                            (setIsEditMode(true),
                              setShowTransactionModal(true),
                              settransactionObj(transaction));
                          }}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <Trash2
                          className="w-5 h-5 cursor-pointer text-red-500"
                          onClick={() => handleDeleteTransaction(transaction)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                },
              )}
            </TableBody>
          </Table>
        </div>
      ) : loading ? (
        <div className="h-full flex items-center justify-center">
          <Spinner className="w-10 h-10" />
        </div>
      ) : (
        <div className="flex items-center justify-center text-gray-500 w-ful h-full font-medium">
          Click the &quo;Add Transactions&quo; Button to add transactions
        </div>
      )}
    </div>
  );
};

export default Transactions;
