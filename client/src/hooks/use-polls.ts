import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pollsApi } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { Poll, PollResponse, PollsResponse, AnalyticsResponse, VotePayload } from "@/types/polls";
import { useEffect } from "react";
import { socketClient } from "@/lib/socket";

export const usePolls = (page: number = 1, limit: number = 10) => {
  return useQuery<PollsResponse>({
    queryKey: ["polls", page, limit],
    queryFn: () => pollsApi.getAll(limit, (page - 1) * limit),
  });
};

export const usePublicPolls = () => {
  return useQuery<PollsResponse>({
    queryKey: ["public-polls"],
    queryFn: pollsApi.getPublic,
  });
};

export const useVotedPolls = () => {
  return useQuery<PollsResponse>({
    queryKey: ["voted-polls"],
    queryFn: pollsApi.getVoted,
  });
};

export const usePoll = (id: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!id) return;

    const socket = socketClient.connect();
    socketClient.joinPoll(id);

    const handleUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["poll", id] });
    };

    socket?.on("poll:updated", handleUpdate);
    socket?.on("vote:cast", handleUpdate);

    return () => {
      socket?.off("poll:updated", handleUpdate);
      socket?.off("vote:cast", handleUpdate);
      socketClient.leavePoll(id);
    };
  }, [id, queryClient]);

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
    onError: (error: Error) => {
      let message = error.message || "Failed to create poll";
      
      // Handle Zod error arrays if they come back as JSON
      try {
        const parsed = JSON.parse(message);
        if (Array.isArray(parsed) && parsed[0]?.message) {
          message = parsed.map((err: { message: string }) => err.message).join(", ");
        }
      } catch {
        // Not JSON, keep original message
      }

      toast.error(message);
    },
  });
};

export const useUpdatePoll = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Poll>) => pollsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
      queryClient.invalidateQueries({ queryKey: ["poll", id] });
      toast.success("Poll updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update poll");
    },
  });
};

export const useUpdatePollAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Poll> }) => pollsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
      queryClient.invalidateQueries({ queryKey: ["poll", variables.id] });
      toast.success("Poll updated successfully!");
    },
    onError: (error: Error) => {
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
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete poll");
    },
  });
};

export const useVote = (pollId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VotePayload) => pollsApi.vote(pollId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["poll", pollId] });
      toast.success("Vote recorded!");
    },
    onError: (error: Error) => {
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
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!id) return;

    const socket = socketClient.connect();
    socketClient.joinPoll(id);

    const handleUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ["poll-analytics", id] });
    };

    socket?.on("vote:cast", handleUpdate);

    return () => {
      socket?.off("vote:cast", handleUpdate);
      // We don't call leavePoll here as usePoll might be using it too
      // but joinPoll is idempotent in this client implementation
    };
  }, [id, queryClient]);

  return useQuery<AnalyticsResponse>({
    queryKey: ["poll-analytics", id],
    queryFn: () => pollsApi.getAnalytics(id),
    enabled: !!id,
  });
};

export const usePublishResults = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => pollsApi.publishResults(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["poll", id] });
      queryClient.invalidateQueries({ queryKey: ["poll-analytics", id] });
      toast.success("Results published successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to publish results");
    },
  });
};
