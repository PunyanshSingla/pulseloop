import { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { usePoll, useVote } from "@/hooks/use-polls";
import { socketClient } from "@/lib/socket";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { VotingOption } from "@/components/polls/voting-option";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

export default function PublicPollPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session, isPending: isAuthPending } = authClient.useSession();
  const { data: response, isLoading: isPollLoading } = usePoll(id!);
  const { mutate: vote, isPending: isVoting } = useVote(id!);
  const queryClient = useQueryClient();
  
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Initialize socket connection
    const socket = socketClient.connect();
    
    // Join the poll room
    socketClient.joinPoll(id);

    // Listen for real-time updates
    socket?.on("poll:updated", (updatedPoll) => {
      queryClient.setQueryData(["poll", id], { success: true, data: updatedPoll });
    });

    socket?.on("vote:cast", (data) => {
      toast(`${data.userName} just voted!`, {
        description: "The results have been updated live.",
      });
    });

    return () => {
      socketClient.leavePoll(id);
      socket?.off("poll:updated");
      socket?.off("vote:cast");
    };
  }, [id, queryClient]);

  const handleVote = async () => {
    const poll = response?.data;
    if (!poll) return;

    const questionId = poll.questions[0]?._id;
    const optionId = selectedOptions[questionId];

    if (questionId && optionId) {
      vote({ questionId, optionId }, {
        onSuccess: () => {
          setHasVoted(true);
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#6366f1", "#a855f7", "#22c55e"]
          });
        }
      });
    }
  };

  if (isAuthPending || isPollLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading real-time experience...</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to={`/sign-in?callbackUrl=/vote/${id}`} replace />;
  }

  const poll = response?.data;

  if (!poll) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold">Poll not found</h2>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  const question = poll.questions[0]; // Simplification for MVP

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 selection:bg-primary/20">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" size="sm" className="hover:bg-primary/10">
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Real-time
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-none shadow-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl ring-1 ring-black/5 overflow-hidden">
            <div className="h-2 w-full bg-gradient-to-r from-primary via-purple-500 to-primary animate-gradient-x" />
            <CardHeader className="text-center pb-8 pt-10">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <CardTitle className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent mb-4">
                  {poll.title}
                </CardTitle>
                <CardDescription className="text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                  {poll.description}
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="px-8 pb-10">
              <AnimatePresence mode="wait">
                {!hasVoted ? (
                  <motion.div
                    key="voting"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-6">
                        {question?.text}
                      </h3>
                      <div className="grid gap-4">
                        {question?.options.map((option: any) => (
                          <VotingOption
                            key={option._id}
                            id={option._id}
                            text={option.text}
                            isSelected={selectedOptions[question._id] === option._id}
                            onSelect={(val) => setSelectedOptions({ [question._id]: val })}
                            disabled={isVoting}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full py-7 text-lg font-bold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
                      size="lg"
                      disabled={isVoting || !selectedOptions[question?._id]}
                      onClick={handleVote}
                    >
                      {isVoting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Cast Your Vote"
                      )}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center space-y-6"
                  >
                    <div className="size-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-green-500/5">
                      <Check className="size-10" strokeWidth={3} />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                      Vote Recorded!
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">
                      Thank you for participating. Your voice has been heard in real-time.
                    </p>
                    <Button asChild variant="outline" className="mt-8 rounded-xl px-8">
                      <Link to={`/polls/${poll._id}/results`}>View Live Results</Link>
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
