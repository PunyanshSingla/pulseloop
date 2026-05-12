import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pollsApi } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const usePolls = () => {
  return useQuery({
    queryKey: ["polls"],
    queryFn: pollsApi.getAll,
  });
};

export const usePoll = (id: string) => {
  return useQuery({
    queryKey: ["poll", id],
    queryFn: () => pollsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreatePoll = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: pollsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
      toast.success("Poll created successfully!");
      navigate("/");
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
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ questionId, optionId }: { questionId: string; optionId: string }) => 
      pollsApi.vote(pollId, questionId, optionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["poll", pollId] });
      toast.success("Vote cast successfully!");
      navigate(`/polls/${pollId}/results`);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to cast vote");
    },
  });
};
