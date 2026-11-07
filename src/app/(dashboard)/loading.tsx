export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-4 w-96 bg-slate-100 dark:bg-slate-800/60 rounded-lg" />
      </div>

      {/* Top 6 KPI Bento Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="p-5 h-32 rounded-2xl bg-white dark:bg-[#181a20] border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700/60 rounded" />
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800" />
            </div>
            <div className="space-y-1.5">
              <div className="h-7 w-28 bg-slate-200 dark:bg-slate-700/60 rounded-lg" />
              <div className="h-3 w-36 bg-slate-100 dark:bg-slate-800 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* 2-Column Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-72 rounded-2xl bg-white dark:bg-[#181a20] border border-slate-200/60 dark:border-slate-800 p-6 space-y-4">
          <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700/60 rounded" />
          <div className="h-5 w-full bg-slate-100 dark:bg-slate-800 rounded-full" />
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="h-16 bg-slate-50 dark:bg-slate-800/40 rounded-xl" />
            <div className="h-16 bg-slate-50 dark:bg-slate-800/40 rounded-xl" />
          </div>
        </div>

        <div className="lg:col-span-1 h-72 rounded-2xl bg-white dark:bg-[#181a20] border border-slate-200/60 dark:border-slate-800 p-6 space-y-4">
          <div className="h-4 w-36 bg-slate-200 dark:bg-slate-700/60 rounded" />
          <div className="space-y-3 pt-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-50 dark:bg-slate-800/40 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

