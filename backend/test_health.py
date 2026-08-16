from services.health_planner import (
    generate_health_plan,
    generate_custom_health_plan
)


# Sample user
user = {
    "age": 19,
    "gender": "male",
    "height": 176,
    "weight": 65,
    "activity_level": "moderate"
}


# =========================================================
# 1. DEFAULT PLAN
# =========================================================

result = generate_health_plan(
    age=user["age"],
    gender=user["gender"],
    height=user["height"],
    weight=user["weight"],
    activity_level=user["activity_level"]
)

print("===== DEFAULT PLAN =====")

print("\nBMI")
print(result["bmi"])

print("\nENERGY")
print(result["body_energy"])

print("\nRECOMMENDATION")
print(result["recommendation"])

print("\nMACROS")
print(result["macros"])

print("\nHEALTH SUMMARY")
print(result["health_summary"])


# =========================================================
# 2. CUSTOM PLAN
# =========================================================

custom_result = generate_custom_health_plan(
    age=user["age"],
    gender=user["gender"],
    height=user["height"],
    weight=user["weight"],
    activity_level=user["activity_level"],

    # User chooses goal
    goal="gain",

    # User chooses target weight
    target_weight=70,

    # User chooses rate
    rate=0.5,

    # User chooses macro preset
    macro_preset="high_protein"
)


print("\n\n===== CUSTOM PLAN =====")

print("\nBMI")
print(custom_result["bmi"])

print("\nENERGY")
print(custom_result["body_energy"])

print("\nRECOMMENDATION")
print(custom_result["recommendation"])

print("\nMACROS")
print(custom_result["macros"])

print("\nHEALTH SUMMARY")
print(custom_result["health_summary"])