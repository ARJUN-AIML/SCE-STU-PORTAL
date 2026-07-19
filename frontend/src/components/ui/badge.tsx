import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        outline: "border-border text-text",
        pink: "border-transparent bg-accent-pink text-[var(--c-accent-pink-text)]",
        blue: "border-transparent bg-accent-blue text-[var(--c-accent-blue-text)]",
        green: "border-transparent bg-accent-green text-[var(--c-accent-green-text)]",
        purple: "border-transparent bg-accent-purple text-[var(--c-accent-purple-text)]",
        live: "border-transparent bg-emerald-500/15 text-emerald-500",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants }
