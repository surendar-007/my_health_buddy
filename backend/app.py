from flask import Flask, request, jsonify
from flask_cors import CORS

from services.health_planner import (
    generate_health_plan,
    generate_custom_health_plan
)


app = Flask(__name__)

# Allow frontend applications to access this API
CORS(app)



@app.route("/")
def home():
    return jsonify({
        "message": "Smart Health Planner API is running!"
    })



@app.route("/calculate", methods=["POST"])
def calculate():

    try:

        data = request.get_json()


        required_fields = [
            "age",
            "gender",
            "height",
            "weight",
            "activity_level"
        ]


        # Check missing inputs
        for field in required_fields:
            if field not in data:
                return jsonify({
                    "error": f"Missing field: {field}"
                }), 400



        result = generate_health_plan(
            age=data["age"],
            gender=data["gender"],
            height=data["height"],
            weight=data["weight"],
            activity_level=data["activity_level"]
        )


        return jsonify({
            "success": True,
            "data": result
        })



    except Exception as e:

        return jsonify({
            "success": False,
            "error": str(e)
        }), 400


@app.route("/customize", methods=["POST"])
def customize():
    try:
        data = request.get_json()

        required_fields = [
            "age",
            "gender",
            "height",
            "weight",
            "activity_level",
            "goal",
            "target_weight",
            "rate",
            "macro_preset"
        ]

        for field in required_fields:
            if field not in data:
                return jsonify({
                    "success": False,
                    "error": f"Missing field: {field}"
                }), 400

        result = generate_custom_health_plan(
            age=data["age"],
            gender=data["gender"],
            height=data["height"],
            weight=data["weight"],
            activity_level=data["activity_level"],
            goal=data["goal"],
            target_weight=data["target_weight"],
            rate=data["rate"],
            macro_preset=data["macro_preset"],
            custom_carbs=data.get("custom_carbs"),
            custom_protein=data.get("custom_protein"),
            custom_fats=data.get("custom_fats")
        )

        return jsonify({
            "success": True,
            "data": result
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 400

if __name__ == "__main__":
    app.run(
    debug=True,
    host="0.0.0.0",
    port=5000,
    )