# ---------------------------------------------------------
# BMI CALCULATIONS
# ---------------------------------------------------------

from calculations.bmi import (
    calculate_bmi,
    get_bmi_category,
    get_healthy_weight_range,
)


# ---------------------------------------------------------
# CALORIE CALCULATIONS
# ---------------------------------------------------------

from calculations.calorie import (
    calculate_bmr,
    calculate_tdee,
    get_default_goal_and_target,
    calculate_default_calories,
    apply_minimum_calories,
    calculate_custom_calories_by_rate,
    validate_custom_target,
)


# ---------------------------------------------------------
# MACRO CALCULATIONS
# ---------------------------------------------------------

from calculations.macros import calculate_macros


# ---------------------------------------------------------
# CONSTANTS
# ---------------------------------------------------------

VALID_GOALS = {
    "gain",
    "loss",
    "maintenance",
}

VALID_MACRO_PRESETS = {
    "balanced",
    "high_protein",
    "low_carb",
    "low_fat",
    "custom",
}

MIN_RATE = 0.05
MAX_RATE = 0.75


# ---------------------------------------------------------
# BMI TARGET
# ---------------------------------------------------------

def calculate_target_bmi(target_weight, height):
    """
    Calculate BMI for a target weight.

    Weight is in kg.
    Height is in cm.
    """

    target_weight = float(target_weight)
    height = float(height)

    if target_weight <= 0:
        raise ValueError("Target weight must be greater than 0 kg.")

    if height <= 0:
        raise ValueError("Height must be greater than 0 cm.")

    height_m = height / 100

    bmi = target_weight / (height_m ** 2)

    if not bmi == bmi:
        raise ValueError("Unable to calculate target BMI.")

    return round(bmi, 1)


# ---------------------------------------------------------
# TARGET REASON
# ---------------------------------------------------------

def get_target_reason(goal, target_bmi):
    """Return a short explanation for the selected target."""

    if goal == "gain":
        return (
            f"🎯 This target aims to gradually move you "
            f"toward a BMI of {target_bmi}."
        )

    if goal == "loss":
        return (
            f"🎯 This target aims to gradually move you "
            f"toward a BMI of {target_bmi}."
        )

    return (
        "⚖️ This target is designed to maintain "
        "your current weight."
    )


# ---------------------------------------------------------
# HEALTH TIPS
# ---------------------------------------------------------

HEALTH_TIPS = {

    "Underweight": [
        "🥗 Choose nutrient-rich foods",
        "💪 Include enough protein",
        "🍽️ Eat regular balanced meals",
        "😴 Sleep well and recover",
        "📊 Track progress gradually",
    ],

    "Normal weight": [
        "🥗 Eat a balanced diet",
        "💧 Stay hydrated",
        "😴 Sleep well",
        "🏃 Stay active",
        "📊 Track your progress",
    ],

    "Overweight": [
        "🥗 Choose balanced meals",
        "💧 Stay hydrated",
        "😴 Sleep consistently",
        "🏃 Stay physically active",
        "📊 Aim for gradual progress",
    ],

    "Obesity": [
        "🥗 Focus on nutritious foods",
        "💧 Stay hydrated",
        "😴 Prioritize good sleep",
        "🏃 Stay active as appropriate",
        "👨‍⚕️ Consider professional guidance",
    ],
}


# ---------------------------------------------------------
# HEALTH SUMMARY
# ---------------------------------------------------------

def get_health_summary(category):
    """Return five health tips for the BMI category."""

    return HEALTH_TIPS.get(
        category,
        HEALTH_TIPS["Normal weight"],
    )


# ---------------------------------------------------------
# VALIDATE RATE
# ---------------------------------------------------------

def validate_rate(goal, rate):
    """
    Validate the selected weight-change rate.

    Maintenance does not require a rate.
    Gain/loss must stay within the safe application limit.
    """

    if goal == "maintenance":
        return 0.0

    try:
        rate = float(rate)
    except (TypeError, ValueError):
        raise ValueError("Invalid weight-change rate.")

    if rate < MIN_RATE or rate > MAX_RATE:
        raise ValueError(
            f"Weight-change rate must be between "
            f"{MIN_RATE} and {MAX_RATE} kg/week."
        )

    return round(rate, 2)


