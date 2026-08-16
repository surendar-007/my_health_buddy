import { Flame, Activity } from "lucide-react"
import { Card } from "@/components/ui/Card"
import type { EnergyResult } from "@/lib/types"

interface Props {
  energy: EnergyResult
}

export function EnergyCards({ energy }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">

      {/* BMR */}

      <Card className="animate-fade-up space-y-3 lg:min-h-[168px] lg:space-y-0">

        {/* Mobile layout */}

        <div className="lg:hidden">

          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/15 text-accent">
            <Flame className="h-5 w-5" />
          </span>

          <div className="mt-3">

            <p className="text-sm font-medium text-muted">
              BMR
            </p>

            <p className="text-2xl font-bold tabular-nums">
              {energy.bmr.toLocaleString()}

              <span className="ml-1 text-sm font-medium text-muted">
                kcal
              </span>
            </p>

            <p className="mt-1 text-xs text-muted">
              Energy your body needs at complete rest.
            </p>

          </div>

        </div>


        {/* Laptop layout */}

        <div className="hidden h-full lg:flex lg:items-center lg:justify-between lg:gap-6">

          <div className="flex items-center gap-4">

            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent">
              <Flame className="h-6 w-6" />
            </span>

            <div>

              <p className="text-base font-semibold text-muted">
                BMR
              </p>

              <p className="mt-1 max-w-[220px] text-sm leading-5 text-muted">
                Energy your body needs at complete rest.
              </p>

            </div>

          </div>

          <p className="shrink-0 text-right text-4xl font-bold tabular-nums">

            {energy.bmr.toLocaleString()}

            <span className="ml-1 text-base font-medium text-muted">
              kcal
            </span>

          </p>

        </div>

      </Card>


      {/* TDEE */}

      <Card className="animate-fade-up space-y-3 lg:min-h-[168px] lg:space-y-0">

        {/* Mobile layout */}

        <div className="lg:hidden">

          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Activity className="h-5 w-5" />
          </span>

          <div className="mt-3">

            <p className="text-sm font-medium text-muted">
              TDEE
            </p>

            <p className="text-2xl font-bold tabular-nums">
              {energy.tdee.toLocaleString()}

              <span className="ml-1 text-sm font-medium text-muted">
                kcal
              </span>
            </p>

            <p className="mt-1 text-xs text-muted">
              Energy your body needs each day, including daily activity.
            </p>

          </div>

        </div>


        {/* Laptop layout */}

        <div className="hidden h-full lg:flex lg:items-center lg:justify-between lg:gap-6">

          <div className="flex items-center gap-4">

            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <Activity className="h-6 w-6" />
            </span>

            <div>

              <p className="text-base font-semibold text-muted">
                TDEE
              </p>

              <p className="mt-1 max-w-[220px] text-sm leading-5 text-muted">
                Energy your body needs each day, including daily activity.
              </p>

            </div>

          </div>

          <p className="shrink-0 text-right text-4xl font-bold tabular-nums">

            {energy.tdee.toLocaleString()}

            <span className="ml-1 text-base font-medium text-muted">
              kcal
            </span>

          </p>

        </div>

      </Card>

    </div>
  )
}