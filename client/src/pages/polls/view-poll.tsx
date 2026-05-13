import { useParams, Link } from "react-router-dom";
import { usePoll, useVote } from "@/hooks/use-polls";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";

export default function ViewPollPage() {
  const { id } = useParams<{ id: string }>();
  const { data: response, isLoading } = usePoll(id!);
  const { mutate: vote, isPending } = useVote(id!);
  
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [startTime] = useState<number>(Date.now());

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const poll = response?.data;

  if (!poll) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold">Poll not found</h2>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const handleVote = () => {
    // For now, we only handle the first question in the UI if it's a simple poll
    // A more complex UI would handle multiple questions
    const questionId = poll.questions[0]?._id;
    const optionId = selectedOptions[questionId];
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    
    if (questionId && optionId) {
      vote({ questionId, optionId, timeTaken });
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{poll.title}</CardTitle>
            <CardDescription>{poll.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {poll.questions.map((q: any) => (
              <div key={q._id} className="space-y-4">
                <h3 className="text-lg font-medium">{q.text}</h3>
                <RadioGroup 
                  onValueChange={(val) => setSelectedOptions(prev => ({ ...prev, [q._id]: val }))}
                  value={selectedOptions[q._id]}
                >
                  <div className="grid gap-3">
                    {q.options.map((o: any) => (
                      <div key={o._id} className="flex items-center space-x-3 space-y-0 border p-4 rounded-lg cursor-pointer hover:bg-accent transition-colors has-[:checked]:bg-accent has-[:checked]:border-primary">
                        <RadioGroupItem value={o._id} id={o._id} />
                        <Label htmlFor={o._id} className="flex-1 cursor-pointer font-medium">
                          {o.text}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-between items-center bg-muted/30">
            <Button asChild variant="ghost">
              <Link to={`/polls/${poll._id}/results`}>View Results</Link>
            </Button>
            <Button 
              onClick={handleVote} 
              disabled={isPending || Object.keys(selectedOptions).length === 0}
            >
              {isPending ? "Submitting..." : "Submit Vote"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
