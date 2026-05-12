import { createAuthClient } from "better-auth/react"

const rawApiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"

// better-auth expects server origin/base without duplicating the /api segment.
const authBaseURL = rawApiBase.replace(/\/api\/?$/, "")

export const authClient = createAuthClient({
  baseURL: authBaseURL,
  fetchOptions: {
    credentials: "include",
  },
})
