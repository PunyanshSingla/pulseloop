export interface PollOption {
  _id?: string;
  text: string;
}

export interface PollQuestion {
  _id?: string;
  text: string;
  options: PollOption[];
}

export interface Poll {
  _id: string;
  title: string;
  description?: string;
  status: "draft" | "active" | "closed";
  visibility: "public" | "private";
  allowAnonymous: boolean;
  resultsPublished: boolean;
  expiresAt: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  responseCount?: number;
  questions: PollQuestion[];
}

export interface PollsResponse {
  data: Poll[];
  message?: string;
}

export interface PollResponse {
  data: Poll;
  message?: string;
}
