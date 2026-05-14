import { useQuery, useQueryClient } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/api";
import { useEffect } from "react";
import { socketClient } from "@/lib/socket";
import { authClient } from "@/lib/auth-client";

export const useDashboardData = (days: number = 30) => {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) return;

    const socket = socketClient.connect();
    socketClient.joinDashboard(userId);

    const handleUpdate = (data: any) => {
      console.log("🚀 Real-time update received:", data);
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
    };

    socket?.on("analytics:update", handleUpdate);

    return () => {
      socket?.off("analytics:update", handleUpdate);
      socketClient.leaveDashboard(userId);
    };
  }, [userId, queryClient]);

  return useQuery({
    queryKey: ["dashboard-data", days],
    queryFn: () => analyticsApi.getDashboardData(days),
  });
};