# ---------------------------------------------------------
# VALIDATE MACRO PRESET
# ---------------------------------------------------------

def validate_macro_preset(macro_preset):
    """Validate the selected macro preset."""

    if macro_preset not in VALID_MACRO_PRESETS:
        raise ValueError(
            "Invalid macro preset. Choose Balanced, High Protein, "
            "Low Carb, Low Fat, or Custom."
        )

    return macro_preset


# ---------------------------------------------------------
# DEFAULT HEALTH PLAN
# ---------------------------------------------------------

def generate_health_plan(
    age,
    gender,
    height,
    weight,
    activity_level,
):
    """
    Generate the default automatically recommended plan.
    """

    # -----------------------------------------------------
    # BMI
    # -----------------------------------------------------

    bmi = calculate_bmi(
        weight,
        height,
    )

    category = get_bmi_category(
        bmi,
    )

    healthy_min, healthy_max = get_healthy_weight_range(
        height,
    )


    # -----------------------------------------------------
    # ENERGY
    # -----------------------------------------------------

    bmr = calculate_bmr(
        weight,
        height,
        age,
        gender,
    )

    tdee = calculate_tdee(
        bmr,
        activity_level,
    )


    # -----------------------------------------------------
    # DEFAULT GOAL
    # -----------------------------------------------------

    target_weight, goal = get_default_goal_and_target(
        bmi,
        weight,
        height,
    )

    target_weight = float(target_weight)


    # -----------------------------------------------------
    # DEFAULT TARGET BMI
    # -----------------------------------------------------

    target_bmi = calculate_target_bmi(
        target_weight,
        height,
    )


    # -----------------------------------------------------
    # DEFAULT CALORIES
    # -----------------------------------------------------

    calorie_plan = calculate_default_calories(
        tdee,
        weight,
        target_weight,
        goal,
    )

    calories = apply_minimum_calories(
        calorie_plan["calories"],
        gender,
    )


    # -----------------------------------------------------
    # DEFAULT MACROS
    # -----------------------------------------------------

    macros = calculate_macros(
        calories,
        goal,
        weight,
        preset="balanced",
    )


    # -----------------------------------------------------
    # RETURN
    # -----------------------------------------------------

    return {

        "bmi": {
            "value": round(float(bmi), 1),
            "category": category,

            "current_weight": round(float(weight), 1),
            "height": round(float(height), 1),

            "healthy_weight_range": {
                "min": round(float(healthy_min), 1),
                "max": round(float(healthy_max), 1),
            },
        },

        "body_energy": {
            "bmr": round(float(bmr)),
            "tdee": round(float(tdee)),
        },

        "recommendation": {

            "goal": goal,

            "current_weight": round(
                float(weight),
                1,
            ),

            "target_weight": round(
                target_weight,
                1,
            ),

            "target_bmi": target_bmi,

            "target_reason": get_target_reason(
                goal,
                target_bmi,
            ),

            "calories": round(
                float(calories),
            ),

            "rate": round(
                float(calorie_plan["rate"]),
                2,
            ),

            "weeks": round(
                float(calorie_plan["weeks"]),
                1,
            ),
        },

        "macros": macros,

        "health_summary": get_health_summary(
            category,
        ),
    }


# ---------------------------------------------------------
# CUSTOM HEALTH PLAN
# ---------------------------------------------------------

