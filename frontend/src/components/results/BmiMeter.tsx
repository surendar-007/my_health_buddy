import { useEffect, useState } from "react"
import { Card } from "@/components/ui/Card"
import type { BmiResult } from "@/lib/types"

interface Props {
  bmi: BmiResult
}

// BMI display scale
const MIN_BMI = 15
const MAX_BMI = 40

const SEGMENTS = [
  {
    label: "Underweight",
    from: MIN_BMI,
    to: 18.5,
    color: "oklch(0.72 0.14 205)",
  },
  {
    label: "Normal",
    from: 18.5,
    to: 25,
    color: "oklch(0.78 0.16 155)",
  },
  {
    label: "Overweight",
    from: 25,
    to: 30,
    color: "oklch(0.8 0.14 85)",
  },
  {
    label: "Obesity",
    from: 30,
    to: MAX_BMI,
    color: "oklch(0.68 0.19 25)",
  },
]

export function BmiMeter({ bmi }: Props) {
  const [animatedBmi, setAnimatedBmi] = useState(MIN_BMI)

  // Animate marker to BMI
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedBmi(bmi.value)
    }, 150)

    return () => clearTimeout(timer)
  }, [bmi.value])

  // Keep marker inside the scale
  const clamped = Math.min(
    Math.max(animatedBmi, MIN_BMI),
    MAX_BMI,
  )

  const markerPosition =
    ((clamped - MIN_BMI) / (MAX_BMI - MIN_BMI)) * 100

  // Build BMI color gradient
  const gradientStops = SEGMENTS.map((segment) => {
    const start =
      ((segment.from - MIN_BMI) /
        (MAX_BMI - MIN_BMI)) *
      100

    const end =
      ((segment.to - MIN_BMI) /
        (MAX_BMI - MIN_BMI)) *
      100

    return `${segment.color} ${start}%, ${segment.color} ${end}%`
  }).join(", ")

    const categoryColors: Record<string, string> = {
    Underweight: SEGMENTS[0].color,
    "Normal weight": SEGMENTS[1].color,
    Overweight: SEGMENTS[2].color,
    Obesity: SEGMENTS[3].color,
  }

  const categoryColor =
    categoryColors[bmi.category] ??
    "var(--color-primary)"

  return (
    <Card className="animate-fade-up space-y-5">
      {/* BMI heading */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted">
            Body Mass Index
          </p>

          <div className="mt-1 flex flex-wrap items-baseline gap-2">
            <span className="text-4xl font-bold tabular-nums tracking-tight">
              {bmi.value.toFixed(1)}
            </span>

            <span
              className="rounded-full bg-surface-raised px-3 py-1 text-sm font-semibold"
              style={{
                color: categoryColor,
              }}
            >
              {bmi.category}
            </span>
          </div>
        </div>
      </div>

      {/* BMI meter */}
      <div className="space-y-3">
        <div className="relative h-3 w-full rounded-full">
          {/* Color scale */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(to right, ${gradientStops})`,
            }}
          />

          {/* Animated marker */}
          <div
            className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-background bg-foreground shadow-lg"
            style={{
              left: `${markerPosition}%`,
              transition: "left 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
            aria-label={`BMI ${bmi.value.toFixed(1)}`}
          />
        </div>

        {/* BMI limits */}
        <div className="relative h-5 text-xs font-medium text-muted">
  <span className="absolute left-0">15</span>

  <span
    className="absolute -translate-x-1/2"
    style={{ left: "14%" }}
  >
    18.5
  </span>

  <span
    className="absolute -translate-x-1/2"
    style={{ left: "40%" }}
  >
    25
  </span>

  <span
    className="absolute -translate-x-1/2"
    style={{ left: "60%" }}
  >
    30
  </span>

  <span className="absolute right-0">40</span>
</div>
      </div>

      {/* BMI category guide */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {SEGMENTS.map((segment) => (
          <div
            key={segment.label}
            className="flex items-center gap-2 rounded-xl bg-surface-raised px-3 py-2"
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{
                backgroundColor: segment.color,
              }}
            />

            <span className="text-xs font-medium text-muted">
              {segment.label}
            </span>
          </div>
        ))}
      </div>

      {/* Healthy weight range */}
      <div className="rounded-2xl bg-surface-raised px-4 py-3 text-sm">
        <span className="text-muted">
          Healthy weight range:{" "}
        </span>

        <span className="font-semibold text-foreground">
          {bmi.healthy_weight_range.min}–
          {bmi.healthy_weight_range.max} kg
        </span>
      </div>
    </Card>
  )
}