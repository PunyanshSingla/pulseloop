import { authClient } from "@/lib/auth-client";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
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
  const { data: session, isPending: isSessionPending } = authClient.useSession();
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isSessionPending || isPollLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoaderContainer message="Loading poll details..." />
      </div>
    );
  }

  const poll = pollResponse?.data;
  const analytics = analyticsResponse?.data;
  
  if (!session) {
    navigate("/sign-in");
    return null;
  }

  if (!poll) {
    return (
      <div className="flex h-screen bg-background text-foreground relative overflow-hidden">
        <Sidebar user={session.user} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex flex-1 flex-col w-full h-full">
          <Topbar userName={session.user.name} onMenuClick={() => setIsSidebarOpen(true)} />
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <h2 className="text-xl font-semibold">Poll not found</h2>
            <Button onClick={() => navigate("/polls")}>Back to polls</Button>
          </div>
        </div>
      </div>
    );
  }

  const copyLink = () => {
    const url = `${import.meta.env.VITE_APP_ORIGIN}/vote/${poll._id}`;
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
    <div className="flex h-screen bg-background text-foreground selection:bg-primary/10 relative overflow-hidden">
      <Sidebar user={session.user} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex min-w-0 flex-1 flex-col w-full h-full">
        <Topbar userName={session.user.name} onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 px-4 sm:px-6 py-6 overflow-y-auto">
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
          </div>
        </main>
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
