import { ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { MacroDonut } from "@/components/results/MacroDonut"
import type { HealthPlanResponse } from "@/lib/types"

interface Props {
  data: HealthPlanResponse
}

export function FinalDashboard({ data }: Props) {
  const { recommendation, macros } = data

  const difference =
    Math.round(
      (recommendation.target_weight -
        recommendation.current_weight) *
        10,
    ) / 10

  const differenceLabel =
    difference === 0
      ? "Maintain"
      : `${difference > 0 ? "+" : ""}${difference} kg`

  return (
    <Card className="animate-pop-in space-y-6 border-primary/30">

      {/* Header */}

      <div className="flex items-center justify-between gap-3">

        <h2 className="text-lg font-bold">
          Your updated plan
        </h2>

        <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
          {differenceLabel}
        </span>

      </div>


      {/* Weight journey */}

      <div className="flex items-center justify-between rounded-3xl bg-surface-raised p-5">

        <div className="text-center">

          <p className="text-xs font-medium text-muted">
            Current
          </p>

          <p className="mt-1 text-2xl font-bold tabular-nums">
            {recommendation.current_weight}

            <span className="text-sm font-medium text-muted">
              {" "}kg
            </span>
          </p>

        </div>


        <ArrowRight className="h-5 w-5 shrink-0 text-primary" />


        <div className="text-center">

          <p className="text-xs font-medium text-muted">
            Target
          </p>

          <p className="mt-1 text-2xl font-bold tabular-nums text-primary">
            {recommendation.target_weight}

            <span className="text-sm font-medium text-muted">
              {" "}kg
            </span>
          </p>

        </div>

      </div>


      {/* Updated plan values */}

      <dl className="divide-y divide-border">

        <div className="flex items-center justify-between py-3">
          <dt className="text-sm text-muted">
            Goal
          </dt>

          <dd className="font-semibold capitalize">
            {recommendation.goal}
          </dd>
        </div>


        <div className="flex items-center justify-between py-3">
          <dt className="text-sm text-muted">
            Target BMI
          </dt>

          <dd className="font-semibold tabular-nums">
            {recommendation.target_bmi.toFixed(1)}
          </dd>
        </div>


        <div className="flex items-center justify-between py-3">
          <dt className="text-sm text-muted">
            Daily calorie target
          </dt>

          <dd className="font-semibold tabular-nums">
            {recommendation.calories.toLocaleString()} kcal
          </dd>
        </div>


        <div className="flex items-center justify-between py-3">
          <dt className="text-sm text-muted">
            Rate per week
          </dt>

          <dd className="font-semibold tabular-nums">
            {recommendation.rate} kg
          </dd>
        </div>


        <div className="flex items-center justify-between py-3">
          <dt className="text-sm text-muted">
            Estimated duration
          </dt>

          <dd className="font-semibold tabular-nums">
            {recommendation.weeks > 0
              ? `${recommendation.weeks} weeks`
              : "—"}
          </dd>
        </div>

      </dl>


      {/* Updated macros */}

      <MacroDonut
        macros={macros}
        dailyCalories={
          recommendation.calories
        }
      />

    </Card>
  )
}