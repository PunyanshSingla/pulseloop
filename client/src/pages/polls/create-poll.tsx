import { authClient } from "@/lib/auth-client";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
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
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";

export default function CreatePollPage() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { id: 1, text: "", options: ["", ""] }
  ]);

  if (isPending) {
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
    setQuestions([...questions, { id: Date.now(), text: "", options: ["", ""] }]);
  };

  const removeQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const addOption = (qId: number) => {
    setQuestions(questions.map(q => 
      q.id === qId ? { ...q, options: [...q.options, ""] } : q
    ));
  };

  const handleCreate = () => {
    toast.success("Poll created successfully! (Dummy)");
    navigate("/polls");
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar user={session.user} />
      
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar userName={session.user.name} />
        
        <main className="flex-1 px-6 py-6 overflow-y-auto">
          <div className="mx-auto max-w-4xl">
            {/* Back button */}
            <Link to="/polls" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="size-4" />
              Back to polls
            </Link>

            <div className="flex flex-col gap-8 lg:flex-row">
              {/* Form Side */}
              <div className="flex-1 space-y-6">
                <div className="space-y-1">
                  <h1 className="text-2xl font-semibold tracking-tight">Create new poll</h1>
                  <p className="text-sm text-muted-foreground">Design your poll and start collecting responses.</p>
                </div>

                <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Poll Title</Label>
                    <Input 
                      id="title" 
                      placeholder="e.g. Weekly Team Feedback" 
                      className="h-11 bg-muted/30 border-border focus:ring-primary/20"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  {questions.map((q, idx) => (
                    <div key={q.id} className="relative space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/20">
                      <div className="flex items-center justify-between">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                          {idx + 1}
                        </span>
                        {questions.length > 1 && (
                          <button 
                            onClick={() => removeQuestion(q.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Question</Label>
                          <Input 
                            placeholder="What would you like to ask?" 
                            className="h-11 bg-muted/30 border-border"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Options</Label>
                          <div className="grid gap-2">
                            {q.options.map((_, oIdx) => (
                              <Input 
                                key={oIdx} 
                                placeholder={`Option ${oIdx + 1}`} 
                                className="h-10 bg-muted/20 border-border/60"
                              />
                            ))}
                          </div>
                          <button 
                            onClick={() => addOption(q.id)}
                            className="inline-flex items-center gap-2 text-xs font-medium text-primary hover:underline mt-1"
                          >
                            <Plus className="size-3" />
                            Add option
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button 
                    variant="outline" 
                    className="w-full h-12 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all"
                    onClick={addQuestion}
                  >
                    <Plus className="size-4 mr-2" />
                    Add another question
                  </Button>
                </div>
              </div>

              {/* Settings / Preview Side */}
              <div className="w-full space-y-6 lg:w-80">
                <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
                  <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <Settings2 className="size-4 text-primary" />
                    Poll Settings
                  </h3>
                  
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-medium">
                        <Globe className="size-3.5 text-muted-foreground" />
                        Public access
                      </div>
                      <div className="h-4 w-8 rounded-full bg-primary p-0.5">
                        <div className="h-3 w-3 translate-x-4 rounded-full bg-white shadow-sm" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-medium">
                        <Lock className="size-3.5 text-muted-foreground" />
                        Require login
                      </div>
                      <div className="h-4 w-8 rounded-full bg-muted p-0.5">
                        <div className="h-3 w-3 rounded-full bg-white shadow-sm" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-medium">
                        <MessageSquare className="size-3.5 text-muted-foreground" />
                        Allow comments
                      </div>
                      <div className="h-4 w-8 rounded-full bg-primary p-0.5">
                        <div className="h-3 w-3 translate-x-4 rounded-full bg-white shadow-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Button 
                      className="w-full h-11 font-bold shadow-lg shadow-primary/20"
                      onClick={handleCreate}
                    >
                      Create Poll
                    </Button>
                    <p className="mt-3 text-center text-[10px] text-muted-foreground">
                      By creating a poll, you agree to our terms of service.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-muted/30 p-6">
                  <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                    <Sparkles className="size-4 text-primary" />
                    Pro Tip
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Add images to your options to increase engagement by up to 40%.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
