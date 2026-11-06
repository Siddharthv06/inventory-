import { getCurrentUser } from "@/lib/actions/auth";
import { getDashboardData } from "@/lib/actions/dashboard";
import { AnalyticsCards } from "@/components/dashboard/analytics-cards";
import { InventoryOverviewCard } from "@/components/dashboard/inventory-overview-card";
import { LowStockAlertCard } from "@/components/dashboard/low-stock-alert-card";
import { RecentProductsTable } from "@/components/dashboard/recent-products-table";
import { ActivityFeed } from "@/components/dashboard/activity-feed";

export const metadata = {
  title: "Dashboard Overview | Innovexa",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const { stats, lowStockProducts, recentProducts, recentActivities } = await getDashboardData();

  // Dynamic greeting based on current local hour
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      {/* Header Greeting */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {greeting}, {user.full_name}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Here's what's happening with your product inventory.
        </p>
      </div>

      {/* Top 6 Analytics Cards */}
      <AnalyticsCards stats={stats} />

      {/* 2-Column: Inventory Distribution & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InventoryOverviewCard stats={stats} />
        </div>
        <div className="lg:col-span-1">
          <LowStockAlertCard products={lowStockProducts} />
        </div>
      </div>

      {/* 2-Column: Recent Products Table & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentProductsTable products={recentProducts} />
        </div>
        <div className="lg:col-span-1">
          <ActivityFeed activities={recentActivities} />
        </div>
      </div>
    </div>
  );
}
