import { cn } from "@/lib/utils"

interface StepperProps {
  steps: string[]
  current: number // 0-based index
}

export function Stepper({ steps, current }: StepperProps) {
  return (
    <div className="flex items-center gap-2" aria-label="Progress">
      {steps.map((label, i) => {
        const state =
          i < current ? "done" : i === current ? "active" : "upcoming"
        return (
          <div key={label} className="flex flex-1 flex-col gap-2">
            <div
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                state === "done" && "bg-primary",
                state === "active" && "bg-primary/70",
                state === "upcoming" && "bg-border",
              )}
            />
            <span
              className={cn(
                "hidden text-xs font-medium transition-colors sm:block",
                state === "upcoming" ? "text-muted/60" : "text-foreground",
              )}
            >
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
