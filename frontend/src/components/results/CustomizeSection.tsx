import { useEffect, useMemo, useState } from "react"
import {
  Sliders,
  Loader2,
  Lock,
} from "lucide-react"

import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { NumberField } from "@/components/ui/NumberField"
import { cn } from "@/lib/utils"

import type {
  Goal,
  MacroPreset,
} from "@/lib/types"


interface Props {
  currentWeight: number
  height: number
  currentTargetWeight: number
  currentRate: number
  loading: boolean
  updated: boolean

  onUpdate: (
    goal: Goal,
    targetWeight: number,
    rate: number,
    macroPreset: MacroPreset,
    customCarbs?: number,
    customProtein?: number,
    customFats?: number,
  ) => void
}


const RATE_PRESETS = [
  0.25,
  0.5,
  0.75,
]


const MACRO_PRESETS: {
  id: MacroPreset
  name: string
  description: string
  protein: number
  carbs: number
  fats: number
}[] = [
  {
    id: "balanced",
    name: "Balanced",
    description:
      "50% carbs · 25% protein · 25% fat",
    protein: 25,
    carbs: 50,
    fats: 25,
  },

  {
    id: "high_protein",
    name: "High Protein",
    description:
      "45% carbs · 35% protein · 20% fat",
    protein: 35,
    carbs: 45,
    fats: 20,
  },

  {
    id: "low_carb",
    name: "Low Carb",
    description:
      "45% carbs · 30% protein · 25% fat",
    protein: 30,
    carbs: 45,
    fats: 25,
  },

  {
    id: "low_fat",
    name: "Low Fat",
    description:
      "50% carbs · 30% protein · 20% fat",
    protein: 30,
    carbs: 50,
    fats: 20,
  },

  {
    id: "custom",
    name: "Custom",
    description:
      "Adjust your own macro split",
    protein: 25,
    carbs: 50,
    fats: 25,
  },
]


