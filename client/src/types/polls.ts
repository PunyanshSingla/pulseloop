export interface PollOption {
  _id?: string;
  text: string;
  responseCount?: number;
  percentage?: number;
}

export interface PollQuestion {
  _id?: string;
  text: string;
  isMandatory: boolean;
  options: PollOption[];
}

export interface Poll {
  _id: string;
  title: string;
  description?: string;
  status: "active" | "closed";
  visibility: "public" | "private";
  allowAnonymous: boolean;
  allowMultipleSubmissions: boolean;
  resultsPublished: boolean;
  startsAt: string | null;
  expiresAt: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  responseCount: number;
  viewCount: number;
  avgTimeTaken: number;
  questions: PollQuestion[];
  userHasVoted?: boolean;
}

export interface PollsResponse {
  data: Poll[];
  message?: string;
}

export interface PollResponse {
  data: Poll;
  message?: string;
}

export interface AnalyticsResponse {
  success: boolean;
  data: Analytics;
  message?: string;
}

export interface Analytics {
  timeline: { date: string; votes: number; loggedIn: number; anonymous: number }[];
  results: {
    id: string;
    text: string;
    totalVotes: number;
    options: { id: string; text: string; count: number; percentage: number }[];
  }[];
  demographics: {
    devices: { name: string; value: number }[];
    os: { name: string; value: number }[];
    browsers: { name: string; value: number }[];
    countries: { name: string; value: number }[];
  };
  poll: {
    responseCount: number;
    viewCount: number;
    completionRate: number;
    loggedInResponses: number;
    anonymousResponses: number;
  };
}

export interface VotePayload {
  responses: {
    questionId: string;
    selectedOptionId: string;
    timeTaken: number;
  }[];
  fingerprint: string;
  deviceInfo: {
    browser: string;
    os: string;
    device: string;
    userAgent: string;
    screenResolution: string;
    language: string;
  };
  voterId?: string;
  voteAsAnonymous?: boolean;
}

export interface Response {
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

export interface ActivityEvent {
  who: string;
  what: string;
  poll: string;
  when: string;
}

export interface DashboardData {
  success: boolean;
  data: {
    kpis: {
      totalResponses: number;
      activePolls: number;
      totalResponsesGrowth: string;
      activePollsGrowth: string;
      completionRate: string;
      completionRateGrowth: string;
      avgResponseTime: string;
      avgResponseTimeGrowth: string;
      anonymousResponses: number;
      loggedInResponses: number;
    };
    chartData: { date: string; anonymous: number; loggedIn: number; total: number }[];
    topPoll: Poll | null;
    demographics: {
      devices: { name: string; value: number }[];
      os: { name: string; value: number }[];
      browsers: { name: string; value: number }[];
    };
    activity: ActivityEvent[];
  };
}
