import { Armchair, Footprints, Bike, Flame } from "lucide-react"
import { SelectCard } from "@/components/ui/SelectCard"
import type { ActivityLevel } from "@/lib/types"

interface Props {
  value: ActivityLevel | null
  onChange: (level: ActivityLevel) => void
  error?: string
}

const OPTIONS: {
  level: ActivityLevel
  title: string
  description: string
  icon: React.ReactNode
}[] = [
  {
    level: "sedentary",
    title: "Sedentary",
    description: "Little or no exercise",
    icon: <Armchair className="h-5 w-5" />,
  },
  {
    level: "light",
    title: "Light Activity",
    description: "Exercise 1–3 days per week",
    icon: <Footprints className="h-5 w-5" />,
  },
  {
    level: "moderate",
    title: "Moderate Activity",
    description: "Exercise 3–5 days per week",
    icon: <Bike className="h-5 w-5" />,
  },
  {
    level: "high",
    title: "High Activity",
    description: "Exercise 6–7 days per week",
    icon: <Flame className="h-5 w-5" />,
  },
]

export function ActivityStep({ value, onChange, error }: Props) {
  return (
    <div className="animate-fade-up space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
          How active are you?
        </h1>
        <p className="text-pretty text-muted">
          Pick the option that best describes your typical week.
        </p>
      </div>

      <div className="space-y-3">
        {OPTIONS.map((opt) => (
          <SelectCard
            key={opt.level}
            selected={value === opt.level}
            onSelect={() => onChange(opt.level)}
            icon={opt.icon}
            title={opt.title}
            description={opt.description}
          />
        ))}
        {error && (
          <p className="text-xs font-medium text-red-400">{error}</p>
        )}
      </div>
    </div>
  )
}
