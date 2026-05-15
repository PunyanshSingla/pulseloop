const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const isFormData = options.body instanceof FormData;
  
  const headers: Record<string, string> = {
    "x-voter-id": localStorage.getItem("pl_voter_id") || "",
    ...((options.headers as Record<string, string>) || {}),
  };

  // Only set Content-Type to application/json if it's NOT FormData
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // Important for cookies
  });

  const contentType = response.headers.get("content-type");
  let data: any;

  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    console.error("Non-JSON response received:", text);
    throw new Error(`Server returned non-JSON response: ${response.status} ${response.statusText}`);
  }

  if (!response.ok) {
    throw new Error(data.message || data.error || "Something went wrong");
  }

  return data;
}

export const pollsApi = {
  create: (data: any) => request("/polls", { method: "POST", body: JSON.stringify(data) }),
  getAll: (limit: number = 10, skip: number = 0) => request(`/polls?limit=${limit}&skip=${skip}`),
  getPublic: () => request("/polls?type=public"),
  getVoted: () => request("/polls/voted"),
  getById: (id: string) => request(`/polls/${id}`),
  trackView: (id: string, data: { fingerprint: string }) => 
    request(`/polls/${id}/view`, { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => request(`/polls/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => request(`/polls/${id}`, { method: "DELETE" }),
  
  // Voting
  vote: (pollId: string, data: any) => 
    request(`/polls/${pollId}/vote`, { 
      method: "POST", 
      body: JSON.stringify(data) 
    }),
  getResponses: (pollId: string) => request(`/polls/${pollId}/responses`),
  getAnalytics: (pollId: string) => request(`/polls/${pollId}/analytics`),
  publishResults: (id: string) => request(`/polls/${id}/publish`, { method: "POST" }),
};

export const analyticsApi = {
  getDashboardData: (days: number = 30) => request(`/analytics/dashboard?days=${days}`),
};

export const mediaApi = {
  upload: (formData: FormData) => request<{ success: boolean, data: { secure_url: string } }>("/media/upload", {
    method: "POST",
    body: formData,
  }),
};

export const usersApi = {
  getMe: () => request<{ success: boolean, data: any }>("/user/me"),
};
