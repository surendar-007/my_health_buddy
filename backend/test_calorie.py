from calculations.bmi import calculate_bmi
from calculations.calorie import (
    calculate_bmr,
    calculate_tdee,
    get_default_goal_and_target,
    calculate_default_calories,
    calculate_custom_calories,
    apply_minimum_calories,
    validate_custom_target
)


# Test user
age = 19
gender = "male"
height = 176
weight = 65
activity_level = "moderate"


# 1. BMI
bmi = calculate_bmi(weight, height)

# 2. BMR
bmr = calculate_bmr(weight, height, age, gender)

# 3. TDEE
tdee = calculate_tdee(bmr, activity_level)

# 4. Default goal and target
target_weight, goal = get_default_goal_and_target(
    bmi,
    weight,
    height
)

# 5. Default calorie recommendation
default_result = calculate_default_calories(
    tdee,
    weight,
    target_weight,
    goal
)

default_calories = apply_minimum_calories(
    default_result["calories"],
    gender
)


# 6. Custom target example
custom_target = 70
custom_weeks = 10

custom_result = calculate_custom_calories(
    tdee,
    weight,
    custom_target,
    custom_weeks
)


# 7. Healthy target validation
healthy_min = 18.5 * ((height / 100) ** 2)
healthy_max = 24.9 * ((height / 100) ** 2)

custom_target_valid = validate_custom_target(
    custom_target,
    healthy_min,
    healthy_max
)


# Display results
print("===== SMART HEALTH PLANNER =====")

print("BMI:", bmi)
print("BMR:", bmr, "kcal/day")
print("TDEE:", tdee, "kcal/day")

print("\n--- DEFAULT PLAN ---")
print("Goal:", goal)
print("Target weight:", round(target_weight, 1), "kg")
print("Calories:", default_calories, "kcal/day")
print("Rate:", default_result["rate"], "kg/week")
print("Estimated weeks:", default_result["weeks"])

print("\n--- CUSTOM PLAN ---")
print("Custom target:", custom_target, "kg")
print("Goal:", custom_result["goal"])
print("Calories:", custom_result["calories"], "kcal/day")
print("Rate:", custom_result["rate"], "kg/week")
print("Weeks:", custom_result["weeks"])

print("\n--- TARGET VALIDATION ---")
print("Custom target valid:", custom_target_valid)