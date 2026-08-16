"""
Macro calculation utilities for Smart Health Planner.

Macro presets are general nutrition-planning presets for adults.
They are not individualized medical prescriptions.

Calories:
    Protein = 4 kcal/g
    Carbohydrates = 4 kcal/g
    Fat = 9 kcal/g

Sugar is displayed separately and is not treated as a fourth macro.
"""


# ---------------------------------------------------------
# MACRO PRESETS
# ---------------------------------------------------------

MACRO_PRESETS = {
    "balanced": {
        "name": "Balanced",
        "description": "50% carbs · 25% protein · 25% fat",
        "carbs": 50,
        "protein": 25,
        "fats": 25,
    },

    "high_protein": {
        "name": "High Protein",
        "description": "45% carbs · 35% protein · 20% fat",
        "carbs": 45,
        "protein": 35,
        "fats": 20,
    },

    "low_carb": {
        "name": "Low Carb",
        "description": "45% carbs · 30% protein · 25% fat",
        "carbs": 45,
        "protein": 30,
        "fats": 25,
    },

    "low_fat": {
        "name": "Low Fat",
        "description": "50% carbs · 30% protein · 20% fat",
        "carbs": 50,
        "protein": 30,
        "fats": 20,
    },
}


# ---------------------------------------------------------
# GOAL → DEFAULT PRESET
# ---------------------------------------------------------

GOAL_TO_PRESET = {
    "gain": "balanced",
    "loss": "balanced",
    "maintenance": "balanced",

    # Backward compatibility
    "muscle_gain": "balanced",
    "fat_loss": "balanced",
}


# ---------------------------------------------------------
# SAFE CUSTOM MACRO RANGES
# ---------------------------------------------------------

CUSTOM_MACRO_LIMITS = {
    "carbs": {
        "min": 30,
        "max": 55,
    },

    "protein": {
        "min": 20,
        "max": 35,
    },

    "fats": {
        "min": 20,
        "max": 35,
    },
}


# ---------------------------------------------------------
# VALIDATE MACRO PERCENTAGES
# ---------------------------------------------------------

def validate_macro_percentages(
    carbs,
    protein,
    fats,
):
    """
    Validate custom macro percentages.

    The custom system uses the following safe application
    ranges:

        Carbs:   30–55%
        Protein: 20–35%
        Fats:    20–35%

    All three must total exactly 100%.
    """

    try:
        carbs = float(carbs)
        protein = float(protein)
        fats = float(fats)
    except (TypeError, ValueError):
        return False

    if not (
        CUSTOM_MACRO_LIMITS["carbs"]["min"]
        <= carbs
        <= CUSTOM_MACRO_LIMITS["carbs"]["max"]
    ):
        return False

    if not (
        CUSTOM_MACRO_LIMITS["protein"]["min"]
        <= protein
        <= CUSTOM_MACRO_LIMITS["protein"]["max"]
    ):
        return False

    if not (
        CUSTOM_MACRO_LIMITS["fats"]["min"]
        <= fats
        <= CUSTOM_MACRO_LIMITS["fats"]["max"]
    ):
        return False

    return abs(
        carbs + protein + fats - 100
    ) < 0.001


# ---------------------------------------------------------
# GET MACRO PRESET
# ---------------------------------------------------------

def get_macro_preset(
    preset="balanced",
):
    """
    Return a predefined macro distribution.
    """

    if preset not in MACRO_PRESETS:
        raise ValueError(
            "Invalid macro preset."
        )

    return MACRO_PRESETS[preset].copy()


# ---------------------------------------------------------
# GET ALL MACRO PRESETS
# ---------------------------------------------------------

def get_all_macro_presets():
    """
    Return all available macro presets.

    Useful for exposing preset information to the frontend
    without duplicating the values manually.
    """

    return {
        key: value.copy()
        for key, value in MACRO_PRESETS.items()
    }


# ---------------------------------------------------------
# GET MACRO PERCENTAGES
# ---------------------------------------------------------

def get_macro_percentage(
    goal=None,
    preset="balanced",
):
    """
    Return the selected macro percentages.

    Explicit preset always takes priority.
    """

    if preset in MACRO_PRESETS:
        selected_preset = preset

    else:
        selected_preset = GOAL_TO_PRESET.get(
            goal,
            "balanced",
        )

    return get_macro_preset(
        selected_preset,
    )


# ---------------------------------------------------------
# CALCULATE SUGAR
# ---------------------------------------------------------

