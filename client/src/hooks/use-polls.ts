import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pollsApi } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { Poll, PollResponse, PollsResponse } from "@/types/polls";

export const usePolls = () => {
  return useQuery<PollsResponse>({
    queryKey: ["polls"],
    queryFn: pollsApi.getAll,
  });
};

export const usePoll = (id: string) => {
  return useQuery<PollResponse>({
    queryKey: ["poll", id],
    queryFn: () => pollsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreatePoll = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: Partial<Poll>) => pollsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
      toast.success("Poll created successfully!");
      navigate("/polls");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create poll");
    },
  });
};

export const useUpdatePoll = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => pollsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
      queryClient.invalidateQueries({ queryKey: ["poll", id] });
      toast.success("Poll updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update poll");
    },
  });
};

export const useDeletePoll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: pollsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
      toast.success("Poll deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete poll");
    },
  });
};

export const useVote = (pollId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => pollsApi.vote(pollId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["poll", pollId] });
      toast.success("Vote recorded!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to record vote");
    },
  });
};
export const usePollResponses = (id: string) => {
  return useQuery({
    queryKey: ["poll-responses", id],
    queryFn: () => pollsApi.getResponses(id),
    enabled: !!id,
  });
};

export const usePollAnalytics = (id: string) => {
  return useQuery<{
    devices: { name: string; value: number }[];
    browsers: { name: string; value: number }[];
    os: { name: string; value: number }[];
    countries: { name: string; value: number }[];
  }>({
    queryKey: ["poll-analytics", id],
    queryFn: () => pollsApi.getAnalytics(id),
    enabled: !!id,
  });
};
