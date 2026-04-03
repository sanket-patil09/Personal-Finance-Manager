import { APP_API_URL } from "@/utils/constants";
import axios from "axios";

const fetchTransactions = async (token: String) => {
  try {
    const response = await axios.get(`${APP_API_URL}/get-all-transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response?.data?.transactions;
  } catch (error) {
    throw error;
  }
};

export { fetchTransactions };
