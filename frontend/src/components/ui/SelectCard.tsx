import { type ReactNode } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectCardProps {
  selected: boolean
  onSelect: () => void
  icon: ReactNode
  title: string
  description?: string
  className?: string
}

export function SelectCard({
  selected,
  onSelect,
  icon,
  title,
  description,
  className,
}: SelectCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group relative flex w-full items-center gap-4 rounded-3xl border p-4 text-left transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
        selected
          ? "border-primary/70 bg-primary/10 shadow-[0_10px_40px_-16px_var(--color-primary)]"
          : "border-border bg-surface hover:border-border/80 hover:bg-surface-raised",
        className,
      )}
    >
      <span
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors duration-200",
          selected
            ? "bg-primary text-primary-foreground"
            : "bg-surface-raised text-muted group-hover:text-foreground",
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-foreground">{title}</span>
        {description && (
          <span className="block text-sm text-muted">{description}</span>
        )}
      </span>
      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
          selected
            ? "scale-100 border-primary bg-primary text-primary-foreground opacity-100"
            : "scale-75 border-border opacity-0",
        )}
      >
        <Check className="h-4 w-4" strokeWidth={3} />
      </span>
    </button>
  )
}