export function CustomizeSection({
  currentWeight,
  height,
  currentTargetWeight,
  currentRate,
  loading,
  updated,
  onUpdate,
}: Props) {


  /* -------------------------------------------------- */
  /* HEALTHY WEIGHT RANGE */
  /* -------------------------------------------------- */

  const healthyMin =
    18.5 *
    Math.pow(height / 100, 2)

  const healthyMax =
    24.9 *
    Math.pow(height / 100, 2)


  /* -------------------------------------------------- */
  /* CURRENT BMI */
  /* -------------------------------------------------- */

  const currentBmi =
    height > 0
      ? currentWeight /
        Math.pow(height / 100, 2)
      : 0


  /* -------------------------------------------------- */
  /* GOAL RESTRICTIONS */
  /* -------------------------------------------------- */

  const isUnderweight =
    currentBmi > 0 &&
    currentBmi < 18.5

  const isOverweight =
    currentBmi >= 25

  const gainDisabled =
    isOverweight

  const lossDisabled =
    isUnderweight


  /* -------------------------------------------------- */
  /* INITIAL GOAL */
  /* -------------------------------------------------- */

  const initialGoal: Goal =
    currentTargetWeight > currentWeight
      ? "gain"
      : currentTargetWeight < currentWeight
        ? "loss"
        : "maintenance"


  const [goal, setGoal] =
    useState<Goal>(initialGoal)


  const [targetWeight, setTargetWeight] =
    useState(
      String(currentTargetWeight),
    )


  const [ratePreset, setRatePreset] =
    useState<number | "custom">(
      RATE_PRESETS.includes(currentRate)
        ? currentRate
        : "custom",
    )


  const [customRate, setCustomRate] =
    useState(
      currentRate > 0
        ? String(currentRate)
        : "0.5",
    )


  const [macroPreset, setMacroPreset] =
    useState<MacroPreset>("balanced")


  const [protein, setProtein] =
    useState(25)

  const [carbs, setCarbs] =
    useState(50)

  const [fats, setFats] =
    useState(25)


  /* -------------------------------------------------- */
  /* TARGET BMI */
  /* -------------------------------------------------- */

  const targetBmi = useMemo(() => {
    const target =
      Number(targetWeight)

    if (
      !Number.isFinite(target) ||
      target <= 0 ||
      height <= 0
    ) {
      return null
    }

    const heightM =
      height / 100

    return (
      Math.round(
        (target /
          (heightM * heightM)) *
          10,
      ) / 10
    )
  }, [
    targetWeight,
    height,
  ])


  /* -------------------------------------------------- */
  /* MACRO PRESET */
  /* -------------------------------------------------- */

  useEffect(() => {
    const preset =
      MACRO_PRESETS.find(
        (item) =>
          item.id === macroPreset,
      )

    if (
      !preset ||
      preset.id === "custom"
    ) {
      return
    }

    setProtein(
      preset.protein,
    )

    setCarbs(
      preset.carbs,
    )

    setFats(
      preset.fats,
    )
  }, [macroPreset])


  /* -------------------------------------------------- */
  /* GOAL SELECTION */
  /* -------------------------------------------------- */

  function handleGoalChange(
    nextGoal: Goal,
  ) {

    /* Prevent invalid goals */

    if (
      nextGoal === "gain" &&
      gainDisabled
    ) {
      return
    }

    if (
      nextGoal === "loss" &&
      lossDisabled
    ) {
      return
    }


    setGoal(nextGoal)


    /* Maintenance */

    if (
      nextGoal ===
      "maintenance"
    ) {
      setTargetWeight(
        String(
          Math.round(
            currentWeight * 10,
          ) / 10,
        ),
      )

      return
    }


    /* Gain */

    if (
      nextGoal === "gain"
    ) {
      const nextTarget =
        Math.min(
          healthyMax,
          Math.round(
            (currentWeight +
              0.5) *
              10,
          ) / 10,
        )

      setTargetWeight(
        String(nextTarget),
      )

      return
    }


    /* Loss */

    if (
      nextGoal === "loss"
    ) {
      const nextTarget =
        Math.max(
          healthyMin,
          Math.round(
            (currentWeight -
              0.5) *
              10,
          ) / 10,
        )

      setTargetWeight(
        String(nextTarget),
      )
    }
  }


  useEffect(() => {
  if (
    height <= 0 ||
    currentWeight <= 0
  ) {
    return
  }

  if (goal !== "maintenance") {
    return
  }

  const maintenanceTarget =
    Math.round(
      currentWeight * 10,
    ) / 10

  if (
    Number(targetWeight) !==
    maintenanceTarget
  ) {
    setTargetWeight(
      String(maintenanceTarget),
    )
  }
}, [
  goal,
  currentWeight,
  height,
  targetWeight,
])


  /* -------------------------------------------------- */
  /* MACRO PRESET SELECTION */
  /* -------------------------------------------------- */

  function selectPreset(
    preset: MacroPreset,
  ) {

    setMacroPreset(
      preset,
    )

    const selected =
      MACRO_PRESETS.find(
        (item) =>
          item.id === preset,
      )

    if (
      !selected ||
      preset === "custom"
    ) {
      return
    }

    setProtein(
      selected.protein,
    )

    setCarbs(
      selected.carbs,
    )

    setFats(
      selected.fats,
    )
  }


  /* -------------------------------------------------- */
  /* CUSTOM MACROS */
  /* -------------------------------------------------- */

  function updateMacro(
    key:
      | "protein"
      | "carbs"
      | "fats",
    value: number,
  ) {

    const limits = {
      protein: [20, 35],
      carbs: [30, 55],
      fats: [20, 35],
    } as const


    const current = {
      protein,
      carbs,
      fats,
    }


    const [min, max] =
      limits[key]


    const next =
      Math.min(
        max,
        Math.max(
          min,
          value,
        ),
      )


    const otherKeys =
      (
        Object.keys(
          current,
        ) as (
          keyof typeof current
        )[]
      ).filter(
        (item) =>
          item !== key,
      )


    const [first, second] =
      otherKeys


    const remaining =
      100 - next


    const ratio =
      current[first] /
      (
        current[first] +
        current[second]
      )


    const [
      firstMin,
      firstMax,
    ] =
      limits[first]


    const [
      secondMin,
      secondMax,
    ] =
      limits[second]


    const lower =
      Math.max(
        firstMin,
        remaining -
          secondMax,
      )


    const upper =
      Math.min(
        firstMax,
        remaining -
          secondMin,
      )


    const firstValue =
      Math.min(
        upper,
        Math.max(
          lower,
          Math.round(
            remaining *
              ratio,
          ),
        ),
      )


    const nextValues = {
      ...current,
      [key]: next,
      [first]:
        firstValue,
      [second]:
        remaining -
        firstValue,
    }


    setProtein(
      nextValues.protein,
    )

    setCarbs(
      nextValues.carbs,
    )

    setFats(
      nextValues.fats,
    )

    setMacroPreset(
      "custom",
    )
  }


  /* -------------------------------------------------- */
  /* VALIDATION */
  /* -------------------------------------------------- */

  const resolvedRate =
    ratePreset === "custom"
      ? Number(customRate)
      : ratePreset


  const targetNum =
    Number(targetWeight)


  const validNumber =
    Number.isFinite(
      targetNum,
    )


  const validRange =
    validNumber &&
    (
      goal === "gain"
        ? targetNum <=
          healthyMax
        : goal === "loss"
          ? targetNum >=
            healthyMin
          : true
    )


  const validGoal =
    goal === "gain"
      ? targetNum >
        currentWeight
      : goal === "loss"
        ? targetNum <
          currentWeight
        : targetNum ===
          currentWeight


  const validTarget =
    validRange &&
    validGoal


  const validRate =
    goal ===
    "maintenance"
      ? true
      : Number.isFinite(
          resolvedRate,
        ) &&
        resolvedRate > 0 &&
        resolvedRate <=
          0.75


  const validMacros =
    protein >= 20 &&
    protein <= 35 &&
    carbs >= 30 &&
    carbs <= 55 &&
    fats >= 20 &&
    fats <= 35 &&
    protein +
      carbs +
      fats ===
      100


  const valid =
    validTarget &&
    validRate &&
    validMacros


  /* -------------------------------------------------- */
  /* SUBMIT */
  /* -------------------------------------------------- */

  function handleUpdate() {

    if (
      !valid ||
      loading
    ) {
      return
    }


    onUpdate(
      goal,
      targetNum,
      resolvedRate,
      macroPreset,

      macroPreset ===
        "custom"
        ? carbs
        : undefined,

      macroPreset ===
        "custom"
        ? protein
        : undefined,

      macroPreset ===
        "custom"
        ? fats
        : undefined,
    )
  }


  /* -------------------------------------------------- */
  /* UI */
  /* -------------------------------------------------- */

  return (
    <Card className="w-full animate-fade-up space-y-6">


      {/* HEADER */}

      <div className="flex items-center gap-2.5">

        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-raised text-primary">

          <Sliders className="h-4 w-4" />

        </span>


        <div>

          <h2 className="text-lg font-bold">
            Set Your Goal
          </h2>

          <p className="text-sm text-muted">
            Customize your target and nutrition plan
          </p>

        </div>

      </div>


      {/* GOAL */}

      <div className="space-y-2.5">

        <span className="text-sm font-medium text-muted">
          Goal
        </span>


        <div className="grid grid-cols-3 gap-2">

          {(
            [
              [
                "gain",
                "Gain Weight",
                gainDisabled,
              ],

              [
                "loss",
                "Lose Weight",
                lossDisabled,
              ],

              [
                "maintenance",
                "Maintain",
                false,
              ],

            ] as const
          ).map(
            ([
              value,
              label,
              disabled,
            ]) => (

              <button
                key={value}
                type="button"
                disabled={disabled}
                aria-disabled={
                  disabled
                }
                onClick={() =>
                  handleGoalChange(
                    value,
                  )
                }
                className={cn(
                  "relative rounded-2xl border px-2 py-3 text-sm font-semibold transition-all",

                  disabled
                    ? "cursor-not-allowed border-border bg-surface-raised text-muted/40 opacity-60"
                    : goal === value
                      ? "border-primary/70 bg-primary/10 text-primary"
                      : "border-border bg-surface text-muted hover:text-foreground",
                )}
              >

                <span
                  className={cn(
                    "flex items-center justify-center gap-1.5",
                  )}
                >

                  {disabled && (
                    <Lock
                      className="h-3 w-3"
                      aria-hidden
                    />
                  )}

                  {label}

                </span>


                {disabled && (
                  <span className="mt-1 block text-[9px] font-medium opacity-70">
                    Not recommended
                  </span>
                )}

              </button>

            ),
          )}

        </div>


        {isUnderweight && (
          <p className="text-xs text-muted">
            💡 Weight loss is not recommended while you are underweight.
          </p>
        )}


        {isOverweight && (
          <p className="text-xs text-muted">
            💡 Weight gain is not recommended while you are above the healthy BMI range.
          </p>
        )}

      </div>


      {/* TARGET WEIGHT */}

      <div className="space-y-2">

        <NumberField
          label="Target weight"
          unit="kg"

          min={
            goal === "loss"
              ? healthyMin
              : currentWeight
          }

          max={
            goal === "gain"
              ? healthyMax
              : currentWeight
          }

          step={0.1}

          value={
            targetWeight
          }

          onChange={(e) =>
            setTargetWeight(
              e.target.value,
            )
          }
        />


        {targetBmi !== null && (

          <div className="rounded-2xl bg-surface-raised px-4 py-3">

            <span className="text-sm text-muted">
              Target BMI
            </span>

            <span className="ml-2 font-bold text-primary">
              {targetBmi.toFixed(1)}
            </span>

          </div>

        )}


        <p className="text-xs text-muted">

          Safe target range:{" "}

          {healthyMin.toFixed(1)}

          –

          {healthyMax.toFixed(1)}

          {" "}kg

        </p>

      </div>


      {/* RATE */}

      {goal !== "maintenance" && (

        <div className="space-y-3">

          <div className="flex items-center justify-between">

            <span className="text-sm font-medium text-muted">
              Weight change rate
            </span>

            <span className="text-xs text-muted">
              Maximum 0.75 kg/week
            </span>

          </div>


          <div className="grid grid-cols-4 gap-2">

            {RATE_PRESETS.map(
              (rate) => (

                <button
                  key={rate}
                  type="button"
                  onClick={() =>
                    setRatePreset(
                      rate,
                    )
                  }

                  className={cn(
                    "rounded-2xl border px-2 py-3 text-sm font-semibold transition-all",

                    ratePreset ===
                      rate
                      ? "border-primary/70 bg-primary/10 text-primary"
                      : "border-border bg-surface text-muted hover:text-foreground",
                  )}
                >

                  {rate}

                  <span className="block text-[10px] font-medium opacity-70">
                    kg/wk
                  </span>


                  {rate ===
                    0.75 && (

                    <span className="mt-1 block text-[9px] text-amber-600">
                      Not recommended
                    </span>

                  )}

                </button>

              ),
            )}


            <button
              type="button"
              onClick={() =>
                setRatePreset(
                  "custom",
                )
              }

              className={cn(
                "rounded-2xl border px-2 py-3 text-sm font-semibold transition-all",

                ratePreset ===
                  "custom"
                  ? "border-primary/70 bg-primary/10 text-primary"
                  : "border-border bg-surface text-muted hover:text-foreground",
              )}
            >

              Custom

              <span className="block text-[10px] font-medium opacity-70">
                kg/wk
              </span>

            </button>

          </div>


          {ratePreset ===
            "custom" && (

            <NumberField
              label="Custom rate"
              unit="kg/wk"
              step={0.05}
              min={0.05}
              max={0.75}
              value={
                customRate
              }
              onChange={(e) =>
                setCustomRate(
                  e.target.value,
                )
              }
            />

          )}

        </div>

      )}


      


      {/* CUSTOM MACROS */}

      {macroPreset ===
        "custom" && (

        <div className="space-y-5 rounded-3xl bg-surface-raised p-5">

          <div>

            <h3 className="font-semibold">
              Adjust your macros
            </h3>

            <p className="mt-1 text-xs text-muted">
              Adjust one macro and the others automatically rebalance to keep the total at 100%.
            </p>

          </div>


          {/* PROTEIN */}

          <div className="space-y-2">

            <div className="flex justify-between text-sm">

              <span>
                Protein
              </span>

              <strong>
                {protein}%
              </strong>

            </div>


            <input
              type="range"
              min="20"
              max="35"
              step="1"
              value={
                protein
              }

              onChange={(e) =>
                updateMacro(
                  "protein",
                  Number(
                    e.target.value,
                  ),
                )
              }

              className="w-full accent-[var(--color-primary)]"
            />

          </div>


          {/* CARBS */}

          <div className="space-y-2">

            <div className="flex justify-between text-sm">

              <span>
                Carbs
              </span>

              <strong>
                {carbs}%
              </strong>

            </div>


            <input
              type="range"
              min="30"
              max="55"
              step="1"
              value={
                carbs
              }

              onChange={(e) =>
                updateMacro(
                  "carbs",
                  Number(
                    e.target.value,
                  ),
                )
              }

              className="w-full accent-[var(--color-primary)]"
            />

          </div>


          {/* FATS */}

          <div className="space-y-2">

            <div className="flex justify-between text-sm">

              <span>
                Fats
              </span>

              <strong>
                {fats}%
              </strong>

            </div>


            <input
              type="range"
              min="20"
              max="35"
              step="1"
              value={
                fats
              }

              onChange={(e) =>
                updateMacro(
                  "fats",
                  Number(
                    e.target.value,
                  ),
                )
              }

              className="w-full accent-[var(--color-primary)]"
            />

          </div>


          {/* TOTAL */}

          <div className="flex justify-between rounded-2xl bg-surface px-4 py-3 text-sm font-semibold">

            <span>
              Total
            </span>

            <span>
              {
                protein +
                carbs +
                fats
              }%
            </span>

          </div>

        </div>

      )}


      {/* UPDATE BUTTON */}

      <Button
        type="button"

        className={cn(
          "w-full",

          valid &&
            !loading &&
            "cursor-pointer",
        )}

        size="lg"

        disabled={
          !valid ||
          loading
        }

        onClick={
          handleUpdate
        }
      >

        {loading ? (
          <>

            <Loader2 className="h-5 w-5 animate-spin" />

            Updating…

          </>
        ) : updated ? (
          "Plan Updated ✓"
        ) : (
          "Update My Plan"
        )}

      </Button>

    </Card>
  )
}