# ---------------------------------------------------------
# BMR
# ---------------------------------------------------------

def calculate_bmr(weight, height, age, gender):
    """Calculate BMR using Mifflin-St Jeor."""

    if gender.lower() == "male":
        bmr = (
            (10 * weight)
            + (6.25 * height)
            - (5 * age)
            + 5
        )
    else:
        bmr = (
            (10 * weight)
            + (6.25 * height)
            - (5 * age)
            - 161
        )

    return round(bmr)


# ---------------------------------------------------------
# TDEE
# ---------------------------------------------------------

def calculate_tdee(bmr, activity_level):
    """Calculate daily energy needs."""

    activity_multipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "high": 1.725,
        "active": 1.725,
        "very_active": 1.9,
    }

    multiplier = activity_multipliers.get(
        activity_level,
        1.2,
    )

    return round(bmr * multiplier)


# ---------------------------------------------------------
# DEFAULT GOAL + TARGET
# ---------------------------------------------------------

def get_default_goal_and_target(bmi, weight, height):
    """
    Determine the default goal and target weight.

    Default behavior:

    BMI < 18.5
        -> Gain weight.

    BMI 18.5 - 20
        -> Gain gradually toward BMI 22.

    BMI 20 - 23.5
        -> Maintain current weight.

    BMI 23.5 - 24.9
        -> Lose weight gradually toward BMI 22.

    BMI >= 25
        -> Lose weight.

    For underweight/overweight users with a large
    difference from the BMI 22 target (> 7 kg),
    use a first milestone inside the healthy range:

        Underweight:
            healthy minimum + 3 kg

        Overweight:
            healthy maximum - 3 kg
    """

    height_m = height / 100

    # -----------------------------------------------------
    # Important BMI targets
    # -----------------------------------------------------

    BMI_22 = 22.0
    BMI_HEALTHY_MIN = 18.5
    BMI_HEALTHY_MAX = 24.9

    # Comfortable maintenance zone
    BMI_MAINTAIN_MIN = 20.0
    BMI_MAINTAIN_MAX = 23.5

    # Staged-target settings
    LARGE_DIFFERENCE_KG = 7.0
    MILESTONE_BUFFER_KG = 3.0

    # -----------------------------------------------------
    # Healthy weight range
    # -----------------------------------------------------

    healthy_min_weight = (
        BMI_HEALTHY_MIN * (height_m ** 2)
    )

    healthy_max_weight = (
        BMI_HEALTHY_MAX * (height_m ** 2)
    )

    # -----------------------------------------------------
    # BMI 22 target
    # -----------------------------------------------------

    bmi_22_weight = (
        BMI_22 * (height_m ** 2)
    )

    # Difference between current weight and BMI 22
    weight_difference = abs(
        bmi_22_weight - weight
    )

    # -----------------------------------------------------
    # UNDERWEIGHT
    # -----------------------------------------------------

    if bmi < BMI_HEALTHY_MIN:

        goal = "gain"

        # Large distance to BMI 22
        if weight_difference > LARGE_DIFFERENCE_KG:

            target_weight = (
                healthy_min_weight
                + MILESTONE_BUFFER_KG
            )

        else:

            target_weight = bmi_22_weight

        return (
            round(target_weight, 1),
            goal,
        )

    # -----------------------------------------------------
    # SLIGHTLY UNDER THE COMFORTABLE ZONE
    # -----------------------------------------------------

    if bmi < BMI_MAINTAIN_MIN:

        goal = "gain"

        target_weight = bmi_22_weight

        return (
            round(target_weight, 1),
            goal,
        )

    # -----------------------------------------------------
    # COMFORTABLE HEALTHY RANGE
    # -----------------------------------------------------

    if bmi <= BMI_MAINTAIN_MAX:

        goal = "maintenance"

        target_weight = weight

        return (
            round(target_weight, 1),
            goal,
        )

    # -----------------------------------------------------
    # SLIGHTLY ABOVE THE COMFORTABLE ZONE
    # -----------------------------------------------------

    if bmi < BMI_HEALTHY_MAX + 0.1:

        goal = "loss"

        target_weight = bmi_22_weight

        return (
            round(target_weight, 1),
            goal,
        )

    # -----------------------------------------------------
    # OVERWEIGHT
    # -----------------------------------------------------

    goal = "loss"

    # Large distance to BMI 22
    if weight_difference > LARGE_DIFFERENCE_KG:

        target_weight = (
            healthy_max_weight
            - MILESTONE_BUFFER_KG
        )

    else:

        target_weight = bmi_22_weight

    return (
        round(target_weight, 1),
        goal,
    )


