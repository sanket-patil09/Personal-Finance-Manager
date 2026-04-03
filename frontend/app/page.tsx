import Dashboard from "@/components/dashboard";
import { withAuth } from "@/hoc/withAuth";

const DashboardPage = () => {
  return <Dashboard />;
};

export default withAuth(DashboardPage);
