import { useParams, Link } from "react-router-dom";
import { usePoll, useVote } from "@/hooks/use-polls";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  BarChart2, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader, LoaderContainer } from "@/components/ui/loader";
import type { VotePayload } from "@/types/polls";

export default function ViewPollPage() {
  const { id } = useParams<{ id: string }>();
  const { data: response, isLoading } = usePoll(id!);
  const { mutate: vote, isPending, isSuccess } = useVote(id!);
  
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [startTime] = useState<number>(() => Date.now());
  const [resetKey, setResetKey] = useState(0);

  const isVoted = useMemo(() => isSuccess || !!response?.data?.userHasVoted, [isSuccess, response?.data?.userHasVoted]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <LoaderContainer message="Loading Poll Experience..." />
      </div>
    );
  }

  const poll = response?.data;

  if (!poll) {
    return (
      <div className="container mx-auto py-20 text-center bg-background min-h-screen flex flex-col items-center justify-center">
        <div className="size-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
          <BarChart2 className="size-10" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight">Poll not found</h2>
        <p className="text-muted-foreground mt-2 mb-8">The poll you're looking for might have been deleted or moved.</p>
        <Button asChild variant="outline" className="h-12 px-8 rounded-full font-bold">
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    let browser = "Unknown";
    let os = "Unknown";
    let device = "Desktop";

    if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
    else if (ua.includes("Edge")) browser = "Edge";

    if (ua.includes("Win")) os = "Windows";
    else if (ua.includes("Mac")) os = "MacOS";
    else if (ua.includes("Linux")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) device = "Tablet";
    else if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/.test(ua)) device = "Mobile";

    return {
      browser,
      os,
      device,
      userAgent: ua,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language
    };
  };

  const handleVote = () => {
    if (!poll) return;

    let voterId = localStorage.getItem("voterId");
    if (!voterId) {
      voterId = `voter_${Math.random().toString(36).substring(7)}`;
      localStorage.setItem("voterId", voterId);
    }

    const fingerprint = `fp_${Math.random().toString(36).substring(7)}`; 

    const responses = Object.entries(selectedOptions).map(([questionId, optionId]) => ({
      questionId,
      selectedOptionId: optionId,
      timeTaken: Math.round((Date.now() - startTime) / 1000 / poll.questions.length),
    }));

    if (responses.length > 0) {
      vote({ 
        responses,
        voterId,
        fingerprint,
        deviceInfo: getDeviceInfo()
      } as VotePayload);
    }
  };

  const handleReset = () => {
    setSelectedOptions({});
    setResetKey(prev => prev + 1);
  };

  const showForm = !isVoted || (poll.allowMultipleSubmissions && resetKey > 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-foreground relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute top-[-100px] right-[-100px] size-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-100px] size-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative mx-auto py-12 px-4 max-w-2xl">
        <div className="flex items-center justify-between mb-10">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group">
            <div className="size-8 rounded-full border border-border flex items-center justify-center bg-background group-hover:bg-muted transition-colors">
              <ArrowLeft className="size-4" />
            </div>
            Dashboard
          </Link>
          <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-600 ring-1 ring-emerald-600/20 shadow-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
            </span>
            Real-time
          </div>
        </div>

        <AnimatePresence mode="wait">
          {showForm ? (
            <motion.div
              key="poll-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-white shadow-2xl shadow-primary/5 p-8 sm:p-12 text-center">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mx-auto size-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6"
                >
                  <Sparkles className="size-7 text-primary" />
                </motion.div>
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-4">{poll.title}</h1>
                <p className="text-lg text-slate-500 font-medium max-w-lg mx-auto">{poll.description || "Share your thoughts and make your voice heard."}</p>
                
                <div className="mt-8 flex items-center justify-center gap-6 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-emerald-500" />
                    Anonymous
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-primary" />
                    One vote only
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {poll.questions.map((q, qIdx) => (
                  <motion.div 
                    key={q._id} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + qIdx * 0.1 }}
                    className="space-y-6"
                  >
                    <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                      <span className="size-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm font-black">
                        {qIdx + 1}
                      </span>
                      {q.text}
                    </h3>
                    <RadioGroup 
                      onValueChange={(val: string) => setSelectedOptions(prev => ({ ...prev, [q._id!]: val }))}
                      value={selectedOptions[q._id!]}
                      className="grid gap-4"
                    >
                      {q.options.map((o) => {
                        const isSelected = selectedOptions[q._id!] === o._id;
                        return (
                          <motion.div
                            key={o._id!}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <Label 
                              htmlFor={o._id!}
                              className={`flex items-center gap-4 border-2 p-6 rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                                isSelected 
                                  ? "border-primary bg-primary/5 ring-4 ring-primary/10" 
                                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                              }`}
                            >
                              <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                isSelected ? "border-primary bg-primary" : "border-slate-300 bg-white group-hover:border-slate-400"
                              }`}>
                                {isSelected && <motion.div layoutId="selection-dot" className="size-2 rounded-full bg-white shadow-sm" />}
                              </div>
                              <span className={`flex-1 text-lg font-bold transition-colors ${isSelected ? "text-primary" : "text-slate-700"}`}>
                                {o.text}
                              </span>
                              <RadioGroupItem value={o._id!} id={o._id!} className="sr-only" />
                            </Label>
                          </motion.div>
                        );
                      })}
                    </RadioGroup>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="pt-6 flex flex-col gap-4"
              >
                <Button 
                  onClick={handleVote} 
                  size="lg"
                  disabled={isPending || poll.questions.some((q) => !selectedOptions[q._id!])}
                  className="h-16 rounded-2xl text-xl font-black bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/10 transition-all disabled:opacity-50"
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <Loader size={20} /> Recording Vote...
                    </span>
                  ) : "Cast Your Vote"}
                </Button>
                <div className="flex items-center justify-center gap-6">
                  <Link to={`/polls/${poll._id}/results`} className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                    View Current Results
                  </Link>
                  <span className="text-slate-300 text-xs">•</span>
                  <p className="text-xs font-medium text-slate-400">Powered by PulseLoop</p>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="success-message"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-20 flex flex-col items-center justify-center text-center space-y-8"
            >
              <div className="size-32 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-inner relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <CheckCircle2 className="size-16" />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0, 0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-emerald-400 rounded-full"
                />
              </div>
              <div className="space-y-4">
                <h1 className="text-5xl font-black tracking-tight text-slate-900">Vote Recorded!</h1>
                <p className="text-xl text-slate-500 font-medium">Thank you for sharing your feedback. Every voice counts.</p>
              </div>
              <div className="flex flex-col gap-4 w-full max-w-sm pt-8">
                <Button asChild size="lg" className="h-14 rounded-2xl text-lg font-bold">
                  <Link to={`/polls/${poll._id}/results`}>See Poll Insights</Link>
                </Button>
                {poll.allowMultipleSubmissions ? (
                  <Button onClick={handleReset} variant="outline" size="lg" className="h-14 rounded-2xl text-lg font-bold">
                    Submit Another Response
                  </Button>
                ) : (
                  <Button asChild variant="outline" size="lg" className="h-14 rounded-2xl text-lg font-bold">
                    <Link to="/dashboard">Go to Dashboard</Link>
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
