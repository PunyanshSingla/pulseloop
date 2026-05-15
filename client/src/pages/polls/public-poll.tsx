import { useEffect, useState, useMemo } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { usePoll, useVote } from "@/hooks/use-polls";
import { socketClient } from "@/lib/socket";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, Clock, Lock, AlertTriangle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { VotingOption } from "@/components/polls/voting-option";
import confetti from "canvas-confetti";
import { pollsApi } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/logo";
import { toast } from "sonner";
import { Loader, LoaderContainer } from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import type { VotePayload } from "@/types/polls";

export default function PublicPollPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session, isPending: isAuthPending } = authClient.useSession();
  const { data: response, isLoading: isPollLoading, error: pollError } = usePoll(id!);
  const { mutate: vote, isPending: isVoting, isSuccess } = useVote(id!);
  const queryClient = useQueryClient();
  
  const [currentStep, setCurrentStep] = useState(0);
  const poll = response?.data;
  const totalSteps = poll?.questions?.length || 0;
  const currentQuestion = poll?.questions?.[currentStep];

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [startTime] = useState<number>(() => Date.now());
  const [fingerprint] = useState<string>(() => {
    const { userAgent, language, platform } = navigator;
    const { width, height, colorDepth } = window.screen;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const voterId = localStorage.getItem("pl_voter_id");
    return btoa(`${userAgent}-${language}-${platform}-${width}x${height}-${colorDepth}-${timezone}-${voterId}`).slice(0, 64);
  });
  const [timeLeftToStart, setTimeLeftToStart] = useState<{ d: number, h: number, m: number, s: number } | null>(null);
  const [voteAsAnonymous, setVoteAsAnonymous] = useState(false);

  // Success state derived from mutation or server data
  const hasVoted = useMemo(() => isSuccess || !!poll?.userHasVoted, [isSuccess, poll?.userHasVoted]);

  useEffect(() => {
    if (!poll?.startsAt) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(poll.startsAt || "").getTime();
      const diff = start - now;

      if (diff > 0) {
        setTimeLeftToStart({
          d: Math.floor(diff / (1000 * 60 * 60 * 24)),
          h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((diff % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeftToStart(null);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [poll?.startsAt]);

  useEffect(() => {
    if (id && fingerprint) {
      pollsApi.trackView(id, { fingerprint }).catch(err => {
        console.error("Failed to track view:", err);
      });
    }
  }, [id, fingerprint]);

  useEffect(() => {
    if (isSuccess) {
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.5 },
        colors: ["#6366f1", "#a855f7", "#22c55e"]
      });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (!id) return;
    const socket = socketClient.connect();
    socketClient.joinPoll(id);
    socket?.on("poll:updated", (updatedPoll) => {
      queryClient.setQueryData(["poll", id], { success: true, data: updatedPoll });
    });

    socket?.on("poll:published", (updatedPoll) => {
      queryClient.setQueryData(["poll", id], { success: true, data: updatedPoll });
      toast.info("Results have been published!");
    });

    return () => {
      socketClient.leavePoll(id);
      socket?.off("poll:updated");
      socket?.off("poll:published");
    };
  }, [id, queryClient]);

  const handleOptionSelect = (optionId: string) => {
    if (!currentQuestion) return;
    
    const newSelections = { ...selectedOptions, [currentQuestion._id!]: optionId };
    setSelectedOptions(newSelections);

    if (currentStep < totalSteps - 1) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 400);
    }
  };

  const handleSkip = () => {
    if (!currentQuestion) return;
    if (currentQuestion.isMandatory) return;

    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleVote();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleVote = async () => {
    if (!poll) return;

    const getDeviceInfo = () => {
      const ua = navigator.userAgent;
      let browser = "Unknown";
      let os = "Unknown";
      let device = "Desktop";

      if (ua.includes("Firefox")) browser = "Firefox";
      else if (ua.includes("Chrome")) browser = "Chrome";
      else if (ua.includes("Safari")) browser = "Safari";
      else if (ua.includes("Edge")) browser = "Edge";

      if (ua.includes("Windows")) os = "Windows";
      else if (ua.includes("Mac OS")) os = "macOS";
      else if (ua.includes("Linux")) os = "Linux";
      else if (ua.includes("Android")) os = "Android";
      else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

      if (/Mobile|Android|iPhone|iPad/i.test(ua)) device = "Mobile";

      const screenResolution = `${window.screen.width}x${window.screen.height}`;
      const language = navigator.language;

      return { 
        browser, 
        os, 
        device, 
        userAgent: ua, 
        screenResolution, 
        language 
      };
    };

    const deviceInfo = getDeviceInfo();

    const responses = Object.entries(selectedOptions).map(([questionId, optionId]) => ({
      questionId,
      selectedOptionId: optionId,
      timeTaken: Math.round((Date.now() - startTime) / 1000 / totalSteps),
    }));

    const unansweredMandatoryQuestions = poll.questions.filter((q) => 
      q.isMandatory && !selectedOptions[q._id!]
    );

    if (unansweredMandatoryQuestions.length > 0) {
      const firstUnansweredIdx = poll.questions.findIndex((q) => q._id === unansweredMandatoryQuestions[0]._id!);
      setCurrentStep(firstUnansweredIdx);
      return;
    }

    vote({ responses, fingerprint, deviceInfo, voteAsAnonymous } as VotePayload);
  };

  const handleReset = () => {
    setSelectedOptions({});
    setCurrentStep(0);
    // Note: poll.hasVoted will still be true from the server
    // If multiple submissions are allowed, the UI will still show the form
    // based on logic in the render block.
  };

  if (isAuthPending || isPollLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <LoaderContainer message="Initializing Pulse..." />
      </div>
    );
  }

  if (pollError || !poll) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-4">
            <div className="relative mx-auto size-24 mb-6">
              <div className="absolute inset-0 bg-rose-500/10 rounded-full blur-2xl animate-pulse" />
              <div className="relative size-24 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center border border-rose-500/20">
                <AlertTriangle className="size-12" />
              </div>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Poll <span className="text-rose-500">Not Found</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              The poll you are looking for doesn't exist, has been deleted, or the link is incorrect.
            </p>
          </div>

          <div className="pt-8 flex flex-col gap-4">
            <Button asChild size="lg" className="h-14 rounded-2xl text-base font-black shadow-lg">
              <Link to="/">Back to Home</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 rounded-2xl font-bold">
              <Link to="/explore">Explore Other Polls</Link>
            </Button>
          </div>

          <div className="pt-8 flex justify-center">
            <Logo className="scale-75 opacity-50" />
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-md space-y-4">
          <LoaderContainer message="Loading poll questions..." />
        </div>
      </div>
    );
  }

  const now = new Date();
  const startsAt = poll.startsAt ? new Date(poll.startsAt) : null;
  const expiresAt = poll.expiresAt ? new Date(poll.expiresAt) : null;
  
  const isPending = startsAt && now < startsAt;
  const isExpired = expiresAt && now > expiresAt;

  if (isPending) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
              <Clock className="size-3" />
              Not Started Yet
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              This poll is <span className="text-amber-500">Scheduled</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              The organizer has scheduled this poll to start soon. Come back when the timer hits zero!
            </p>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Days", value: timeLeftToStart?.d || 0 },
              { label: "Hours", value: timeLeftToStart?.h || 0 },
              { label: "Mins", value: timeLeftToStart?.m || 0 },
              { label: "Secs", value: timeLeftToStart?.s || 0 },
            ].map((t) => (
              <div key={t.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                <div className="text-2xl font-black text-slate-900 dark:text-white">{t.value.toString().padStart(2, '0')}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t.label}</div>
              </div>
            ))}
          </div>

          <div className="pt-8 flex justify-center">
            <Logo className="scale-75 opacity-50" />
          </div>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest border border-rose-500/20">
              <Lock className="size-3" />
              Poll Expired
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Poll has <span className="text-rose-500">Ended</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              This poll has reached its expiry date and is no longer accepting responses.
            </p>
          </div>

          <div className="pt-8 flex flex-col gap-4">
            {poll.resultsPublished && (
              <Button asChild size="lg" className="h-14 rounded-2xl text-base font-black shadow-lg">
                <Link to={`/vote/${poll._id}/results`}>View Final Results</Link>
              </Button>
            )}
            <Button asChild variant="outline" size="lg" className="h-14 rounded-2xl font-bold">
              <Link to="/explore">Explore other polls</Link>
            </Button>
          </div>

          <div className="pt-8 flex justify-center">
            <Logo className="scale-75 opacity-50" />
          </div>
        </div>
      </div>
    );
  }

  if (poll.resultsPublished) {
    return <Navigate to={`/vote/${id}/results`} replace />;
  }

  if (!session && !poll.allowAnonymous) {
    return <Navigate to={`/sign-in?callbackUrl=/vote/${id}`} replace />;
  }

  const isLastStep = currentStep === totalSteps - 1;
  const hasAnsweredCurrent = !!selectedOptions[currentQuestion._id!];
  const progress = ((currentStep + (hasAnsweredCurrent ? 1 : 0)) / totalSteps) * 100;

  // Final condition to show success screen:
  // If user has voted AND multiple submissions are NOT allowed.
  const showSuccess = hasVoted && !poll.allowMultipleSubmissions;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground relative overflow-hidden font-sans selection:bg-primary/20 flex flex-col">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.03),transparent_40%)] pointer-events-none" />
      
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 z-50">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] transition-all duration-500"
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative p-6">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            {!showSuccess ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="space-y-10"
              >
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-4 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      Step {currentStep + 1} <span className="mx-1 opacity-40">/</span> {totalSteps}
                    </span>
                    {currentQuestion.isMandatory ? (
                      <>
                        <div className="size-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Mandatory</span>
                      </>
                    ) : (
                      <>
                        <div className="size-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500/70">Optional</span>
                      </>
                    )}
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight px-4">
                    {currentQuestion.text}
                  </h1>
                </div>

                <div className="grid gap-4">
                  {currentQuestion.options.map((option) => (
                    <VotingOption
                      key={option._id!}
                      id={option._id!}
                      text={option.text}
                      isSelected={selectedOptions[currentQuestion._id!] === option._id}
                      onSelect={handleOptionSelect}
                      disabled={isVoting}
                    />
                  ))}
                </div>

                <div className="pt-6 flex flex-col items-center gap-8">
                  {session && poll.allowAnonymous && isLastStep && (
                    <div 
                      onClick={() => setVoteAsAnonymous(!voteAsAnonymous)}
                      className="flex items-center gap-3 cursor-pointer p-3 px-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all shadow-sm"
                    >
                      <div className={cn("size-5 rounded-md flex items-center justify-center border-2 transition-colors", voteAsAnonymous ? "bg-primary border-primary" : "border-slate-300 dark:border-slate-600")}>
                        {voteAsAnonymous && <Check className="size-3.5 text-white" strokeWidth={4} />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">Vote Anonymously</span>
                        <span className="text-xs font-medium text-slate-500">Hide your identity for this vote</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 w-full">
                    {currentStep > 0 && (
                      <Button 
                        variant="outline" 
                        size="lg"
                        onClick={handleBack}
                        className="h-16 px-6 rounded-2xl border-2 font-bold text-slate-600 dark:text-slate-300"
                      >
                        <ChevronLeft className="size-5 mr-1" />
                        Back
                      </Button>
                    )}
                    
                    {!currentQuestion.isMandatory && !hasAnsweredCurrent && (
                      <Button 
                        variant="ghost" 
                        onClick={handleSkip}
                        className={`h-16 px-8 rounded-2xl font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 ${!isLastStep && "flex-1"}`}
                      >
                        Skip
                      </Button>
                    )}
                    
                    {isLastStep && (
                      <Button 
                        className="flex-1 h-16 text-lg font-black rounded-2xl shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-300 bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-black dark:hover:bg-slate-100 disabled:opacity-50"
                        size="lg"
                        disabled={isVoting || (currentQuestion.isMandatory && !hasAnsweredCurrent)}
                        onClick={handleVote}
                      >
                        {isVoting ? <Loader size={20} /> : (hasAnsweredCurrent ? "Submit Vote" : "Skip & Submit")}
                      </Button>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-3 mt-4">
                    <Logo className="scale-75 opacity-50 hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success-screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="relative mb-4">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.2, 0.5]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl"
                  />
                  <div className="relative size-24 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center z-10 border border-emerald-500/20">
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                      <Check className="size-12" strokeWidth={4} />
                    </motion.div>
                  </div>
                  
                  {[1, 2].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.6,
                        ease: "easeOut"
                      }}
                      className="absolute inset-0 border-2 border-emerald-500/20 rounded-3xl"
                    />
                  ))}
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    {isSuccess ? "Vote Recorded!" : "Already Voted"}
                  </h2>
                  <p className="text-base text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto">
                    {isSuccess 
                      ? "Thank you for your participation." 
                      : (poll.resultsPublished ? "You have already participated in this poll. Check out the results below." : "You have already participated in this poll. The results have not been published yet.")}
                  </p>
                </div>

                <div className="flex flex-col gap-3 w-full max-w-xs pt-4">
                  {poll.resultsPublished && (
                    <Button asChild size="lg" className="h-14 rounded-2xl text-base font-black shadow-lg shadow-primary/10">
                      <Link to={`/vote/${poll._id}/results`}>View Live Results</Link>
                    </Button>
                  )}
                  
                  {poll.allowMultipleSubmissions && (
                     <Button onClick={handleReset} variant="outline" size="lg" className="h-14 rounded-2xl text-base font-bold border-2">
                      Submit Another Response
                    </Button>
                  )}
                </div>
                
                <div className="flex flex-col items-center gap-3 mt-12">
                  <Logo className="scale-75 opacity-70 hover:opacity-100 dark:opacity-50 transition-opacity" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
