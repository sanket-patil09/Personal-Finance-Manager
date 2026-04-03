"use client";
import {
  EXPENSE_IMAGE,
  INCOME_IMAGE,
  TOTAL_BALANCE_IMAGE,
  TOTAL_TRANSACTION_IMAGE,
  USER_IMAGE,
} from "@/utils/constants";
import { useAuth, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Card from "./Card";
import { useEffect, useMemo, useState } from "react";
import {
  getCategoryWiseValue,
  getDashboardValues,
  getMoneyFlowOptions,
  getMonthlyIncomeExpense,
  getPieChartOptions,
} from "@/utils/helpers";
import HighchartsReact from "highcharts-react-official";
import * as Highcharts from "highcharts";
import { fetchIncome } from "@/services/income.services";
import { fetchExpense } from "@/services/expense.services";
import { IPieData, ITransactionData } from "@/utils/types";
import { fetchTransactions } from "@/services/transaction.services";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import Progress from "./progress";

const Dashboard = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();
  const [dashboardValues, setDashboardValues] = useState({
    totalBalance: 0,
    incomeValue: 0,
    expenseValue: 0,
    totalTransaction: 0,
  });
  const [incomeSeries, setIncomeSeries] = useState<number[]>([]);
  const [expenseSeries, setExpenseSeries] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [categorySeries, setCategorySeries] = useState<IPieData[]>([]);
  const [transactions, setTransactions] = useState<ITransactionData[]>([]);

  const handleFetchDashboardValues = async () => {
    const token = await getToken();
    if (!token) return;
    const { totalBalance, incomeValue, expenseValue, totalTransaction } =
      await getDashboardValues(token);

    setDashboardValues(() => ({
      totalBalance,
      incomeValue,
      expenseValue,
      totalTransaction,
    }));
  };

  const handleMoneyFlowOptions = async () => {
    const token = await getToken();
    if (!token) return;

    const incomeList = await fetchIncome(token);
    const expenseList = await fetchExpense(token);
    const { incomeSeries, expenseSeries, categories } =
      await getMonthlyIncomeExpense(incomeList, expenseList);

    console.log("incomeSeries:", incomeSeries);
    console.log("expenseSeries:", expenseSeries);
    console.log("categories:", categories);

    setIncomeSeries(incomeSeries);
    setExpenseSeries(expenseSeries);
    setCategories(categories);
  };

  const handleCategorySeries = async () => {
    const token = await getToken();
    if (!token) return;

    const transactions = await fetchTransactions(token);
    const series = getCategoryWiseValue(transactions);
    setCategorySeries(series);
  };

  const handleAllClick = () => {
    router.push("/transactions");
  };

  const handleFetchTransactions = async () => {
    const token = await getToken();
    if (!token) return;

    const transactions = await fetchTransactions(token);
    setTransactions(transactions);
  };

  const handleMostSpending = () => {
    const map: Record<string, number> = {};
    let categoryExpense = 0;
    let topCategory = "";

    transactions.forEach((item) => {
      if (item.transactionType === "expense") {
        if (!map[item.category]) {
          map[item.category] = 0;
        }
        map[item.category] += Number(item.amount);
      }
    });

    for (const category in map) {
      if (map[category] > categoryExpense) {
        categoryExpense = map[category];
        topCategory = category;
      }
    }

    categoryExpense = dashboardValues.expenseValue
      ? (categoryExpense / dashboardValues.expenseValue) * 100
      : 0;

    return { topCategory, categoryExpense };
  };

  const handleSavingsRate = () => {
    const { incomeValue, expenseValue } = dashboardValues;
    if (incomeValue === 0) return 0;

    const rate = ((incomeValue - expenseValue) / incomeValue) * 100;
    return rate;
  };

  const handleIncomeSpend = () => {
    const { incomeValue, expenseValue } = dashboardValues;
    if (incomeValue === 0) return 0;

    const spend = (expenseValue / incomeValue) * 100;
    return spend;
  };

  useEffect(() => {
    handleFetchDashboardValues();
    handleMoneyFlowOptions();
    handleCategorySeries();
    handleFetchTransactions();
  }, []);

  const moneyFlowOptions = useMemo(() => {
    return getMoneyFlowOptions(categories, incomeSeries, expenseSeries);
  }, [categories, incomeSeries, expenseSeries]);

  const categoryOptions = useMemo(() => {
    return getPieChartOptions(categorySeries);
  }, [categorySeries]);

  return (
    <div className="mt-6 ml-8 mb-4 mr-8 w-[75%] overflow-y-scroll no-scrollbar">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-bold text-2xl">
            Welcome Back , {user?.fullName}
          </span>
          <span className="text-gray-500 text-sm mt-0.5">
            It is the best time to manage your Finances
          </span>
        </div>
        <div className="flex items-center justify-center border rounded-full border-gray-300 shadow gap-2 py-1.5 pr-4 pl-1.5">
          <Image
            src={user?.imageUrl || USER_IMAGE}
            alt="user-image"
            className="rounded-full"
            width={32}
            height={32}
          />
          <div className="flex flex-col">
            <span className="text-base font-bold">{user?.fullName}</span>
            <span className="text-xs text-gray-500">
              {user?.primaryEmailAddress?.emailAddress}
            </span>
          </div>
        </div>
      </div>

      <div className="flex mt-8 justify-between">
        <Card
          title="Balance"
          imgSrc={TOTAL_BALANCE_IMAGE}
          value={dashboardValues.totalBalance}
        />
        <Card
          title="Income"
          imgSrc={INCOME_IMAGE}
          value={dashboardValues.incomeValue}
        />
        <Card
          title="Expense"
          imgSrc={EXPENSE_IMAGE}
          value={dashboardValues.expenseValue}
        />
        <Card
          title="Total Transactions"
          imgSrc={TOTAL_TRANSACTION_IMAGE}
          value={dashboardValues.totalTransaction}
        />
      </div>

      <div className="flex itmes-center justify-between gap-4 mt-8">
        <div className="border border-gray-300 rounded-3xl flex-2 pb-2 pt-6 px-4 flex flex-col relative">
          <span className="font-medium text-xl absolute top-6.5">
            Money Flow
          </span>
          <div className="">
            <HighchartsReact
              highcharts={Highcharts}
              options={moneyFlowOptions}
            />
          </div>
        </div>

        <div className="border border-gray-300 rounded-3xl flex-1 pb-2 pt-6 px-4 flex-col relative">
          <span className="font-medium text-2xl absolute top-6.5">
            Catergory Breakdown
          </span>
          <div className="pb-4">
            <HighchartsReact
              highcharts={Highcharts}
              options={categoryOptions}
            />
          </div>
        </div>
      </div>

      <div className="flex items-start gap-4 justify-between mt-8">
        <div className="border border-gray-300 rounded-3xl flex-2 pb-5 pt-6 px-4 ">
          <div className="flex justify-between items-center">
            <span className="font-medium text-xl">Recent Transactions</span>
            <span
              className="flex font-medium items-center text-sm gap-1 border rounded-full border-gray-300 py-1.5 px-3 cursor-pointer"
              onClick={handleAllClick}
            >
              See all <ChevronRight className="w-4 h-4" />
            </span>
          </div>

          <Table className="mt-4 h-[10.6rem]">
            <TableHeader className="bg-titan-white text-white rounded-full">
              <TableRow>
                <TableHead className="rounded-l-full text-cornflower-blue uppercase pl-4">
                  icon
                </TableHead>
                <TableHead className="text-cornflower-blue uppercase">
                  Date
                </TableHead>
                <TableHead className="text-cornflower-blue uppercase">
                  Amount
                </TableHead>
                <TableHead className="text-cornflower-blue uppercase">
                  Title
                </TableHead>
                <TableHead className="text-cornflower-blue uppercase">
                  Type
                </TableHead>
                <TableHead className="text-cornflower-blue uppercase rounded-r-full">
                  Category
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {transactions
                .slice(0, 3)
                .reverse()
                .map((item: ITransactionData) => {
                  return (
                    <TableRow key={item._id}>
                      <TableCell className="text-xl">{item.emoji}</TableCell>
                      <TableCell className="font-medium">
                        {item.date
                          ? new Date(item.date).toLocaleDateString()
                          : ""}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.amount}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.title}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.transactionType}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.category}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>

        <div className="border border-gray-300 rounded-3xl flex-1 pb-2 pt-6 px-4 flex-col relative">
          <span className="font-medium text-xl">Financial Summary</span>
          <div>
            <Progress
              title={handleMostSpending().topCategory}
              percentage={handleMostSpending().categoryExpense}
            />
            <Progress title="Savings Rate" percentage={handleSavingsRate()} />
            <Progress title="Income Spend" percentage={handleIncomeSpend()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
