import { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { usePoll, useVote } from "@/hooks/use-polls";
import { socketClient } from "@/lib/socket";
import { Button } from "@/components/ui/button";
import { Loader2, Check, ChevronLeft } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { VotingOption } from "@/components/polls/voting-option";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/logo";

// Initialize voter ID early for API consistency
if (typeof window !== "undefined") {
  if (!localStorage.getItem("pl_voter_id")) {
    localStorage.setItem("pl_voter_id", crypto.randomUUID());
  }
}

export default function PublicPollPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session, isPending: isAuthPending } = authClient.useSession();
  const { data: response, isLoading: isPollLoading } = usePoll(id!);
  const { mutate: vote, isPending: isVoting, isSuccess } = useVote(id!);
  const queryClient = useQueryClient();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [hasVoted, setHasVoted] = useState(false);
  const [startTime] = useState<number>(Date.now());
  const [fingerprint, setFingerprint] = useState<string>("");

  useEffect(() => {
    // Generate a simple browser fingerprint
    const getFingerprint = () => {
      const { userAgent, language, platform } = navigator;
      const { width, height, colorDepth } = window.screen;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const voterId = localStorage.getItem("pl_voter_id");

      return btoa(`${userAgent}-${language}-${platform}-${width}x${height}-${colorDepth}-${timezone}-${voterId}`).slice(0, 64);
    };

    setFingerprint(getFingerprint());
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setHasVoted(true);
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
    return () => {
      socketClient.leavePoll(id);
      socket?.off("poll:updated");
    };
  }, [id, queryClient]);

  const poll = response?.data;
  const totalSteps = poll?.questions?.length || 0;
  const currentQuestion = poll?.questions?.[currentStep];

  const handleOptionSelect = (optionId: string) => {
    if (!currentQuestion) return;
    
    const newSelections = { ...selectedOptions, [currentQuestion._id]: optionId };
    setSelectedOptions(newSelections);

    if (currentStep < totalSteps - 1) {
      // Auto-advance after a small delay for visual feedback
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 400);
    }
  };

  const handleSkip = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleVote = async () => {
    if (!poll) return;

    // Get basic device info
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

    if (responses.length > 0) {
      vote({ responses, fingerprint, deviceInfo });
    }
  };

  const handleReset = () => {
    setSelectedOptions({});
    setCurrentStep(0);
    setHasVoted(false);
  };

  if (isAuthPending || isPollLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="mt-4 text-xs font-black text-muted-foreground uppercase tracking-widest animate-pulse">Initializing Pulse...</p>
      </div>
    );
  }

  if (!poll || !currentQuestion) {
    if (!isPollLoading && !poll) {
      return (
        <div className="container mx-auto py-20 text-center bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col items-center justify-center">
          <h2 className="text-2xl font-black tracking-tight">Poll not found</h2>
          <Button asChild variant="outline" className="mt-6 rounded-full font-bold">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      );
    }
    return null; // Should be covered by loader, but safety first
  }

  // Only redirect to sign-in if the poll specifically DISALLOWS anonymous voting
  if (!session && !poll.allowAnonymous) {
    return <Navigate to={`/sign-in?callbackUrl=/vote/${id}`} replace />;
  }

  const isLastStep = currentStep === totalSteps - 1;
  const hasAnsweredCurrent = !!selectedOptions[currentQuestion._id];
  const progress = ((currentStep + (hasAnsweredCurrent ? 1 : 0)) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-foreground relative overflow-hidden font-sans selection:bg-primary/20 flex flex-col">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.03),transparent_40%)] pointer-events-none" />
      
      {/* Fixed Progress Bar */}
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
            {!hasVoted ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                className="space-y-10"
              >
                {/* Header Info */}
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-4 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      Step {currentStep + 1} <span className="mx-1 opacity-40">/</span> {totalSteps}
                    </span>
                    {!currentQuestion.isMandatory && (
                      <div className="size-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                    )}
                    {!currentQuestion.isMandatory && (
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">Optional</span>
                    )}
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight px-4">
                    {currentQuestion.text}
                  </h1>
                </div>

                {/* Options List */}
                <div className="grid gap-4">
                  {currentQuestion.options.map((option: any) => (
                    <VotingOption
                      key={option._id}
                      id={option._id}
                      text={option.text}
                      isSelected={selectedOptions[currentQuestion._id] === option._id}
                      onSelect={handleOptionSelect}
                      disabled={isVoting}
                    />
                  ))}
                </div>

                {/* Footer Actions */}
                <div className="pt-6 flex flex-col items-center gap-8">
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
                        disabled={isVoting || !hasAnsweredCurrent}
                        onClick={handleVote}
                      >
                        {isVoting ? <Loader2 className="size-5 animate-spin" /> : "Submit Vote"}
                      </Button>
                    )}
                  </div>

                  {/* Real Logo Branding */}
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
                  
                  {/* Outer Ripples */}
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
                    Vote Recorded!
                  </h2>
                  <p className="text-base text-slate-500 dark:text-slate-400 font-medium">
                    Thank you for your participation.
                  </p>
                </div>

                <div className="flex flex-col gap-3 w-full max-w-xs pt-4">
                  {poll.resultsPublished && (
                    <Button asChild size="lg" className="h-14 rounded-2xl text-base font-black shadow-lg shadow-primary/10">
                      <Link to={`/polls/${poll._id}/results`}>View Live Results</Link>
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

