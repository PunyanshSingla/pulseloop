import { authClient } from "@/lib/auth-client";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Sparkles,
  Settings2,
  Globe,
  Lock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { useCreatePoll, useUpdatePoll, usePoll } from "@/hooks/use-polls";
import { motion, AnimatePresence } from "framer-motion";
import { aiApi } from "@/lib/api";

export default function CreatePollPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const { mutate: createPoll, isPending: isCreating } = useCreatePoll();
  const { mutate: updatePoll, isPending: isUpdating } = useUpdatePoll(id || "");
  const { data: pollResponse, isLoading: isPollLoading } = usePoll(id || "");
  
  const pollData = pollResponse?.data;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { id: 1, text: "", options: ["", ""], isMandatory: true }
  ]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [allowAnonymous, setAllowAnonymous] = useState(true);
  const [allowMultipleSubmissions, setAllowMultipleSubmissions] = useState(false);
  const [startsAt, setStartsAt] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiPrompt, setAIPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiMode, setAIMode] = useState<"replace" | "append">("replace");

  useEffect(() => {
    if (isEditing && pollData && !isInitialized) {
      queueMicrotask(() => {
        setTitle(pollData.title);
        setDescription(pollData.description || "");
        setVisibility(pollData.visibility);
        setAllowAnonymous(pollData.allowAnonymous);
        setAllowMultipleSubmissions(pollData.allowMultipleSubmissions);
        if (pollData.startsAt) setStartsAt(new Date(pollData.startsAt).toISOString().slice(0, 16));
        if (pollData.expiresAt) setExpiresAt(new Date(pollData.expiresAt).toISOString().slice(0, 16));
        
        if (pollData.questions && pollData.questions.length > 0) {
          setQuestions(pollData.questions.map((q: { _id: string, text: string, isMandatory: boolean, options: { text: string }[] }) => ({
            id: q._id,
            text: q.text,
            isMandatory: q.isMandatory,
            options: q.options.map((o: { text: string }) => o.text)
          })));
        }
        setIsInitialized(true);
      });
    }
  }, [isEditing, pollData, isInitialized]);

  if (isSessionPending || (isEditing && isPollLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    navigate("/sign-in");
    return null;
  }

  const addQuestion = () => {
    const newId = Date.now();
    setQuestions([...questions, { id: newId, text: "", options: ["", ""], isMandatory: true }]);
    setActiveQuestionIndex(questions.length);
  };

  const removeQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return toast.error("Please enter a topic for the AI.");
    
    setIsGenerating(true);
    try {
      const response = await aiApi.generatePoll(aiPrompt);
      if (response.success && response.data) {
        const { title: aiTitle, description: aiDesc, questions: aiQuestions } = response.data;

        const mappedQuestions = aiQuestions.map((q: any, idx: number) => ({
          id: Date.now() + idx,
          text: q.text,
          isMandatory: q.isMandatory,
          options: q.options
        }));

        if (aiMode === "append") {
          const combinedQuestions = [...questions, ...mappedQuestions];
          if (combinedQuestions.length > 10) {
            toast.error("Adding these questions would exceed the 10-question limit.");
            return;
          }
          setQuestions(combinedQuestions);
          setActiveQuestionIndex(Math.max(0, combinedQuestions.length - mappedQuestions.length));
          toast.success("New AI questions added. Review and edit as needed.");
        } else {
          setTitle(aiTitle);
          setDescription(aiDesc);
          setQuestions(mappedQuestions);
          setActiveQuestionIndex(0);
          toast.success("Poll generated successfully! Feel free to edit it.");
        }

        setIsAIModalOpen(false);
        setAIPrompt("");
        setAIMode("replace");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to generate poll with AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuestionChange = (id: number, text: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, text } : q));
  };

  const toggleMandatory = (id: number) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, isMandatory: !q.isMandatory } : q));
  };

  const handleOptionChange = (qId: number, oIdx: number, text: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const newOptions = [...q.options];
        newOptions[oIdx] = text;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const addOption = (qId: number) => {
    setQuestions(questions.map(q => 
      q.id === qId ? { ...q, options: [...q.options, ""] } : q
    ));
  };

  const handleCreate = () => {
    // 1. Basic Title Validation
    if (!title.trim()) return toast.error("Poll title is required");
    
    // 2. Date Validation
    if (!startsAt) return toast.error("Please set a start date and time");
    if (!expiresAt) return toast.error("Please set an end date and time");
    
    const start = new Date(startsAt);
    const end = new Date(expiresAt);
    
    if (end <= start) {
      return toast.error("End date must be after the start date");
    }

    // 3. Questions Validation
    if (questions.length === 0) {
      return toast.error("At least one question is required");
    }

    const formattedQuestions = [];
    
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        return toast.error(`Question ${i + 1} text is required`);
      }
      
      if (q.options.length < 2) {
        return toast.error(`Question ${i + 1} needs at least 2 options`);
      }
      
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          return toast.error(`Option ${j + 1} in Question ${i + 1} is required`);
        }
      }
      
      formattedQuestions.push({
        text: q.text,
        isMandatory: q.isMandatory,
        options: q.options.map(o => ({ text: o }))
      });
    }

    const pollPayload = {
      title,
      description,
      status: pollData?.status || "active",
      visibility,
      allowAnonymous,
      allowMultipleSubmissions,
      questions: formattedQuestions,
      startsAt: start.toISOString(),
      expiresAt: end.toISOString(),
    };

    if (isEditing) {
      updatePoll(pollPayload);
    } else {
      createPoll(pollPayload);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground relative overflow-hidden">
      <Sidebar user={session.user} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex min-w-0 flex-1 flex-col w-full h-full">
        <Topbar userName={session.user.name} onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 px-6 py-6 overflow-y-auto">
          <div className="mx-auto max-w-4xl">
            {/* Back button */}
            <Link to="/polls" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="size-4" />
              Back to polls
            </Link>

            <div className="flex flex-col gap-8 lg:flex-row">
              {/* Form Side */}
              <div className="flex-1 min-w-0 space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <h1 className="text-xl md:text-2xl font-black tracking-tight">Design your Poll</h1>
                    <p className="text-sm text-muted-foreground">Configure your questions in the interactive slider below.</p>
                  </div>
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => {
                      setAIMode("replace");
                      setIsAIModalOpen(true);
                    }}
                    className="gap-2 rounded-xl border-primary/20 bg-primary/5 text-primary font-bold hover:bg-primary/10"
                  >
                    <Sparkles className="size-4" />
                    Generate with AI
                  </Button>
                </div>

                {/* Title & Description Section */}
                <div className="space-y-4 rounded-2xl border border-border bg-card p-4 md:p-6 shadow-sm">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-primary">Poll Title</Label>
                    <Input 
                      id="title" 
                      placeholder="e.g. Product Discovery Survey" 
                      className="h-12 bg-muted/30 border-border font-bold text-base md:text-lg focus:ring-primary/20 rounded-xl"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Description (Optional)</Label>
                    <Input 
                      id="description" 
                      placeholder="What is this poll about?" 
                      className="h-11 bg-muted/20 border-border focus:ring-primary/20 rounded-xl text-sm"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>

                {/* Question Slider Container */}
                <div className="relative space-y-6">
                  {/* Slider Header / Pagination */}
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                        Question {activeQuestionIndex + 1} of {questions.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={activeQuestionIndex === 0}
                        onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
                        className="size-9 p-0 rounded-xl"
                      >
                        <ChevronLeft className="size-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={activeQuestionIndex === questions.length - 1}
                        onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
                        className="size-9 p-0 rounded-xl"
                      >
                        <ChevronRight className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={questions[activeQuestionIndex].id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="relative space-y-6 rounded-3xl border border-border bg-card p-5 md:p-8 shadow-md"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4">
                           <div className="flex items-center gap-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mandatory</Label>
                            <button
                              onClick={() => toggleMandatory(questions[activeQuestionIndex].id)}
                              className={`relative h-5 w-10 rounded-full transition-colors duration-200 ${
                                questions[activeQuestionIndex].isMandatory ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"
                              }`}
                            >
                              <div className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                                questions[activeQuestionIndex].isMandatory ? "translate-x-5" : ""
                              }`} />
                            </button>
                          </div>
                        </div>
                        {questions.length > 1 && (
                          <Button 
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const idToRemove = questions[activeQuestionIndex].id;
                              removeQuestion(idToRemove);
                              setActiveQuestionIndex(Math.max(0, activeQuestionIndex - 1));
                            }}
                            className="text-muted-foreground hover:text-destructive transition-colors h-8 w-8 p-0 rounded-lg"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label className="text-xs font-black uppercase tracking-widest text-slate-400">The Question</Label>
                          <Input 
                            placeholder="Type your question here..." 
                            className="h-12 md:h-14 bg-muted/20 border-border text-base md:text-lg font-bold rounded-2xl px-4 md:px-6 focus:bg-background transition-all"
                            value={questions[activeQuestionIndex].text}
                            onChange={(e) => handleQuestionChange(questions[activeQuestionIndex].id, e.target.value)}
                          />
                        </div>

                        <div className="space-y-4">
                          <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Options</Label>
                          <div className="grid gap-3">
                            {questions[activeQuestionIndex].options.map((option, oIdx) => (
                              <div key={oIdx} className="relative group">
                                <Input 
                                  placeholder={`Option ${oIdx + 1}`} 
                                  className="h-12 bg-muted/10 border-border/60 rounded-xl pl-12 focus:bg-background transition-all"
                                  value={option}
                                  onChange={(e) => handleOptionChange(questions[activeQuestionIndex].id, oIdx, e.target.value)}
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground/30 group-focus-within:text-primary transition-colors">
                                  {String.fromCharCode(65 + oIdx)}
                                </div>
                              </div>
                            ))}
                          </div>
                          <button 
                            onClick={() => addOption(questions[activeQuestionIndex].id)}
                            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors mt-2"
                          >
                            <Plus className="size-3" />
                            Add option
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Dot Indicator */}
                  <div className="flex justify-center gap-1.5">
                    {questions.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveQuestionIndex(i)}
                        className={`size-1.5 rounded-full transition-all duration-300 ${
                          activeQuestionIndex === i 
                            ? "bg-primary w-6" 
                            : "bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full h-12 border-dashed border-primary/30 hover:border-primary/50 hover:bg-primary/5 text-primary transition-all rounded-2xl font-bold"
                  onClick={addQuestion}
                >
                  <Plus className="size-4 mr-2" />
                  Add another question
                </Button>
              </div>

              {/* Settings / Preview Side */}
              <div className="w-full lg:w-80 shrink-0">
                <div className="sticky top-6 space-y-6">
                  <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="flex items-center gap-2 text-sm font-semibold">
                      <Settings2 className="size-4 text-primary" />
                      Poll Actions
                    </h3>
                    
                    <div className="space-y-3 pt-2">
                      <Button 
                        className="w-full h-11 font-bold shadow-lg shadow-primary/20"
                        onClick={handleCreate}
                        disabled={isCreating || isUpdating}
                      >
                        {isCreating || isUpdating ? (isEditing ? "Saving..." : "Creating...") : (isEditing ? "Save Changes" : "Create Poll")}
                      </Button>
                    </div>

                    <div className="h-px bg-border my-2" />

                    <h3 className="flex items-center gap-2 text-sm font-semibold">
                      <Globe className="size-4 text-primary" />
                      Configuration
                    </h3>
                    
                    <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-medium">
                        <Globe className="size-3.5 text-muted-foreground" />
                        Public access
                      </div>
                      <button 
                        onClick={() => setVisibility(visibility === "public" ? "private" : "public")}
                        className={`h-4 w-8 rounded-full p-0.5 transition-colors ${visibility === "public" ? "bg-primary" : "bg-muted"}`}
                      >
                        <div className={`h-3 w-3 rounded-full bg-white shadow-sm transition-transform ${visibility === "public" ? "translate-x-4" : ""}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-medium">
                        <Lock className="size-3.5 text-muted-foreground" />
                        Allow Guest Voting
                      </div>
                      <button 
                        onClick={() => setAllowAnonymous(!allowAnonymous)}
                        className={`h-4 w-8 rounded-full p-0.5 transition-colors ${allowAnonymous ? "bg-primary" : "bg-muted"}`}
                      >
                        <div className={`h-3 w-3 rounded-full bg-white shadow-sm transition-transform ${allowAnonymous ? "translate-x-4" : ""}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-medium">
                        <CheckCircle2 className="size-3.5 text-muted-foreground" />
                        Multi-Submission
                      </div>
                      <button 
                        onClick={() => setAllowMultipleSubmissions(!allowMultipleSubmissions)}
                        className={`h-4 w-8 rounded-full p-0.5 transition-colors ${allowMultipleSubmissions ? "bg-primary" : "bg-muted"}`}
                      >
                        <div className={`h-3 w-3 rounded-full bg-white shadow-sm transition-transform ${allowMultipleSubmissions ? "translate-x-4" : ""}`} />
                      </button>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-border mt-2">
                      <Label htmlFor="startsAt" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Start Date</Label>
                      <Input 
                        id="startsAt"
                        type="datetime-local"
                        className="h-9 text-xs bg-muted/20"
                        value={startsAt}
                        onChange={(e) => setStartsAt(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expiresAt" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">End Date</Label>
                      <Input 
                        id="expiresAt"
                        type="datetime-local"
                        className="h-9 text-xs bg-muted/20"
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                  <div className="rounded-xl border border-border bg-muted/30 p-6">
                    <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                      <Sparkles className="size-4 text-primary" />
                      Pro Tip
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Allowing Guest Voting (Anonymous) usually increases response rates by over 50%.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* AI Generation Modal */}
      <AnimatePresence>
        {isAIModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isGenerating && setIsAIModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            >
              <div className="p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">Generate with Gemini AI</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Enter a topic and our AI will draft a complete poll for you.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ai-prompt" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Poll Topic or Description</Label>
                    <textarea 
                      id="ai-prompt"
                      placeholder="e.g. Employee satisfaction survey for a tech company, or A fun poll about favorite summer vacation spots..."
                      className="min-h-[120px] w-full rounded-xl border border-border bg-muted/30 p-4 text-sm outline-none ring-primary/10 transition-all focus:border-primary/50 focus:ring-4"
                      value={aiPrompt}
                      onChange={(e) => setAIPrompt(e.target.value)}
                      disabled={isGenerating}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Generation Mode</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={aiMode === "replace" ? "default" : "outline"}
                        className="rounded-xl"
                        onClick={() => setAIMode("replace")}
                        disabled={isGenerating}
                      >
                        Replace Poll
                      </Button>
                      <Button
                        type="button"
                        variant={aiMode === "append" ? "default" : "outline"}
                        className="rounded-xl"
                        onClick={() => setAIMode("append")}
                        disabled={isGenerating}
                      >
                        Add Questions
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 rounded-xl"
                      onClick={() => setIsAIModalOpen(false)}
                      disabled={isGenerating}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1 rounded-xl font-bold gap-2"
                      onClick={handleAIGenerate}
                      disabled={isGenerating || !aiPrompt.trim()}
                    >
                      {isGenerating ? (
                        <>
                          <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="size-4" />
                          {aiMode === "append" ? "Add Questions" : "Generate Poll"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
