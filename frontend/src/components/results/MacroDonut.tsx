import { useState } from "react"
import { Card } from "@/components/ui/Card"
import { cn } from "@/lib/utils"
import type { Macros } from "@/lib/types"

interface Props {
  macros: Macros
  dailyCalories: number
}

const COLORS = {
  protein: "oklch(0.78 0.16 155)",
  carbs: "oklch(0.72 0.14 205)",
  fats: "oklch(0.8 0.14 85)",
}

type MacroPreset = "balanced" | "low_carb" | "low_fat" | "high_protein" | "custom"

type Distribution = {
  protein: number
  carbs: number
  fats: number
}

const PRESETS: { id: MacroPreset; label: string; values: Distribution }[] = [
  { id: "balanced", label: "Balanced", values: { protein: 25, carbs: 50, fats: 25 } },
  { id: "low_carb", label: "Low carb", values: { protein: 30, carbs: 45, fats: 25 } },
  { id: "low_fat", label: "Low fat", values: { protein: 30, carbs: 50, fats: 20 } },
  { id: "high_protein", label: "High protein", values: { protein: 35, carbs: 45, fats: 20 } },
  { id: "custom", label: "Custom", values: { protein: 25, carbs: 50, fats: 25 } },
]

export function MacroDonut({
  macros,
  dailyCalories,
}: Props) {
  const [preset, setPreset] = useState<MacroPreset>("balanced")
  const [distribution, setDistribution] = useState<Distribution>(
    PRESETS[0].values,
  )

  function selectPreset(nextPreset: MacroPreset) {
    setPreset(nextPreset)

    if (nextPreset !== "custom") {
      const selected = PRESETS.find((item) => item.id === nextPreset)
      if (selected) setDistribution(selected.values)
    }
  }

  function updateMacro(key: keyof Distribution, rawValue: number) {
    const limits = {
      protein: [20, 35],
      carbs: [30, 55],
      fats: [20, 35],
    } as const
    const [min, max] = limits[key]
    const value = Math.min(max, Math.max(min, rawValue))
    const otherKeys = (Object.keys(distribution) as (keyof Distribution)[])
      .filter((item) => item !== key)
    const remaining = 100 - value
    const first = otherKeys[0]
    const second = otherKeys[1]
    const firstShare = distribution[first] / (distribution[first] + distribution[second])
    const [firstMin, firstMax] = limits[first]
    const [secondMin, secondMax] = limits[second]
    const lowerBound = Math.max(firstMin, remaining - secondMax)
    const upperBound = Math.min(firstMax, remaining - secondMin)
    const firstValue = Math.min(
      upperBound,
      Math.max(lowerBound, Math.round(remaining * firstShare)),
    )

    setDistribution({
      ...distribution,
      [key]: value,
      [first]: firstValue,
      [second]: remaining - firstValue,
    })
    setPreset("custom")
  }

  const segments = [
    {
      key: "protein",
      label: "Protein",
      grams: (dailyCalories * distribution.protein) / 400,
      pct: distribution.protein,
      color: COLORS.protein,
    },
    {
      key: "carbs",
      label: "Carbs",
      grams: (dailyCalories * distribution.carbs) / 400,
      pct: distribution.carbs,
      color: COLORS.carbs,
    },
    {
      key: "fats",
      label: "Fats",
      grams: (dailyCalories * distribution.fats) / 900,
      pct: distribution.fats,
      color: COLORS.fats,
    },
  ]

  const radius = 60
  const circumference =
    2 * Math.PI * radius

  let offset = 0

  return (
    <Card className="animate-fade-up space-y-4">

      <div>
        <p className="text-sm font-medium text-muted">
          Macronutrients
        </p>

        <p className="mt-1 text-xs text-muted">
          Your daily macro distribution
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-muted">
          Macro preference
        </p>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {PRESETS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectPreset(item.id)}
              className={cn(
                "rounded-2xl border px-3 py-2 text-sm font-semibold transition-all",
                preset === item.id
                  ? "border-primary/70 bg-primary/10 text-primary"
                  : "border-border bg-surface text-muted hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {preset === "custom" && (
        <div className="space-y-4 rounded-3xl bg-surface-raised p-4">
          <p className="text-xs text-muted">
            Adjust one macro; the other two rebalance automatically to total 100%.
          </p>

          {(Object.keys(distribution) as (keyof Distribution)[]).map((key) => {
            const limits = {
              protein: [20, 35],
              carbs: [30, 55],
              fats: [20, 35],
            } as const
            const [min, max] = limits[key]
            return (
              <label key={key} className="block space-y-1.5">
                <span className="flex justify-between text-sm capitalize">
                  {key}<strong>{distribution[key]}%</strong>
                </span>
                <input
                  className="w-full accent-[var(--color-primary)]"
                  type="range"
                  min={min}
                  max={max}
                  step="1"
                  value={distribution[key]}
                  onChange={(event) => updateMacro(key, Number(event.target.value))}
                />
              </label>
            )
          })}
        </div>
      )}


      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">

        {/* DONUT */}

        <div className="relative shrink-0">

          <svg
            width="144"
            height="144"
            viewBox="0 0 160 160"
            className="-rotate-90"
          >

            {/* Background */}

            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="var(--color-surface-raised)"
              strokeWidth="18"
            />


            {/* Macro segments */}

            {segments.map((segment) => {

              const length =
                (segment.pct / 100) *
                circumference

              const dash = `${length} ${
                circumference - length
              }`

              const element = (
                <circle
                  key={segment.key}
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="18"
                  strokeDasharray={dash}
                  strokeDashoffset={
                    -offset
                  }
                  strokeLinecap="round"
                  style={{
                    transition:
                      "stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease",
                  }}
                />
              )

              offset += length

              return element
            })}

          </svg>


          {/* CENTER */}

          <div className="absolute inset-0 flex flex-col items-center justify-center">

            <span className="text-2xl font-bold tabular-nums leading-none">
              {dailyCalories.toLocaleString()}
            </span>

            <span className="mt-1 text-xs text-muted">
              kcal / day
            </span>

          </div>

        </div>


        {/* VALUES */}

        <ul className="w-full flex-1 space-y-2.5">

          {segments.map((segment) => (
            <li
              key={segment.key}
              className="flex items-center justify-between rounded-2xl bg-surface-raised px-3 py-2.5"
            >

              <span className="flex items-center gap-2.5">

                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor:
                      segment.color,
                  }}
                />

                <span className="font-medium">
                  {segment.label}
                </span>

              </span>


              <span className="flex items-baseline gap-2">

                <span className="font-bold tabular-nums">
                  {segment.grams.toFixed(1)} g
                </span>

                <span className="text-sm text-muted">
                  {segment.pct}%
                </span>

              </span>

            </li>
          ))}

        </ul>

      </div>

    </Card>
  )
}
