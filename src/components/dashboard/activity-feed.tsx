import Link from "next/link";
import { ActivityLog } from "@/types";
import { formatDateTime } from "@/lib/utils";
import { PlusCircle, Edit3, Archive, RotateCcw, Trash2, ArrowUpDown, History } from "lucide-react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";

interface ActivityFeedProps {
  activities: ActivityLog[];
  className?: string;
}

export function ActivityFeed({ activities, className = "" }: ActivityFeedProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case "CREATE":
        return <PlusCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
      case "UPDATE":
        return <Edit3 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case "ARCHIVE":
        return <Archive className="w-3.5 h-3.5 text-slate-500" />;
      case "RESTORE":
        return <RotateCcw className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case "DELETE":
        return <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />;
      case "STOCK_ADJUSTMENT":
        return <ArrowUpDown className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />;
      default:
        return <History className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <LiquidGlassCard className={`p-6 flex flex-col h-full ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Recent Activity
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Audit trail of recent actions
          </p>
        </div>
        <Link
          href="/dashboard/activity"
          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto max-h-[340px]">
        {activities.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No recent activity logged.
          </div>
        ) : (
          activities.map((a) => (
            <div key={a.id} className="flex items-start gap-3">
              <div className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                {getActionIcon(a.action)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-snug">
                  {a.description}
                </p>
                <span className="text-[10px] text-slate-400 block mt-1">
                  {formatDateTime(a.created_at)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </LiquidGlassCard>
  );
}

