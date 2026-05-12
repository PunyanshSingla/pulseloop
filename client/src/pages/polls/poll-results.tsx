import { useParams, Link } from "react-router-dom";
import { usePoll } from "@/hooks/use-polls";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Loader2, RefreshCw } from "lucide-react";

export default function PollResultsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: response, isLoading, refetch, isRefetching } = usePoll(id!);

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

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button asChild variant="ghost">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isRefetching}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{poll.title}</CardTitle>
            <CardDescription>{poll.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-10">
            {poll.questions.map((q: any) => {
              // Mocking results for now as backend doesn't aggregate them yet
              // In a real app, the API would return counts
              const totalVotes = q.options.reduce((acc: number, o: any) => acc + (o.votes || 0), 0) || 1; // avoid div by zero

              return (
                <div key={q._id} className="space-y-6">
                  <h3 className="text-lg font-medium">{q.text}</h3>
                  <div className="space-y-4">
                    {q.options.map((o: any) => {
                      const votes = o.votes || 0;
                      const percentage = Math.round((votes / totalVotes) * 100);
                      
                      return (
                        <div key={o._id} className="space-y-2">
                          <div className="flex justify-between text-sm font-medium">
                            <span>{o.text}</span>
                            <span>{votes} votes ({percentage}%)</span>
                          </div>
                          <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-500 ease-out" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
