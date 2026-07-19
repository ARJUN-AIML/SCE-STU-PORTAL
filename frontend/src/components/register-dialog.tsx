import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAppSettings } from "@/context/app-settings"
import type { EventItem } from "@/types"
import { api } from "@/lib/api"
import { useAuth } from "@/context/auth-context"

const registerSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email").refine(val => val.toLowerCase().endsWith('@saranathan.ac.in'), {
    message: "Must be a valid @saranathan.ac.in email"
  }),
  rollNumber: z.string().min(3, "Enter a valid roll number"),
  notes: z.string().optional(),
})

type RegisterValues = z.infer<typeof registerSchema>

export function RegisterDialog({
  event,
  open,
  onOpenChange,
  onRegistered,
}: {
  event: EventItem | null
  open: boolean
  onOpenChange: (v: boolean) => void
  onRegistered: (eventId: string) => void
}) {
  const { t } = useAppSettings()
  const { requireAuth, user } = useAuth()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) })

  async function onSubmit(values: RegisterValues) {
    setSubmitError(null)
    if (!await requireAuth() || !event) return
    try {
      await api.register(event.id, "event", { ...values, email: user?.email ?? values.email })
      toast.success("Successfully registered for the event.")
      onRegistered(event.id)
      handleClose(false)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Registration failed. Please try again.")
    }
  }

  function handleClose(v: boolean) {
    if (!v) reset()
    onOpenChange(v)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("registerFor")} {event?.title}
          </DialogTitle>
          <DialogDescription>{event?.meta}</DialogDescription>
        </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">{t("fullName")}</Label>
                <Input id="name" placeholder="" {...register("name")} />
                {errors.name && <span className="text-xs text-danger">{errors.name.message}</span>}
              </div>
              {submitError && <p role="alert" className="text-xs text-danger">{submitError}</p>}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">{t("email")}</Label>
                <Input id="email" type="email" placeholder="" {...register("email")} />
                {errors.email && <span className="text-xs text-danger">{errors.email.message}</span>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="rollNumber">{t("rollNumber")}</Label>
                <Input id="rollNumber" placeholder="" {...register("rollNumber")} />
                {errors.rollNumber && <span className="text-xs text-danger">{errors.rollNumber.message}</span>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="notes">{t("notes")}</Label>
                <Input id="notes" placeholder="" {...register("notes")} />
              </div>
              <div className="mt-2 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => handleClose(false)}>
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : t("submit")}
                </Button>
              </div>
            </form>
      </DialogContent>
    </Dialog>
  )
}
