import { useState } from "react"

import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from "lucide-react"

import { BrandHeader } from "@/components/BrandHeader"
import { Stepper } from "@/components/Stepper"
import { Button } from "@/components/ui/Button"

import {
  PersonalDetailsStep,
  type PersonalDetails,
} from "@/components/steps/PersonalDetailsStep"

import { ActivityStep } from "@/components/steps/ActivityStep"
import { ResultsScreen } from "@/components/ResultsScreen"

import {
  LoadingState,
  ErrorState,
} from "@/components/results/StateViews"

import {
  calculatePlan,
  customizePlan,
  ApiError,
} from "@/services/healthApi"

import type {
  ActivityLevel,
  CalculateRequest,
  HealthPlanResponse,
  Goal,
  MacroPreset,
} from "@/lib/types"


type Phase =
  | "form"
  | "loading"
  | "results"
  | "error"


const STEPS = [
  "Details",
  "Activity",
  "Calculate",
]


const EMPTY_DETAILS: PersonalDetails = {
  age: "",
  gender: null,
  height: "",
  weight: "",
}


export default function App() {

  const [phase, setPhase] =
    useState<Phase>("form")


  const [step, setStep] =
    useState(0)


  const [details, setDetails] =
    useState<PersonalDetails>(
      EMPTY_DETAILS,
    )


  const [activity, setActivity] =
    useState<ActivityLevel | null>(null)


  const [errors, setErrors] =
    useState<
      Partial<
        Record<
          keyof PersonalDetails | "activity",
          string
        >
      >
    >({})


  const [result, setResult] =
    useState<HealthPlanResponse | null>(null)


  const [customized, setCustomized] =
    useState<HealthPlanResponse | null>(null)


  const [customizing, setCustomizing] =
    useState(false)
  
  const [planUpdated, setPlanUpdated] =
    useState(false)

  const [errorMessage, setErrorMessage] =
    useState("")


  /* -------------------------------------------------- */
  /* VALIDATION */
  /* -------------------------------------------------- */

  function validateDetails() {

    const next: typeof errors = {}

    const age =
      Number(details.age)

    const height =
      Number(details.height)

    const weight =
      Number(details.weight)


    if (!details.gender) {

      next.gender =
        "Please select your gender."

    }


    if (
      !details.age ||
      age < 2 ||
      age > 120
    ) {

      next.age =
        "Enter an age between 2 and 120."

    }


    if (
      !details.height ||
      height < 50 ||
      height > 260
    ) {

      next.height =
        "Enter a height between 50 and 260 cm."

    }


    if (
      !details.weight ||
      weight < 20 ||
      weight > 400
    ) {

      next.weight =
        "Enter a weight between 20 and 400 kg."

    }


    setErrors(next)

    return Object.keys(next).length === 0
  }


  const detailsComplete =
    !!details.gender &&
    !!details.age &&
    !!details.height &&
    !!details.weight


  /* -------------------------------------------------- */
  /* NAVIGATION */
  /* -------------------------------------------------- */

  function handleNext() {

    if (step === 0) {

      if (validateDetails()) {

        setStep(1)

      }

    }

  }


  function handleBack() {

    setErrors({})

    if (step > 0) {

      setStep(step - 1)

    }

  }


  /* -------------------------------------------------- */
  /* DEFAULT CALCULATION */
  /* -------------------------------------------------- */

  async function handleCalculate() {

    if (!activity) {

      setErrors((current) => ({
        ...current,
        activity:
          "Please choose an activity level.",
      }))

      return
    }


    if (!details.gender) {

      return

    }


    const payload: CalculateRequest = {

      age:
        Number(details.age),

      gender:
        details.gender,

      height:
        Number(details.height),

      weight:
        Number(details.weight),

      activity_level:
        activity,

    }


    setPhase("loading")


    try {

      const data =
        await calculatePlan(payload)


      setResult(data)

      setCustomized(null)

      setPhase("results")

    } catch (err) {

      setErrorMessage(
        err instanceof ApiError
          ? err.message
          : "An unexpected error occurred. Please try again.",
      )

      setPhase("error")

    }

  }


  /* -------------------------------------------------- */
  /* CUSTOM CALCULATION */
  /* -------------------------------------------------- */

  async function handleCustomize(
    goal: Goal,
    targetWeight: number,
    rate: number,
    macroPreset: MacroPreset,
    customCarbs?: number,
    customProtein?: number,
    customFats?: number,
  ) {

    if (
      !result ||
      !details.gender ||
      !activity
    ) {

      return

    }


    setCustomizing(true)


    try {

      const data =
        await customizePlan({

          age:
            Number(details.age),

          gender:
            details.gender,

          height:
            Number(details.height),

          weight:
            Number(details.weight),

          activity_level:
            activity,

          goal,

          target_weight:
            targetWeight,

          rate,

          macro_preset:
            macroPreset,

          custom_carbs:
            macroPreset === "custom"
              ? customCarbs
              : undefined,

          custom_protein:
            macroPreset === "custom"
              ? customProtein
              : undefined,

          custom_fats:
            macroPreset === "custom"
              ? customFats
              : undefined,

        })


      setCustomized(data)
      setPlanUpdated(true)

      setTimeout(() => {
        setPlanUpdated(false)
      }, 3000)

    } catch (err) {

      setErrorMessage(
        err instanceof ApiError
          ? err.message
          : "Couldn't update your plan. Please try again.",
      )

      setPhase("error")

    } finally {

      setCustomizing(false)

    }

  }


  /* -------------------------------------------------- */
  /* START OVER */
  /* -------------------------------------------------- */

  function startOver() {

    setDetails(EMPTY_DETAILS)

    setActivity(null)

    setErrors({})

    setResult(null)

    setCustomized(null)

    setStep(0)

    setPhase("form")

  }


  /* -------------------------------------------------- */
  /* RENDER */
  /* -------------------------------------------------- */

  return (

    <div className="relative min-h-dvh overflow-hidden">

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(60%_100%_at_50%_0%,var(--color-primary)/12%,transparent)]"
      />


      <main className="relative mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-6 px-4 py-6 sm:max-w-3xl sm:px-6 sm:py-10 lg:max-w-5xl lg:px-8">
        
        <BrandHeader />


        {/* LOADING */}

        {phase === "loading" && (
          <LoadingState />
        )}


        {/* ERROR */}

        {phase === "error" && (

          <ErrorState
            message={errorMessage}
            onRetry={() =>
              setPhase(
                result
                  ? "results"
                  : "form",
              )
            }
          />

        )}


        {/* RESULTS */}

        {phase === "results" &&
          result && (

            <ResultsScreen

              data={
                result
              }

              customized={
                customized
              }

              customizing={
                customizing
              }

              planUpdated={
                planUpdated
              }

              height={
                Number(details.height)
              }

              onCustomize={
                handleCustomize
              }

              onStartOver={
                startOver
              }

            />

          )}


        {/* FORM */}

        {phase === "form" && (

          <>

            <Stepper
              steps={STEPS}
              current={step}
            />


            <div className="flex-1">

              {step === 0 && (

                <PersonalDetailsStep

                  value={
                    details
                  }

                  onChange={(patch) =>
                    setDetails(
                      (current) => ({
                        ...current,
                        ...patch,
                      }),
                    )
                  }

                  errors={
                    errors
                  }

                />

              )}


              {step === 1 && (

                <ActivityStep

                  value={
                    activity
                  }

                  onChange={(level) => {

                    setActivity(level)

                    setErrors(
                      (current) => ({
                        ...current,
                        activity:
                          undefined,
                      }),
                    )

                  }}

                  error={
                    errors.activity
                  }

                />

              )}

            </div>


            {/* NAVIGATION */}

            <div className="sticky bottom-4 flex items-center gap-3">

              {step > 0 && (

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleBack}
                >

                  <ArrowLeft className="h-5 w-5" />

                  Back

                </Button>

              )}


              {step === 0 && (

                <Button
                  size="lg"
                  className="flex-1"
                  disabled={!detailsComplete}
                  onClick={handleNext}
                >

                  Continue

                  <ArrowRight className="h-5 w-5" />

                </Button>

              )}


              {step === 1 && (

                <Button
                  size="lg"
                  className="flex-1"
                  disabled={!activity}
                  onClick={
                    handleCalculate
                  }
                >

                  <Sparkles className="h-5 w-5" />

                  Calculate My Plan

                </Button>

              )}

            </div>

          </>

        )}

      </main>

    </div>

  )

}