def generate_custom_health_plan(
    age,
    gender,
    height,
    weight,
    activity_level,
    goal,
    target_weight,
    rate,
    macro_preset="balanced",
    custom_carbs=None,
    custom_protein=None,
    custom_fats=None,
):
    """
    Generate a fully customized health plan.

    The selected:
    - goal
    - target weight
    - rate
    - macro preset
    - custom macro percentages

    are all passed through to the calculation layer.
    """

    # -----------------------------------------------------
    # BASIC VALUES
    # -----------------------------------------------------

    try:
        weight = float(weight)
        target_weight = float(target_weight)
        height = float(height)
    except (TypeError, ValueError):
        raise ValueError(
            "Weight, target weight, and height must be valid numbers."
        )


    if weight <= 0:
        raise ValueError("Current weight must be greater than 0 kg.")

    if target_weight <= 0:
        raise ValueError("Target weight must be greater than 0 kg.")

    if height <= 0:
        raise ValueError("Height must be greater than 0 cm.")


    # -----------------------------------------------------
    # GOAL
    # -----------------------------------------------------

    if goal not in VALID_GOALS:
        raise ValueError(
            "Invalid goal."
        )


    # -----------------------------------------------------
    # MACRO PRESET
    # -----------------------------------------------------

    macro_preset = validate_macro_preset(
        macro_preset,
    )


    # -----------------------------------------------------
    # CURRENT BMI
    # -----------------------------------------------------

    bmi = calculate_bmi(
        weight,
        height,
    )

    category = get_bmi_category(
        bmi,
    )

    healthy_min, healthy_max = get_healthy_weight_range(
        height,
    )


    # -----------------------------------------------------
    # TARGET WEIGHT SAFE RANGE
    # -----------------------------------------------------

    


    # -----------------------------------------------------
    # GOAL / TARGET CONSISTENCY
    # -----------------------------------------------------

    if goal == "gain":
        if target_weight <= weight:
            raise ValueError(
                "For weight gain, target weight must be "
                "greater than current weight."
            )

        if target_weight > healthy_max:
            raise ValueError(
                f"For weight gain, target weight cannot be "
                f"higher than {round(healthy_max, 1)} kg."
            )


    if goal == "loss":
        if target_weight >= weight:
            raise ValueError(
                "For weight loss, target weight must be "
                "lower than current weight."
            )

        if target_weight < healthy_min:
            raise ValueError(
                f"For weight loss, target weight cannot be "
                f"lower than {round(healthy_min, 1)} kg."
            )


    if goal == "maintenance":
        if abs(target_weight - weight) > 0.01:
            raise ValueError(
                "For maintenance, target weight should "
                "match current weight."
            )

    # -----------------------------------------------------
    # RATE
    # -----------------------------------------------------

    validated_rate = validate_rate(
        goal,
        rate,
    )


    # -----------------------------------------------------
    # TARGET BMI
    # -----------------------------------------------------

    target_bmi = calculate_target_bmi(
        target_weight,
        height,
    )


    # -----------------------------------------------------
    # ENERGY
    # -----------------------------------------------------

    bmr = calculate_bmr(
        weight,
        height,
        age,
        gender,
    )

    tdee = calculate_tdee(
        bmr,
        activity_level,
    )


    # -----------------------------------------------------
    # CALORIES
    # -----------------------------------------------------

    if goal == "maintenance":

        calories = tdee

        calorie_plan = {
            "calories": tdee,
            "goal": "maintenance",
            "rate": 0,
            "weeks": 0,
        }

    else:

        calorie_plan = calculate_custom_calories_by_rate(
            tdee,
            weight,
            target_weight,
            validated_rate,
        )

        calories = apply_minimum_calories(
            calorie_plan["calories"],
            gender,
        )


    # -----------------------------------------------------
    # MACROS
    # -----------------------------------------------------

    macros = calculate_macros(
        calories,
        goal,
        weight,
        preset=macro_preset,
        custom_carbs=custom_carbs,
        custom_protein=custom_protein,
        custom_fats=custom_fats,
    )


    # -----------------------------------------------------
    # RETURN
    # -----------------------------------------------------

    return {

        "bmi": {
            "value": round(float(bmi), 1),
            "category": category,

            "current_weight": round(float(weight), 1),
            "height": round(float(height), 1),

            "healthy_weight_range": {
                "min": round(float(healthy_min), 1),
                "max": round(float(healthy_max), 1),
            },
        },

        "body_energy": {
            "bmr": round(float(bmr)),
            "tdee": round(float(tdee)),
        },

        "recommendation": {

            "goal": goal,

            "current_weight": round(
                weight,
                1,
            ),

            "target_weight": round(
                target_weight,
                1,
            ),

            "target_bmi": target_bmi,

            "target_reason": get_target_reason(
                goal,
                target_bmi,
            ),

            "calories": round(
                float(calories),
            ),

            "rate": round(
                float(calorie_plan["rate"]),
                2,
            ),

            "weeks": round(
                float(calorie_plan["weeks"]),
                1,
            ),
        },

        "macros": macros,

        "health_summary": get_health_summary(
            category,
        ),
    }