def calculate_sugar_limit(
    calories,
):
    """
    General daily free-sugar reference.

    Uses 10% of daily calories as the upper reference point.

    Sugar is kept separate from the three main macros.
    """

    calories = float(calories)

    sugar_calories = calories * 0.10
    sugar_grams = sugar_calories / 4

    return round(
        sugar_grams,
        1,
    )


# ---------------------------------------------------------
# CALCULATE MACROS
# ---------------------------------------------------------

def calculate_macros(
    calories,
    goal,
    weight,
    preset="balanced",
    custom_carbs=None,
    custom_protein=None,
    custom_fats=None,
):
    """
    Convert daily calories into macro grams.

    Supported presets:

        balanced
        high_protein
        low_carb
        low_fat
        custom

    Custom macros must satisfy:

        carbs   = 30–55%
        protein = 20–40%
        fats    = 20–30%

    and:

        carbs + protein + fats = 100%
    """

    try:
        calories = float(calories)
        weight = float(weight)
    except (TypeError, ValueError):
        raise ValueError(
            "Calories and weight must be valid numbers."
        )

    if calories <= 0:
        raise ValueError(
            "Calories must be greater than zero."
        )

    if weight <= 0:
        raise ValueError(
            "Weight must be greater than zero."
        )


    # -----------------------------------------------------
    # CUSTOM
    # -----------------------------------------------------

    if preset == "custom":

        if (
            custom_carbs is None
            or custom_protein is None
            or custom_fats is None
        ):
            raise ValueError(
                "Custom macro percentages are required."
            )

        try:
            carbs_percentage = float(
                custom_carbs
            )

            protein_percentage = float(
                custom_protein
            )

            fats_percentage = float(
                custom_fats
            )

        except (TypeError, ValueError):
            raise ValueError(
                "Custom macro percentages must be numbers."
            )

        if not validate_macro_percentages(
            carbs_percentage,
            protein_percentage,
            fats_percentage,
        ):
            raise ValueError(
                "Custom macros must use the safe ranges "
                "and total exactly 100%."
            )

        macro_name = "Custom"
        macro_description = (
            "Your customized macro distribution"
        )


    # -----------------------------------------------------
    # PRESET
    # -----------------------------------------------------

    else:

        if preset not in MACRO_PRESETS:

            # If no valid explicit preset is provided,
            # safely fall back to the goal-based preset.
            preset = GOAL_TO_PRESET.get(
                goal,
                "balanced",
            )

        percentages = get_macro_percentage(
            goal=goal,
            preset=preset,
        )

        carbs_percentage = float(
            percentages["carbs"]
        )

        protein_percentage = float(
            percentages["protein"]
        )

        fats_percentage = float(
            percentages["fats"]
        )

        macro_name = percentages["name"]
        macro_description = percentages["description"]


    # -----------------------------------------------------
    # CALORIE DISTRIBUTION
    # -----------------------------------------------------

    carb_calories = (
        calories
        * carbs_percentage
        / 100
    )

    protein_calories = (
        calories
        * protein_percentage
        / 100
    )

    fat_calories = (
        calories
        * fats_percentage
        / 100
    )


    # -----------------------------------------------------
    # CALORIES → GRAMS
    # -----------------------------------------------------

    carb_grams = (
        carb_calories / 4
    )

    protein_grams = (
        protein_calories / 4
    )

    fat_grams = (
        fat_calories / 9
    )


    # -----------------------------------------------------
    # SUGAR
    # -----------------------------------------------------

    sugar_grams = calculate_sugar_limit(
        calories
    )


    # -----------------------------------------------------
    # RETURN
    # -----------------------------------------------------

    return {

        "calories": round(
            calories,
            1,
        ),

        "preset": preset,

        "name": macro_name,

        "description": macro_description,

        "percentages": {
            "carbs": round(
                carbs_percentage,
                1,
            ),

            "protein": round(
                protein_percentage,
                1,
            ),

            "fats": round(
                fats_percentage,
                1,
            ),
        },

        "protein": {
            "percentage": round(
                protein_percentage,
                1,
            ),

            "grams": round(
                protein_grams,
                1,
            ),
        },

        "carbs": {
            "percentage": round(
                carbs_percentage,
                1,
            ),

            "grams": round(
                carb_grams,
                1,
            ),
        },

        "fats": {
            "percentage": round(
                fats_percentage,
                1,
            ),

            "grams": round(
                fat_grams,
                1,
            ),
        },

        "sugar": {
            "grams": sugar_grams,
            "percentage_of_calories": 10,
            "adjustable": False,
        },
    }