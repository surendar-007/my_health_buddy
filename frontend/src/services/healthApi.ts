import type {
  CalculateRequest,
  CustomizeRequest,
  HealthPlanResponse,
} from "@/lib/types"

// Use the Render backend in production.
// Falls back to the local Flask server during development.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:5000"


// ---------------------------------------------------------
// API ERROR
// ---------------------------------------------------------

export class ApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ApiError"
  }
}


// ---------------------------------------------------------
// FLASK RESPONSE
// ---------------------------------------------------------

interface FlaskResponse {
  success: boolean
  data?: HealthPlanResponse
  error?: string
}


// ---------------------------------------------------------
// POST HELPER
// ---------------------------------------------------------

async function post(
  path: string,
  body: unknown,
): Promise<HealthPlanResponse> {

  let response: Response

  try {
    response = await fetch(
      `${API_BASE_URL}${path}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    )
  } catch {
    throw new ApiError(
      "We couldn't reach the Flask server. Please check that it is running.",
    )
  }


  let result: FlaskResponse

  try {
    result = await response.json()
  } catch {
    throw new ApiError(
      "The server returned an invalid response.",
    )
  }


  if (
    !response.ok ||
    !result.success ||
    !result.data
  ) {
    throw new ApiError(
      result.error ??
      "The server could not create your plan.",
    )
  }


  return result.data
}


// ---------------------------------------------------------
// DEFAULT PLAN
// ---------------------------------------------------------

export async function calculatePlan(
  payload: CalculateRequest,
): Promise<HealthPlanResponse> {

  return post(
    "/calculate",
    payload,
  )
}


// ---------------------------------------------------------
// CUSTOM PLAN
// ---------------------------------------------------------

export async function customizePlan(
  payload: CustomizeRequest,
): Promise<HealthPlanResponse> {

  return post(
    "/customize",
    payload,
  )
}