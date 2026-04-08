import { APP_API_URL } from "@/utils/constants";
import { ITransactionData } from "@/utils/types";
import axios from "axios";

const addExpense = async (payload: ITransactionData, token: String) => {
  try {
    await axios.post(`${APP_API_URL}/add-expense`, payload, {
      headers: {
        Authorization: `Bearer ${token}`, // token will fetch the user details from the backend and add the income to the correct user from the middleware
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    throw error;
  }
};

const fetchExpense = async (token: String) => {
  try {
    const response = await axios.get(`${APP_API_URL}/get-expense`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("API RESPONSE:", response.data);
    return response?.data?.Expense;
  } catch (error) {
    throw error;
  }
};

const updateExpense = async (
  payload: ITransactionData,
  token: string,
  id: string,
) => {
  try {
    await axios.post(`${APP_API_URL}/update-expense/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    throw error;
  }
};

const deleteExpense = async (token: string, id: string) => {
  try {
    await axios.delete(`${APP_API_URL}/delete-expense/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    throw error;
  }
};

export { addExpense, fetchExpense, updateExpense, deleteExpense };
