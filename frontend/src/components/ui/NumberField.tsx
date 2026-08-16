import { type InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

interface NumberFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string
  unit?: string
  error?: string | null
}

export function NumberField({
  label,
  unit,
  error,
  className,
  id,
  ...props
}: NumberFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-")
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="text-sm font-medium text-muted">
        {label}
      </label>
      <div
        className={cn(
          "flex items-center rounded-2xl border bg-surface px-4 transition-colors focus-within:border-primary/70 focus-within:ring-2 focus-within:ring-primary/25",
          error ? "border-red-400/60" : "border-border",
        )}
      >
        <input
          id={fieldId}
          type="number"
          inputMode="decimal"
          className={cn(
            "h-12 w-full bg-transparent text-lg font-semibold text-foreground outline-none placeholder:text-muted/50",
            className,
          )}
          {...props}
        />
        {unit && (
          <span className="ml-2 shrink-0 text-sm font-medium text-muted">
            {unit}
          </span>
        )}
      </div>
      {error && <p className="text-xs font-medium text-red-400">{error}</p>}
    </div>
  )
}
