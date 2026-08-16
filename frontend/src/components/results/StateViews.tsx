import { Loader2, WifiOff, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/Button"

export function LoadingState() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <span className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Loader2 className="h-7 w-7 animate-spin" />
        </span>
      </span>
      <div>
        <p className="text-lg font-bold">Building your plan…</p>
        <p className="text-sm text-muted">Crunching the numbers just for you.</p>
      </div>
    </div>
  )
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-400/15 text-red-400">
        <WifiOff className="h-7 w-7" />
      </span>
      <div className="max-w-xs space-y-1">
        <p className="text-lg font-bold">Something went wrong</p>
        <p className="text-pretty text-sm text-muted">{message}</p>
      </div>
      <Button variant="outline" onClick={onRetry}>
        <RotateCcw className="h-4 w-4" />
        Try again
      </Button>
    </div>
  )
}
