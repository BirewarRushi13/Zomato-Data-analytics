from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)  # allow React frontend to communicate

# Load your trained model (ensure you retrained it in the scikit-learn version you're using)
model_path = "path_to_your_model.pkl"
model_data = joblib.load(model_path)  # this should be your RandomForest or DecisionTree

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()  # get JSON from frontend
        location = data.get("location")
        cuisine = data.get("cuisine")
        price = data.get("price", 0)

        # Validate inputs
        if not location or not cuisine or price is None:
            return jsonify({"error": "Missing required fields"}), 400

        # Prepare dataframe for prediction (ensure your model expects the same column order!)
        input_df = pd.DataFrame([{
            "location": location,
            "cuisine": cuisine,
            "price": price
        }])

        # Encode categorical features if your model was trained with encoding
        # Example using one-hot encoding (adjust to your actual preprocessing)
        input_df_encoded = pd.get_dummies(input_df)
        # Align with model columns if necessary
        model_columns = model_data['columns']  # store this when training
        input_df_encoded = input_df_encoded.reindex(columns=model_columns, fill_value=0)

        # Make prediction
        predicted_price = model_data['model'].predict(input_df_encoded)[0]

        # Mock response (replace with your actual logic / post-processing)
        response = {
            "average_price": predicted_price,
            "popular_cuisine": cuisine,
            "Popular_Restaurant": "Sample Restaurant",
            "Popular_Restaurant_serving_cuisine": "Sample Restaurant",
            "suggested_price": round(predicted_price * 1.05, 2)
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
