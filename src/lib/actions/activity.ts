"use server";

import { createClient } from "@/lib/supabase/server";
import { ActivityLog } from "@/types";
import { INITIAL_ACTIVITIES } from "@/lib/seed-data";

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url && !url.includes("placeholder") && !url.includes("innovexa-demo"));
}

export async function getActivityLogs(options?: {
  action?: string;
  limit?: number;
}): Promise<ActivityLog[]> {
  const { action = "ALL", limit = 50 } = options || {};

  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        let query = supabase
          .from("activity_logs")
          .select("*, products(product_name)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(limit);

        if (action && action !== "ALL") {
          query = query.eq("action", action);
        }

        const { data, error } = await query;
        if (!error && data) {
          return data.map((item: any) => ({
            id: item.id,
            user_id: item.user_id,
            product_id: item.product_id,
            action: item.action,
            description: item.description,
            metadata: item.metadata,
            created_at: item.created_at,
            product_name: item.products?.product_name,
          }));
        }
      }
    }
  } catch (err) {
    console.warn("Supabase getActivityLogs fallback:", err);
  }

  let filtered = [...INITIAL_ACTIVITIES];
  if (action && action !== "ALL") {
    filtered = filtered.filter((a) => a.action === action);
  }

  return filtered.slice(0, limit);
}
