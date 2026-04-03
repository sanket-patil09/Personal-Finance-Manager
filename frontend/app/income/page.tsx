import Income from "@/components/Income";
import { withAuth } from "@/hoc/withAuth";

const IncomePage = () => {
  return <Income />;
};

export default withAuth(IncomePage);
