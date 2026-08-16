// Shared frontend/backend types

export type Gender = "male" | "female"

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "high"
  | "active"
  | "very_active"

export type Goal =
  | "gain"
  | "loss"
  | "maintenance"

export type MacroPreset =
  | "balanced"
  | "high_protein"
  | "low_carb"
  | "low_fat"
  | "custom"


// ---------------------------------------------------------
// CALCULATE REQUEST
// ---------------------------------------------------------

export interface CalculateRequest {
  age: number
  gender: Gender
  height: number
  weight: number
  activity_level: ActivityLevel
}


// ---------------------------------------------------------
// CUSTOMIZE REQUEST
// ---------------------------------------------------------

export interface CustomizeRequest
  extends CalculateRequest {

  goal: Goal

  target_weight: number

  rate: number

  macro_preset: MacroPreset

  custom_carbs?: number
  custom_protein?: number
  custom_fats?: number
}


// ---------------------------------------------------------
// BMI
// ---------------------------------------------------------

export interface BmiResult {
  value: number
  category: string

  current_weight: number
  height: number

  healthy_weight_range: {
    min: number
    max: number
  }
}


// ---------------------------------------------------------
// ENERGY
// ---------------------------------------------------------

export interface EnergyResult {
  bmr: number
  tdee: number
}


// ---------------------------------------------------------
// MACRO
// ---------------------------------------------------------

export interface MacroValue {
  percentage: number
  grams: number
}

export interface SugarResult {
  grams: number
  percentage_of_calories: number
  adjustable: boolean
}

export interface MacroPercentages {
  carbs: number
  protein: number
  fats: number
}

export interface Macros {
  calories: number

  preset: MacroPreset

  name: string
  description: string

  percentages: MacroPercentages

  protein: MacroValue
  carbs: MacroValue
  fats: MacroValue

  sugar: SugarResult
}


// ---------------------------------------------------------
// RECOMMENDATION
// ---------------------------------------------------------

export interface Recommendation {
  goal: Goal

  current_weight: number

  target_weight: number
  target_bmi: number

  target_reason: string

  calories: number

  rate: number
  weeks: number
}


// ---------------------------------------------------------
// FULL BACKEND RESPONSE
// ---------------------------------------------------------

export interface HealthPlanResponse {
  bmi: BmiResult

  body_energy: EnergyResult

  recommendation: Recommendation

  macros: Macros

  health_summary: string[]
}
