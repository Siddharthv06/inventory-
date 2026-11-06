import { getActivityLogs } from "@/lib/actions/activity";
import { ActivityView } from "@/components/activity/activity-view";

export const metadata = {
  title: "Activity History | Innovexa",
};

export default async function ActivityPage() {
  const activities = await getActivityLogs({ limit: 100 });

  return <ActivityView initialActivities={activities} />;
}