# ---------------------------------------------------------
# DEFAULT CALORIES
# ---------------------------------------------------------

def calculate_default_calories(
        tdee,
        current_weight,
        target_weight,
        goal
):
    """Calculate default calories at 0.5 kg/week."""

    DEFAULT_RATE = 0.5
    CALORIES_PER_KG = 7700

    # -----------------------------------------------------
    # Maintenance
    # -----------------------------------------------------

    if goal == "maintenance":

        return {
            "calories": tdee,
            "rate": 0,
            "weeks": 0,
            "goal": goal,
            "target_weight": round(
                target_weight,
                1,
            ),
        }

    # -----------------------------------------------------
    # Weight difference
    # -----------------------------------------------------

    weight_difference = abs(
        target_weight - current_weight
    )

    # -----------------------------------------------------
    # Estimated duration
    # -----------------------------------------------------

    weeks = (
        weight_difference / DEFAULT_RATE
    )

    # -----------------------------------------------------
    # Daily calorie adjustment
    # -----------------------------------------------------

    daily_adjustment = (
        DEFAULT_RATE * CALORIES_PER_KG
    ) / 7

    # -----------------------------------------------------
    # Gain / Loss calories
    # -----------------------------------------------------

    if goal == "gain":

        calories = (
            tdee + daily_adjustment
        )

    elif goal == "loss":

        calories = (
            tdee - daily_adjustment
        )

    else:

        raise ValueError(
            "Invalid goal"
        )

    return {
        "calories": round(calories),
        "rate": DEFAULT_RATE,
        "weeks": round(weeks, 1),
        "goal": goal,
        "target_weight": round(
            target_weight,
            1,
        ),
    }


# ---------------------------------------------------------
# CUSTOM CALORIES BY RATE
# ---------------------------------------------------------

def calculate_custom_calories_by_rate(
        tdee,
        current_weight,
        target_weight,
        rate
):
    """Calculate calories and weeks from selected rate."""

    VALID_RATES = {
        0.25,
        0.5,
        0.75,
    }

    if rate not in VALID_RATES:

        raise ValueError(
            "Rate must be 0.25, 0.5, or 0.75 kg per week."
        )

    # -----------------------------------------------------
    # Weight difference
    # -----------------------------------------------------

    weight_difference = (
        target_weight - current_weight
    )

    # -----------------------------------------------------
    # Maintenance
    # -----------------------------------------------------

    if weight_difference == 0:

        return {
            "calories": tdee,
            "goal": "maintenance",
            "rate": 0,
            "weeks": 0,
            "target_weight": round(
                target_weight,
                1,
            ),
        }

    # -----------------------------------------------------
    # Estimated duration
    # -----------------------------------------------------

    weeks = (
        abs(weight_difference) / rate
    )

    # -----------------------------------------------------
    # Calories
    # -----------------------------------------------------

    CALORIES_PER_KG = 7700

    daily_adjustment = (
        rate * CALORIES_PER_KG
    ) / 7

    # -----------------------------------------------------
    # Determine goal
    # -----------------------------------------------------

    if weight_difference > 0:

        goal = "gain"

        calories = (
            tdee + daily_adjustment
        )

    else:

        goal = "loss"

        calories = (
            tdee - daily_adjustment
        )

    return {
        "calories": round(calories),
        "goal": goal,
        "rate": rate,
        "weeks": round(weeks, 1),
        "target_weight": round(
            target_weight,
            1,
        ),
    }


# ---------------------------------------------------------
# MINIMUM CALORIES
# ---------------------------------------------------------

def apply_minimum_calories(calories, gender):
    """Prevent very low calorie recommendations."""

    if gender.lower() == "male":

        minimum_calories = 1500

    else:

        minimum_calories = 1200

    return max(
        round(calories),
        minimum_calories,
    )


# ---------------------------------------------------------
# TARGET VALIDATION
# ---------------------------------------------------------

def validate_custom_target(
        target_weight,
        min_healthy_weight,
        max_healthy_weight
):
    """Check whether target weight is valid."""

    if target_weight < min_healthy_weight:

        return False

    if target_weight > max_healthy_weight:

        return False

    return True