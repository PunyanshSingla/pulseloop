import { CreatePollForm } from "@/components/polls/create-poll-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function CreatePollPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-2xl mx-auto mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create New Poll</h1>
        <p className="text-muted-foreground mt-2">
          Fill in the details below to create a new poll and share it with others.
        </p>
      </div>
      
      <CreatePollForm />
    </div>
  );
}
