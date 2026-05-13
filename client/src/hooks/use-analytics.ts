import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/api";

export const useDashboardData = () => {
  return useQuery({
    queryKey: ["dashboard-data"],
    queryFn: analyticsApi.getDashboardData,
  });
};
