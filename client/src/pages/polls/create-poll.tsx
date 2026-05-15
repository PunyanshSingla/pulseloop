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
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { useCreatePoll, useUpdatePoll, usePoll } from "@/hooks/use-polls";
import { aiApi } from "@/lib/api";
import { PollAIModal } from "@/components/polls/create/PollAIModal";
import { QuestionSlider } from "@/components/polls/create/QuestionSlider";
import { PollConfigSidebar } from "@/components/polls/create/PollConfigSidebar";

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
  const [questions, setQuestions] = useState<{ id: string | number; text: string; options: string[]; isMandatory: boolean }[]>([
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
          setQuestions(pollData.questions.map((q: any) => ({
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

  const removeQuestion = (id: string | number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
      setActiveQuestionIndex(Math.max(0, activeQuestionIndex - 1));
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

  const handleCreate = () => {
    if (!title.trim()) return toast.error("Poll title is required");
    if (!startsAt) return toast.error("Please set a start date and time");
    if (!expiresAt) return toast.error("Please set an end date and time");
    
    const start = new Date(startsAt);
    const end = new Date(expiresAt);
    
    if (end <= start) {
      return toast.error("End date must be after the start date");
    }

    if (questions.length === 0) {
      return toast.error("At least one question is required");
    }

    const formattedQuestions = [];
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) return toast.error(`Question ${i + 1} text is required`);
      if (q.options.length < 2) return toast.error(`Question ${i + 1} needs at least 2 options`);
      
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) return toast.error(`Option ${j + 1} in Question ${i + 1} is required`);
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
            <Link to="/polls" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="size-4" />
              Back to polls
            </Link>

            <div className="flex flex-col gap-8 lg:flex-row">
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

                <QuestionSlider 
                  questions={questions}
                  activeQuestionIndex={activeQuestionIndex}
                  setActiveQuestionIndex={setActiveQuestionIndex}
                  onQuestionChange={(id, text) => setQuestions(questions.map(q => q.id === id ? { ...q, text } : q))}
                  onToggleMandatory={(id) => setQuestions(questions.map(q => q.id === id ? { ...q, isMandatory: !q.isMandatory } : q))}
                  onRemoveQuestion={removeQuestion}
                  onOptionChange={(qId, oIdx, text) => setQuestions(questions.map(q => {
                    if (q.id === qId) {
                      const newOptions = [...q.options];
                      newOptions[oIdx] = text;
                      return { ...q, options: newOptions };
                    }
                    return q;
                  }))}
                  onAddOption={(qId) => setQuestions(questions.map(q => q.id === qId ? { ...q, options: [...q.options, ""] } : q))}
                />

                <Button 
                  variant="outline" 
                  className="w-full h-12 border-dashed border-primary/30 hover:border-primary/50 hover:bg-primary/5 text-primary transition-all rounded-2xl font-bold"
                  onClick={addQuestion}
                >
                  <Plus className="size-4 mr-2" />
                  Add another question
                </Button>
              </div>

              <PollConfigSidebar 
                onSave={handleCreate}
                isPending={isCreating || isUpdating}
                isEditing={isEditing}
                visibility={visibility}
                setVisibility={setVisibility}
                allowAnonymous={allowAnonymous}
                setAllowAnonymous={setAllowAnonymous}
                allowMultipleSubmissions={allowMultipleSubmissions}
                setAllowMultipleSubmissions={setAllowMultipleSubmissions}
                startsAt={startsAt}
                setStartsAt={setStartsAt}
                expiresAt={expiresAt}
                setExpiresAt={setExpiresAt}
              />
            </div>
          </div>
        </main>
      </div>

      <PollAIModal 
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        prompt={aiPrompt}
        setPrompt={setAIPrompt}
        mode={aiMode}
        setMode={setAIMode}
        isGenerating={isGenerating}
        onGenerate={handleAIGenerate}
      />
    </div>
  );
}
