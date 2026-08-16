import { HeartPulse } from "lucide-react"

export function BrandHeader() {
  return (
    <header className="flex items-center justify-center gap-2.5 py-1">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <HeartPulse className="h-5 w-5" strokeWidth={2.5} />
      </span>
      <span className="text-lg font-bold tracking-tight text-foreground">
        My Health Buddy
      </span>
    </header>
  )
}
