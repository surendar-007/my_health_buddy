def calculate_bmi(weight, height):
    height_m = height / 100
    bmi = weight / (height_m ** 2)

    return round(bmi, 1)

def get_bmi_category(bmi):
    if bmi < 18.5:
        return "Underweight"
    elif bmi < 25:
        return "Normal weight"
    elif bmi < 30:
        return "Overweight"
    else:
        return "Obesity"

def get_healthy_weight_range(height):
    height_m = height / 100

    min_weight = 18.5 * (height_m ** 2)
    max_weight = 24.9 * (height_m ** 2)

    return round(min_weight, 1), round(max_weight, 1)

