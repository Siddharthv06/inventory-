import { getReportsData } from "@/lib/actions/dashboard";
import { ReportsView } from "@/components/reports/reports-view";

export const metadata = {
  title: "Reports & Analytics | Innovexa",
};

export default async function ReportsPage() {
  const data = await getReportsData();

  return <ReportsView data={data} />;
}

