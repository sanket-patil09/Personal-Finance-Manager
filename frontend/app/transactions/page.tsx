import Transactions from "@/components/Transaction";
import { withAuth } from "@/hoc/withAuth";

const TransactionPage = () => {
  return <Transactions />;
};

export default withAuth(TransactionPage);
