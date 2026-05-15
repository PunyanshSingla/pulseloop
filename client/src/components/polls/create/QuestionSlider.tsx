import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react";

interface Question {
  id: string | number;
  text: string;
  options: string[];
  isMandatory: boolean;
}

interface QuestionSliderProps {
  questions: Question[];
  activeQuestionIndex: number;
  setActiveQuestionIndex: (idx: number) => void;
  onQuestionChange: (id: string | number, text: string) => void;
  onToggleMandatory: (id: string | number) => void;
  onRemoveQuestion: (id: string | number) => void;
  onOptionChange: (qId: string | number, oIdx: number, text: string) => void;
  onAddOption: (qId: string | number) => void;
}

export function QuestionSlider({
  questions,
  activeQuestionIndex,
  setActiveQuestionIndex,
  onQuestionChange,
  onToggleMandatory,
  onRemoveQuestion,
  onOptionChange,
  onAddOption
}: QuestionSliderProps) {
  const currentQ = questions[activeQuestionIndex];

  return (
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
          key={currentQ.id}
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
                  type="button"
                  onClick={() => onToggleMandatory(currentQ.id)}
                  className={`relative h-5 w-10 rounded-full transition-colors duration-200 ${
                    currentQ.isMandatory ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"
                  }`}
                >
                  <div className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    currentQ.isMandatory ? "translate-x-5" : ""
                  }`} />
                </button>
              </div>
            </div>
            {questions.length > 1 && (
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => onRemoveQuestion(currentQ.id)}
                className="text-muted-foreground hover:text-destructive transition-colors h-8 w-8 p-0 rounded-lg"
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">The Question</Label>
              <Textarea 
                placeholder="Type your question here..." 
                className="min-h-[100px] bg-muted/20 border-border text-base md:text-lg font-bold rounded-2xl px-4 md:px-6 focus:bg-background transition-all resize-none py-4"
                value={currentQ.text}
                onChange={(e) => onQuestionChange(currentQ.id, e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Options</Label>
              <div className="grid gap-3">
                {currentQ.options.map((option, oIdx) => (
                  <div key={oIdx} className="relative group">
                    <Input 
                      placeholder={`Option ${oIdx + 1}`} 
                      className="h-12 bg-muted/10 border-border/60 rounded-xl pl-12 focus:bg-background transition-all"
                      value={option}
                      onChange={(e) => onOptionChange(currentQ.id, oIdx, e.target.value)}
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground/30 group-focus-within:text-primary transition-colors">
                      {String.fromCharCode(65 + oIdx)}
                    </div>
                  </div>
                ))}
              </div>
              <button 
                type="button"
                onClick={() => onAddOption(currentQ.id)}
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
            type="button"
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
  );
}
