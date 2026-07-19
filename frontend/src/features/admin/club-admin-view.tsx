import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Check, X, Users, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ClubRegistration {
  id: string
  student_name: string
  batch_no: string
  department: string
  year: string
  mobile_number: string
  college_email: string
  club_name: string
  status: string
  applied_at: string
}

export function ClubAdminView() {
  const queryClient = useQueryClient()

  const { data: response, isLoading } = useQuery({
    queryKey: ["club-registrations"],
    queryFn: () => api.getClubRegistrations()
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => 
      api.updateClubRegistrationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["club-registrations"] })
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update status")
    }
  })

  const handleUpdateStatus = async (id: string, status: string) => {
    toast.promise(updateStatusMutation.mutateAsync({ id, status }), {
      loading: 'Updating status...',
      success: `Status updated to ${status}`,
      error: 'Failed to update status'
    })
  }

  const registrations: ClubRegistration[] = response || []

  return (
    <div className="flex flex-col gap-6 p-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text">Club Registrations</h1>
          <p className="text-sm text-muted">Manage student applications for clubs.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full">
          <Users className="h-4 w-4" />
          <span className="text-sm font-medium">{registrations.length} Total</span>
        </div>
      </div>

      <div className="flex-1 bg-surface border border-border rounded-xl overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted" />
          </div>
        ) : registrations.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <Users className="h-12 w-12 text-muted/50 mb-4" />
            <h3 className="text-lg font-medium text-text">No registrations found</h3>
            <p className="text-sm text-muted max-w-sm mt-1">When students apply to join clubs, their applications will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted uppercase bg-surface-2/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Student</th>
                  <th className="px-6 py-4 font-medium">Details</th>
                  <th className="px-6 py-4 font-medium">Contact</th>
                  <th className="px-6 py-4 font-medium">Club</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-surface-2/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-text">{reg.student_name}</div>
                      <div className="text-xs text-muted">{new Date(reg.applied_at).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-text">{reg.department} (Year {reg.year})</div>
                      <div className="text-xs text-muted">Batch: {reg.batch_no}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-text">{reg.college_email}</div>
                      <div className="text-xs text-muted">{reg.mobile_number}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-text">{reg.club_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={
                        reg.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        reg.status === 'Rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                      }>
                        {reg.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {reg.status === 'Pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleUpdateStatus(reg.id, 'Approved')}
                            className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(reg.id, 'Rejected')}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
