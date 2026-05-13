import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/api";

export const useDashboardData = (days: number = 30) => {
  return useQuery({
    queryKey: ["dashboard-data", days],
    queryFn: () => analyticsApi.getDashboardData(days),
  });
};
