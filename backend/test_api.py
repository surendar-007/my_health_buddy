import requests

url = "http://127.0.0.1:5000/api/calculate-bmi"

data = {
    "height": 176,
    "weight": 65
}

response = requests.post(url, json=data)

print(response.status_code)
print(response.json())