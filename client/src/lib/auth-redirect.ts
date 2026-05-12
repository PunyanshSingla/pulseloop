const browserOrigin =
  typeof window !== "undefined" ? window.location.origin : undefined

export const appOrigin =
  browserOrigin || import.meta.env.VITE_APP_ORIGIN || "http://localhost:5173"

export function appUrl(path: string) {
  return `${appOrigin}${path.startsWith("/") ? path : `/${path}`}`
}
