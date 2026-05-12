import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, BarChart3 } from "lucide-react";

interface PollCardProps {
  poll: {
    _id: string;
    title: string;
    description: string;
    status: "draft" | "active" | "closed";
    expiresAt: string | null;
    createdAt: string;
  };
}

export function PollCard({ poll }: PollCardProps) {
  const statusColors = {
    draft: "bg-gray-500",
    active: "bg-green-500",
    closed: "bg-red-500",
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge className={`${statusColors[poll.status]} text-white`}>
            {poll.status.toUpperCase()}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(poll.createdAt).toLocaleDateString()}
          </div>
        </div>
        <CardTitle className="line-clamp-1 mt-2">{poll.title}</CardTitle>
        <CardDescription className="line-clamp-2 min-h-[40px]">
          {poll.description || "No description provided."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="w-4 h-4 mr-2" />
          <span>Responses: --</span>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 gap-2">
        <Button asChild variant="outline" className="flex-1" size="sm">
          <Link to={`/polls/${poll._id}`}>Vote</Link>
        </Button>
        <Button asChild variant="secondary" className="flex-1" size="sm">
          <Link to={`/polls/${poll._id}/results`}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Results
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
