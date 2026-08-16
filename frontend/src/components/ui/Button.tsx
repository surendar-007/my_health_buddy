import { type ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

type Variant = "primary" | "ghost" | "outline"
type Size = "md" | "lg"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-[0_8px_30px_-8px_var(--color-primary)] hover:brightness-105 active:scale-[0.98] disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed",
  ghost: "bg-transparent text-foreground hover:bg-surface-raised",
  outline:
    "border border-border bg-surface text-foreground hover:bg-surface-raised active:scale-[0.98] disabled:opacity-40",
}

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-8 text-base",
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/60",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"
