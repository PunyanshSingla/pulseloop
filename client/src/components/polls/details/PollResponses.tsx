import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { LoaderContainer } from "@/components/ui/loader";
import { formatDistanceToNow, format } from "date-fns";

import type { Poll } from "@/types/polls";

interface Response {
  _id: string;
  respondentId?: {
    name?: string;
    email?: string;
  };
  questionId: string;
  questionText: string;
  optionText: string;
  timeTaken: number;
  createdAt: string;
}

interface PollResponsesProps {
  poll: Poll;
  responsesData: { data: Response[] } | undefined;
  isLoading: boolean;
}

export const PollResponses = ({ poll, responsesData, isLoading }: PollResponsesProps) => {
  const [responseSearch, setResponseSearch] = useState("");
  const [selectedQuestionFilter, setSelectedQuestionFilter] = useState<string>("all");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = (responsesData?.data || []).filter((resp) => {
    const matchesSearch = !responseSearch || 
      resp.respondentId?.name?.toLowerCase().includes(responseSearch.toLowerCase()) ||
      resp.respondentId?.email?.toLowerCase().includes(responseSearch.toLowerCase()) ||
      (responseSearch.toLowerCase() === "anonymous" && !resp.respondentId);
    
    const matchesQuestion = selectedQuestionFilter === "all" || resp.questionId === selectedQuestionFilter;
    
    const matchesType = selectedTypeFilter === "all" || 
      (selectedTypeFilter === "authenticated" && !!resp.respondentId) ||
      (selectedTypeFilter === "anonymous" && !resp.respondentId);
    
    return matchesSearch && matchesQuestion && matchesType;
  });

  const totalFiltered = filtered.length;
  const totalPages = Math.ceil(totalFiltered / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const clearFilters = () => {
    setResponseSearch("");
    setSelectedQuestionFilter("all");
    setSelectedTypeFilter("all");
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    if (filtered.length === 0) return;

    const headers = ["Respondent Name", "Respondent Email", "Question", "Answer", "Time Taken (s)", "Submitted At"];
    const rows = filtered.map(resp => [
      resp.respondentId?.name || "Anonymous",
      resp.respondentId?.email || "N/A",
      `"${resp.questionText.replace(/"/g, '""')}"`,
      `"${resp.optionText.replace(/"/g, '""')}"`,
      resp.timeTaken,
      format(new Date(resp.createdAt), "yyyy-MM-dd HH:mm:ss")
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `pulseloop_responses_${poll._id}_${format(new Date(), "yyyyMMdd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Filters Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 bg-card border border-border/50 rounded-2xl shadow-sm">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              placeholder="Search respondents..."
              value={responseSearch}
              onChange={(e) => {
                setResponseSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="h-10 w-full rounded-xl border border-border/50 bg-background pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>
          <select 
            value={selectedQuestionFilter}
            onChange={(e) => {
              setSelectedQuestionFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 px-3 rounded-xl border border-border/50 bg-background text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          >
            <option value="all">All Questions</option>
            {poll.questions.map((q) => (
              <option key={q._id} value={q._id}>{q.text}</option>
            ))}
          </select>
          <select 
            value={selectedTypeFilter}
            onChange={(e) => {
              setSelectedTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 px-3 rounded-xl border border-border/50 bg-background text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          >
            <option value="all">All Types</option>
            <option value="authenticated">Authenticated</option>
            <option value="anonymous">Anonymous</option>
          </select>
        </div>
        {(responseSearch || selectedQuestionFilter !== "all" || selectedTypeFilter !== "all") && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-foreground rounded-xl"
          >
            Clear Filters
          </Button>
        )}
      </div>

      <div className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border/50 bg-muted/10 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Individual Submissions</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportToCSV}
            disabled={filtered.length === 0}
            className="h-8 gap-2 rounded-lg text-xs font-bold border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/5"
          >
            <Download className="size-3.5" />
            Export CSV
          </Button>
        </div>
        
        {isLoading ? (
          <LoaderContainer message="Fetching responses..." />
        ) : totalFiltered === 0 ? (
          <div className="px-6 py-12 text-center text-muted-foreground">
            No responses match your filters.
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Respondent</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Answer</TableHead>
                  <TableHead className="text-right">Time Taken</TableHead>
                  <TableHead className="text-right">Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((resp) => (
                  <TableRow key={resp._id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {resp.respondentId?.name || "Anonymous User"}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {resp.respondentId?.email || "No email available"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate font-medium text-muted-foreground">
                      {resp.questionText}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {resp.optionText}
                      </span>
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {resp.timeTaken}s
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {formatDistanceToNow(new Date(resp.createdAt))} ago
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination Footer */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-muted/5 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * itemsPerPage, totalFiltered)}</span> of <span className="font-medium text-foreground">{totalFiltered}</span> results
                  </p>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="size-8 rounded-xl"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <span className="text-xs font-medium px-2">
                      {currentPage} / {totalPages}
                    </span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="size-8 rounded-xl"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};
