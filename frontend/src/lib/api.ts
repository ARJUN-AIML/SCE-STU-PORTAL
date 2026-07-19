import { auth } from "./firebase"
import { demoData } from "@/repositories/demo-data"

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
const REQUEST_TIMEOUT_MS = 15000

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message)
    this.name = "ApiError"
  }
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers)
  
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken()
      headers.set("Authorization", `Bearer ${token}`)
    }

    const response = await fetch(`${API_BASE}${url}`, { ...options, headers, signal: controller.signal })
    const contentType = response.headers.get("content-type") || ""
    const data = contentType.includes("application/json") ? await response.json() : null
    if (response.status === 401) throw new ApiError(401, "Your session has expired. Please sign in again.")
    if (!response.ok || data?.success === false) {
      throw new ApiError(response.status, data?.message || data?.detail || "The service could not complete that request.")
    }
    return data?.data ?? data ?? []
  } catch (error) {
    if (error instanceof ApiError) throw error
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(408, "The request took too long. Please try again.")
    }
    throw new ApiError(0, "We could not reach the campus service. Please try again.")
  } finally {
    window.clearTimeout(timeout)
  }
}

export const api = {
  getHealth: async () => {
    try {
      return await fetchWithAuth("/health")
    } catch (_err) {
      // Backend unreachable — fall back to demo data so UI shows a sensible state
      return demoData?.default?.health ?? { status: "live", version: "2.1.0" }
    }
  },

  getEvents: () => fetchWithAuth("/events"),
  getClubs: () => fetchWithAuth("/clubs"),
  getFaculty: () => fetchWithAuth("/faculty"),
  getDepartments: () => fetchWithAuth("/departments"),
  getDepartmentFaculty: (id: string) => fetchWithAuth(`/departments/${id}/faculty`),
  getSchedule: () => fetchWithAuth("/schedule"),
  getNotices: () => fetchWithAuth("/notices"),
  getResources: () => fetchWithAuth("/resources"),
  getTransport: () => fetchWithAuth("/transport"),
  getLibrary: () => fetchWithAuth("/library"),
  search: (query: string) => fetchWithAuth(`/search?query=${encodeURIComponent(query)}`),
  getLocation: (room: string) => fetchWithAuth(`/map/location/${encodeURIComponent(room)}`),
  
  register: (eventId: string, type: string, payload: any) => 
    fetchWithAuth("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_id: eventId, type, ...payload })
    }),
    
  getMyRegistrations: () => fetchWithAuth("/my-registrations"),
  getAdminRegistrations: (eventId: string) => fetchWithAuth(`/admin/events/${eventId}/registrations`),
    
  uploadFile: async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    
    // We can't use fetchWithAuth directly since FormData headers are handled automatically
    const headers = new Headers()
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken()
      headers.set("Authorization", `Bearer ${token}`)
    }
    
    const response = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      headers,
      body: formData
    })
    
    const data = await response.json()
    if (!response.ok || data.success === false) {
      throw new Error(data.message || "Upload Failed")
    }
    return data.data
  },
  
  registerForClub: (payload: any) => 
    fetchWithAuth("/clubs/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }),
    
  getClubRegistrations: () => fetchWithAuth("/clubs/admin/registrations"),
  
  updateClubRegistrationStatus: (id: string, status: string) => 
    fetchWithAuth(`/clubs/admin/registrations/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    })
}
