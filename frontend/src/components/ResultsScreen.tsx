import { useEffect, useRef } from "react"
import { RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { BmiMeter } from "@/components/results/BmiMeter"
import { EnergyCards } from "@/components/results/EnergyCards"
import { PlanCard } from "@/components/results/PlanCard"
import { MacroDonut } from "@/components/results/MacroDonut"
import { CustomizeSection } from "@/components/results/CustomizeSection"
import { FinalDashboard } from "@/components/results/FinalDashboard"

import type {
  Goal,
  HealthPlanResponse,
  MacroPreset,
} from "@/lib/types"

interface Props {
  data: HealthPlanResponse
  customized: HealthPlanResponse | null
  customizing: boolean
  planUpdated: boolean
  height: number

  onCustomize: (
    goal: Goal,
    targetWeight: number,
    rate: number,
    macroPreset: MacroPreset,
    customCarbs?: number,
    customProtein?: number,
    customFats?: number,
  ) => void

  onStartOver: () => void
}


// ---------------------------------------------------------
// PERSONALIZED NEXT STEPS
// ---------------------------------------------------------

function getNextSteps(category: string) {
  const normalizedCategory =
    category.toLowerCase()

  if (
    normalizedCategory.includes("underweight")
  ) {
    return [
      {
        emoji: "🍳",
        text: "Prioritize protein",
      },
      {
        emoji: "🍚",
        text: "Add nutrient-rich calories",
      },
      {
        emoji: "🥜",
        text: "Don't skip meals",
      },
      {
        emoji: "🏋️",
        text: "Focus on strength training",
      },
      {
        emoji: "😴",
        text: "Give your body time to recover",
      },
    ]
  }

  if (
    normalizedCategory.includes("normal")
  ) {
    return [
      {
        emoji: "🥗",
        text: "Keep your meals balanced",
      },
      {
        emoji: "💧",
        text: "Stay well hydrated",
      },
      {
        emoji: "🏃",
        text: "Keep moving every day",
      },
      {
        emoji: "🥦",
        text: "Choose whole foods often",
      },
      {
        emoji: "😴",
        text: "Prioritize quality sleep",
      },
    ]
  }

  if (
    normalizedCategory.includes("overweight")
  ) {
    return [
      {
        emoji: "🥗",
        text: "Choose protein and fiber-rich foods",
      },
      {
        emoji: "🍽️",
        text: "Keep portions in check",
      },
      {
        emoji: "🚶",
        text: "Add more daily movement",
      },
      {
        emoji: "💧",
        text: "Choose water over sugary drinks",
      },
      {
        emoji: "📈",
        text: "Focus on steady progress",
      },
    ]
  }

  if (
    normalizedCategory.includes("obese") ||
    normalizedCategory.includes("obesity")
  ) {
    return [
      {
        emoji: "🥗",
        text: "Focus on nutrient-rich foods",
      },
      {
        emoji: "🍳",
        text: "Prioritize protein and fiber",
      },
      {
        emoji: "🚶",
        text: "Build activity gradually",
      },
      {
        emoji: "💧",
        text: "Make water your main drink",
      },
      {
        emoji: "📈",
        text: "Aim for steady progress",
      },
    ]
  }

  return [
    {
      emoji: "🥗",
      text: "Keep your meals balanced",
    },
    {
      emoji: "💧",
      text: "Stay well hydrated",
    },
    {
      emoji: "🏃",
      text: "Stay active throughout the day",
    },
    {
      emoji: "🥦",
      text: "Choose nutritious whole foods",
    },
    {
      emoji: "😴",
      text: "Prioritize quality sleep",
    },
  ]
}


// ---------------------------------------------------------
// BMI INSIGHT
// ---------------------------------------------------------

function getBmiInsight(category: string) {
  const normalizedCategory =
    category.toLowerCase()

  if (
    normalizedCategory.includes("underweight")
  ) {
    return {
      emoji: "🌱",
      title: "Build toward a healthier range",
      text:
        "Focus on steady weight gain with nutritious foods, enough protein, and strength-focused activity.",
    }
  }

  if (
    normalizedCategory.includes("normal")
  ) {
    return {
      emoji: "✨",
      title: "You're in a healthy range",
      text:
        "Your BMI is within the healthy range. Focus on maintaining consistent nutrition, activity, and recovery habits.",
    }
  }

  if (
    normalizedCategory.includes("overweight")
  ) {
    return {
      emoji: "🎯",
      title: "Small progress can help",
      text:
        "Gradual weight loss and consistent daily habits can help move you toward a healthier BMI range.",
    }
  }

  if (
    normalizedCategory.includes("obese") ||
    normalizedCategory.includes("obesity")
  ) {
    return {
      emoji: "🌿",
      title: "Focus on steady progress",
      text:
        "Small and sustainable changes in nutrition, activity, and routine can make a meaningful difference.",
    }
  }

  return {
    emoji: "✨",
    title: "Keep building healthy habits",
    text:
      "Use your personalized plan as a guide for consistent and sustainable progress.",
  }
}


export function ResultsScreen({
  data,
  customized,
  customizing,
  planUpdated,
  height,
  onCustomize,
  onStartOver,
}: Props) {
  const currentWeight = Number(
    data.bmi.current_weight ??
      data.recommendation.current_weight,
  )

  const currentTargetWeight = Number(
    data.recommendation.target_weight,
  )

  const currentRate = Number(
    data.recommendation.rate,
  )

  const customizedSectionRef =
    useRef<HTMLElement>(null)

  const nextSteps = getNextSteps(
    data.bmi.category,
  )

  const bmiInsight = getBmiInsight(
    data.bmi.category,
  )


  // ---------------------------------------------------------
  // SMOOTH SCROLL AFTER PLAN UPDATE
  // ---------------------------------------------------------

  useEffect(() => {
    if (!customized || !planUpdated) {
      return
    }

    const timer = setTimeout(() => {
      const target =
        customizedSectionRef.current

      if (!target) {
        return
      }

      const startPosition =
        window.scrollY

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        24

      const distance =
        targetPosition - startPosition

      const duration = 900
      let startTime: number | null = null

      function easeInOutCubic(
        progress: number,
      ) {
        return progress < 0.5
          ? 4 *
              progress *
              progress *
              progress
          : 1 -
              Math.pow(
                -2 * progress + 2,
                3,
              ) /
                2
      }

      function scroll(
        currentTime: number,
      ) {
        if (startTime === null) {
          startTime = currentTime
        }

        const elapsed =
          currentTime - startTime

        const progress =
          Math.min(
            elapsed / duration,
            1,
          )

        window.scrollTo(
          0,
          startPosition +
            distance *
              easeInOutCubic(progress),
        )

        if (progress < 1) {
          requestAnimationFrame(scroll)
        }
      }

      requestAnimationFrame(scroll)
    }, 150)

    return () => clearTimeout(timer)
  }, [customized, planUpdated])


  return (
    <div className="mx-auto w-full max-w-[1280px] space-y-8 pb-4">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex items-start justify-between gap-4">

        <div>
          <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            Your health plan
          </h1>

          <p className="text-muted">
            Here&apos;s your personalized breakdown.
          </p>
        </div>

        <Button
          variant="ghost"
          size="md"
          onClick={onStartOver}
        >
          <RotateCcw className="h-4 w-4" />

          <span className="hidden sm:inline">
            Start over
          </span>
        </Button>

      </div>


      {/* ================================================= */}
      {/* DEFAULT CALCULATION */}
      {/* ================================================= */}

      <section className="space-y-6">

        <div>
          <h2 className="text-lg font-bold">
            Default calculation
          </h2>

          <p className="text-sm text-muted">
            Your automatically calculated health plan.
          </p>
        </div>


        {/* ================================================= */}
        {/* BMI + BMI INSIGHT */}
        {/* ================================================= */}

        <div className="grid gap-5 lg:grid-cols-[minmax(0,72fr)_minmax(260px,28fr)] lg:items-stretch">

          {/* BMI */}

          <div className="min-w-0">

            <BmiMeter
              bmi={data.bmi}
            />

          </div>


          {/* BMI INSIGHT */}

          <div className="min-w-0">

            <div className="flex h-full flex-col justify-center rounded-3xl border border-primary/15 bg-surface-raised p-5">

              <div className="flex items-start gap-3">

                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-surface text-lg">
                  {bmiInsight.emoji}
                </span>

                <div className="min-w-0">

                  <h3 className="text-base font-bold leading-6">
                    {bmiInsight.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted">
                    {bmiInsight.text}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ================================================= */}
        {/* BMR / TDEE */}
        {/* ================================================= */}

        <div className="w-full">

          <EnergyCards
            energy={data.body_energy}
          />

        </div>


        {/* ================================================= */}
        {/* PLAN + MACROS / NEXT STEPS */}
        {/* ================================================= */}

        <div className="space-y-5">

          <PlanCard
            plan={data.recommendation}
          />

          <div className="grid gap-5 lg:grid-cols-[minmax(0,65fr)_minmax(300px,35fr)] lg:items-stretch">

            <div className="min-w-0">

              <MacroDonut
                macros={data.macros}
                dailyCalories={
                  data.recommendation.calories
                }
              />

            </div>


            <div className="min-w-0">

              <div className="flex h-full flex-col rounded-3xl border border-primary/15 bg-surface-raised p-4">

                <div className="mb-0.5">

                  <h2 className="text-lg font-bold">
                    Your Next Steps ✨
                  </h2>

                  <p className="mt-1 text-sm leading-5 text-muted">
                    Simple habits to support your health goals.
                  </p>

                </div>


                <div className="flex flex-1 flex-col justify-between gap-3 lg:gap-2">

                  {nextSteps.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="flex min-h-[50px] items-center gap-3 rounded-2xl bg-surface px-3 py-2.5 lg:min-h-[42px] lg:gap-2.5 lg:px-2.5 lg:py-2"
                      >

                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-raised text-lg lg:h-8 lg:w-8 lg:text-base">
                          {item.emoji}
                        </span>

                        <span className="text-sm font-medium leading-5">
                          {item.text}
                        </span>

                      </div>
                    ),
                  )}

                </div>

              </div>

            </div>

          </div>

        </div>


      {/* ================================================= */}
      {/* SET YOUR GOAL */}
      {/* ================================================= */}

      <div className="w-full">

        <CustomizeSection
          currentWeight={currentWeight}
          height={height}
          currentTargetWeight={
            currentTargetWeight
          }
          currentRate={currentRate}
          loading={customizing}
          updated={planUpdated}
          onUpdate={onCustomize}
        />

      </div>
      
    </section>


      {/* ================================================= */}
      {/* CUSTOMIZED CALCULATION */}
      {/* ================================================= */}

      {customized && (

        <section
          ref={customizedSectionRef}
          className="space-y-5"
        >

          <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

          <div>
            <h2 className="text-lg font-bold">
              Customized calculation
            </h2>

            <p className="text-sm text-muted">
              Updated results based on your selected
              target and nutrition preferences.
            </p>
          </div>

          <FinalDashboard
            data={customized}
          />

        </section>

      )}

    </div>
  )
}