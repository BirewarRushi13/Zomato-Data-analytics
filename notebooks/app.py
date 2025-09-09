from flask import Flask, request, jsonify
import pandas as pd
import joblib
import sklearn
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model_data = joblib.load('random_forest_model.joblib')

df = pd.read_csv("../csv-files/clean_data.csv")

@app.route('/predict', methods=['POST'])
def predict():
    # Get the data from the request
    data = request.get_json()
    if data["cuisine"] is not None and data["location"] is not None and data["price"] is not None:
        # Filter the DataFrame for the preferred location
        location_filter = df['Location'].str.contains(data["location"], case=False)
        df_location = df[location_filter]

        # Find the most popular cuisine in the preferred location
        popular_cuisine = df_location['Cuisines'].mode().iloc[0]

        # Calculate the average price for one in the preferred location
        average_price = df_location['Price_for_one'].mean()

        # Find the most popular restaurant and the cuisine it serves in the preferred location
        most_popular_restaurant = df_location.loc[df_location['Rating'].idxmax()]
        most_popular_restaurant_name = most_popular_restaurant['Name']
        most_popular_restaurant_cuisine = most_popular_restaurant['Cuisines']

        # Find the most popular restaurant serving the specified cuisine in the preferred location
        cuisine_filter = df_location['Cuisines'].str.contains(data["cuisine"], case=False)
        if not df_location[cuisine_filter].empty:
            most_popular_cuisine_restaurant = df_location[cuisine_filter].loc[df_location[cuisine_filter]['Rating'].idxmax()]
            most_popular_cuisine_restaurant_name = most_popular_cuisine_restaurant['Name']
        else:
            return jsonify({"message": "No restaurant found serving the specified cuisine"}), 404

        # if data["cuisine"] is not None and data["location"] is not None and data["price"] is not None:

        input_data = {'Location': [data["location"]], 'Cuisines': [data["cuisine"]]}
        input_df = pd.DataFrame(input_data)
        
        input_df_encoded = pd.get_dummies(input_df, drop_first=True).reindex(columns=model_data["train_inputs"].columns, fill_value=0)

        predicted_price = model_data['model']['model']['model'].predict(input_df_encoded)[0]

        # Price suggestion
        if float(data["price"]) < predicted_price:
            suggested_price = float(data["price"]) * 1.1  # Increase by 10%
            suggested_price = min(suggested_price, predicted_price)
        else:
            suggested_price = predicted_price

        # else:
        #     print("Invalid inputs received. Exiting the program.")
        return jsonify({'popular_cuisine': popular_cuisine, 
                        "average_price": average_price,
                        "Popular_Restaurant": most_popular_restaurant_name,
                        "Popular_Restaurant_serving_cuisine": most_popular_cuisine_restaurant_name,
                        "suggested_price": suggested_price
                        })
    else:
        return jsonify({"message": "No restaurant found serving the specified cuisine"}), 404   
 


if __name__ == '__main__':
    app.run(debug=True)