from calculations.bmi import calculate_bmi, get_bmi_category, get_healthy_weight_range


# Test user
weight = 65
height = 176

# Calculate BMI
bmi = calculate_bmi(weight, height)

# Get category
category = get_bmi_category(bmi)

# Get healthy weight range
min_weight, max_weight = get_healthy_weight_range(height)


print("BMI:", bmi)
print("Category:", category)
print("Healthy weight range:", min_weight, "kg -", max_weight, "kg")