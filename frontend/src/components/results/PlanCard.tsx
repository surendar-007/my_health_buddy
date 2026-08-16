import {
  Target,
  Zap,
  TrendingUp,
  CalendarClock,
} from "lucide-react"

import { Card } from "@/components/ui/Card"
import type { Recommendation } from "@/lib/types"

interface Props {
  plan: Recommendation
}

export function PlanCard({ plan }: Props) {
  const stats = [
    {
      icon: <Target className="h-4 w-4" />,
      label: "Target weight",
      value: `${plan.target_weight} kg`,
    },
    {
      icon: <Zap className="h-4 w-4" />,
      label: "Daily calories",
      value: `${plan.calories.toLocaleString()} kcal`,
    },
    {
      icon: <TrendingUp className="h-4 w-4" />,
      label: "Rate",
      value:
        plan.rate > 0
          ? `${plan.rate} kg/week`
          : "Maintenance",
    },
    {
      icon: <CalendarClock className="h-4 w-4" />,
      label: "Estimated time",
      value:
        plan.weeks > 0
          ? `${plan.weeks} weeks`
          : "On track",
    },
  ]

  return (
    <Card className="animate-fade-up space-y-4 border-primary/30 bg-gradient-to-br from-primary/10 to-surface/40">

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted">
            Recommended plan
          </p>

          <p className="mt-0.5 text-2xl font-bold tracking-tight">
            {plan.goal === "gain"
              ? "Gain Weight"
              : plan.goal === "loss"
                ? "Lose Weight"
                : "Maintain Weight"}
          </p>
        </div>

        <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          Auto
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">

        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-surface/70 p-3"
          >
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted">
              {stat.icon}
              {stat.label}
            </span>

            <p className="mt-1 text-base font-bold tabular-nums text-foreground">
              {stat.value}
            </p>
          </div>
        ))}

      </div>
    </Card>
  )
}