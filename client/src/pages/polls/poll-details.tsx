import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";
import { 
  usePoll, 
  useUpdatePoll, 
  useDeletePoll, 
  usePollResponses, 
  usePollAnalytics, 
  usePublishResults 
} from "@/hooks/use-polls";
import { LoaderContainer } from "@/components/ui/loader";

// Extracted Components
import { PollHeader } from "@/components/polls/details/PollHeader";
import { PollTabs } from "@/components/polls/details/PollTabs";
import { PollOverview } from "@/components/polls/details/PollOverview";
import { PollResponses } from "@/components/polls/details/PollResponses";
import { PollSettings } from "@/components/polls/details/PollSettings";
import { PollModals } from "@/components/polls/details/PollModals";

export default function PollDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: pollResponse, isLoading: isPollLoading } = usePoll(id!);
  const { mutate: updatePoll } = useUpdatePoll(id!);
  const { mutate: deletePoll } = useDeletePoll();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<"overview" | "responses" | "settings">("overview");
  const { data: responsesData, isLoading: isResponsesLoading } = usePollResponses(id!);
  const { data: analyticsResponse } = usePollAnalytics(id!);
  const { mutate: publishResults, isPending: isPublishing } = usePublishResults(id!);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  if (isPollLoading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[400px]">
        <LoaderContainer message="Loading poll details..." />
      </div>
    );
  }

  const poll = pollResponse?.data;
  const analytics = analyticsResponse?.data;

  if (!poll) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 min-h-[400px]">
        <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Poll not found</h2>
        <Button onClick={() => navigate("/polls")} className="rounded-xl font-bold">Back to polls</Button>
      </div>
    );
  }

  const copyLink = () => {
    const url = `${window.location.origin}/vote/${poll._id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  const toggleStatus = () => {
    const nextStatus = poll.status === "active" ? "closed" : "active";
    updatePoll({ status: nextStatus });
  };

  const confirmDelete = () => {
    deletePoll(id!, {
      onSuccess: () => navigate("/polls")
    });
    setShowDeleteModal(false);
  };

  const confirmPublish = () => {
    publishResults();
    setShowPublishModal(false);
  };

  return (
    <div className="mx-auto space-y-8 max-w-7xl">
      <PollHeader 
        poll={poll}
        isPublishing={isPublishing}
        onCopyLink={copyLink}
        onToggleStatus={toggleStatus}
        onShowQR={() => setShowQRModal(true)}
        onShowPublish={() => setShowPublishModal(true)}
        onShowDelete={() => setShowDeleteModal(true)}
      />

      <PollTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="min-h-[400px] mt-8 pb-12">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <PollOverview poll={poll} analytics={analytics} />
          )}

          {activeTab === "responses" && (
            <PollResponses 
              poll={poll} 
              responsesData={responsesData} 
              isLoading={isResponsesLoading} 
            />
          )}

          {activeTab === "settings" && (
            <PollSettings poll={poll} onUpdatePoll={updatePoll} />
          )}
        </AnimatePresence>
      </div>

      <PollModals 
        poll={poll}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        confirmDelete={confirmDelete}
        showPublishModal={showPublishModal}
        setShowPublishModal={setShowPublishModal}
        confirmPublish={confirmPublish}
        showQRModal={showQRModal}
        setShowQRModal={setShowQRModal}
      />
    </div>
  );
}
