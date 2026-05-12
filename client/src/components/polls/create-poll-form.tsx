import { useState } from "react";
import { useCreatePoll } from "@/hooks/use-polls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, X } from "lucide-react";
import { Badge } from "../ui/badge";


export function CreatePollForm() {
  const { mutate: createPoll, isPending } = useCreatePoll();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    {
      text: "",
      options: [{ text: "" }, { text: "" }],
    },
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { text: "", options: [{ text: "" }, { text: "" }] }]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const addOption = (qIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push({ text: "" });
    setQuestions(newQuestions);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    if (questions[qIndex].options.length > 2) {
      const newQuestions = [...questions];
      newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, i) => i !== oIndex);
      setQuestions(newQuestions);
    }
  };

  const handleQuestionChange = (index: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[index].text = text;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex].text = text;
    setQuestions(newQuestions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPoll({
      title,
      description,
      status: "active",
      questions,
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#e8f0ff_0%,_#f5f6f8_40%,_#f7f7f8_100%)] dark:bg-[radial-gradient(circle_at_top_right,_#1a1d24_0%,_#111317_40%,_#0a0b0d_100%)] pt-12 pb-24">
      <form onSubmit={handleSubmit} className="space-y-12 max-w-2xl mx-auto px-6">
        <div className="space-y-8">
          <div>
            <Badge variant="outline" className="mb-4 px-3 py-1 border-primary/20 text-primary bg-primary/5 text-[10px] font-bold uppercase tracking-widest">New Poll</Badge>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Create New Poll</h1>
            <p className="text-muted-foreground font-medium">Capture the pulse of your audience in minutes.</p>
          </div>

          <div className="grid gap-6 p-8 rounded-[32px] border border-white/60 bg-white/40 dark:bg-white/5 backdrop-blur-xl shadow-2xl shadow-primary/5">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs font-bold uppercase tracking-widest opacity-60 ml-1">Poll Title</Label>
              <Input
                id="title"
                className="h-12 bg-background/50 border-white/40 focus:border-primary/50 transition-all rounded-2xl"
                placeholder="e.g. Favorite JavaScript Framework…"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest opacity-60 ml-1">Description (Optional)</Label>
              <Input
                id="description"
                className="h-12 bg-background/50 border-white/40 focus:border-primary/50 transition-all rounded-2xl"
                placeholder="Provide some context for your respondents…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex justify-between items-end px-1">
            <div>
              <h3 className="text-xl font-bold tracking-tight mb-1">Questions</h3>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest opacity-60">Add up to 10 questions</p>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addQuestion}
              className="rounded-xl border-primary/20 hover:bg-primary/5 hover:text-primary transition-all font-bold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </div>

          <div className="space-y-6">
            {questions.map((q, qIndex) => (
              <div 
                key={qIndex} 
                className="group relative p-8 rounded-[32px] border border-white/60 bg-white/60 dark:bg-white/5 backdrop-blur-xl shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                {questions.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-6 right-6 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all rounded-xl"
                    onClick={() => removeQuestion(qIndex)}
                    aria-label="Remove Question"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                )}
                
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                    {qIndex + 1}
                  </div>
                  <h4 className="font-bold tracking-tight">Question {qIndex + 1}</h4>
                </div>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-1">Question Text</Label>
                    <Input
                      className="h-12 bg-background/40 border-white/40 focus:border-primary/50 transition-all rounded-2xl text-lg font-medium"
                      value={q.text}
                      onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                      placeholder="“What is your question?”"
                      required
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <Label className="text-xs font-bold uppercase tracking-widest opacity-60">Options</Label>
                    </div>
                    
                    <div className="grid gap-3">
                      {q.options.map((o, oIndex) => (
                        <div key={oIndex} className="flex gap-2 group/option">
                          <Input
                            className="h-11 bg-background/30 border-white/40 focus:border-primary/40 transition-all rounded-xl"
                            value={o.text}
                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                            placeholder={`Option ${oIndex + 1}…`}
                            required
                          />
                          {q.options.length > 2 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 transition-all rounded-xl shrink-0"
                              onClick={() => removeOption(qIndex, oIndex)}
                              aria-label={`Remove Option ${oIndex + 1}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="mt-4 text-primary hover:bg-primary/5 rounded-xl font-bold transition-all"
                      onClick={() => addOption(qIndex)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Option
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 sticky bottom-8 z-20">
          <Button 
            type="submit" 
            className="w-full h-16 text-lg font-bold rounded-[24px] shadow-2xl shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all" 
            disabled={isPending}
          >
            {isPending ? "Creating…" : "Create Poll"}
          </Button>
        </div>
      </form>
    </div>
  );
}
