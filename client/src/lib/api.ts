const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
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
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const pollsApi = {
  create: (data: any) => request("/polls", { method: "POST", body: JSON.stringify(data) }),
  getAll: () => request("/polls"),
  getById: (id: string) => request(`/polls/${id}`),
  update: (id: string, data: any) => request(`/polls/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (id: string) => request(`/polls/${id}`, { method: "DELETE" }),
  
  // Voting (To be implemented in backend later, but preparing the UI for it)
  vote: (pollId: string, questionId: string, optionId: string, timeTaken?: number) => 
    request(`/polls/${pollId}/vote`, { 
      method: "POST", 
      body: JSON.stringify({ questionId, selectedOptionId: optionId, timeTaken }) 
    }),
};

export const analyticsApi = {
  getDashboardData: (days: number = 30) => request(`/analytics/dashboard?days=${days}`),
};
