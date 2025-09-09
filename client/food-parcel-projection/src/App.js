import './App.css';
import logo from "./resources/logo.png"
import { useState } from 'react';
import { TextField, Button } from "@mui/material"
import axios from "axios"

function App() {
  const [inputs, setInputs] = useState({location: null, cuisine: null, price: "0"});
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setInputs((prev) => {
      return {
        ...prev,
        price: parseInt(prev.price)
      }
    })

    axios.post("http://127.0.0.1:5000/predict", inputs, config)
         .then((res) => {
            setPrediction(res.data)
            console.log(res)
         })
         .catch((err) => {
            setError(err.message)
            setPrediction(null)
            console.log(err.message)
         })
  }

  const handleChange = (event) => {
    setInputs((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value
      }
    });
  };

  return (
    <div className="fpp_hp">
      <div className="fpp_hp_header">
        <img className="fpp_hp_header_img" src={logo} alt="logo" />
      </div>
      <form className="fpp_hp_container">
          <h2 className="fpp_hp_form_title">AI-Driven Price and Location Prediction</h2>
          <p className="fpp_hp_form_p">Food Parcel Projection: Predicting Ideal Locations, Prices and Competitive Insights for Your Remote Kitchen Startup in Banglore.</p>
          <div className='fpp_hp_form'>
            <TextField className="fpp_hp_form_input" name="location" label="Location" variant="standard" onChange={handleChange} />
            <TextField className="fpp_hp_form_input" name="cuisine" label="Cuisine" variant="standard" onChange={handleChange} />
            <TextField className="fpp_hp_form_input" name="price" label="Prefered Price For 1" variant="standard" onChange={handleChange} type='number' />
          </div>
          <Button onClick={handleSubmit} className='fpp_hp_form_button' variant="contained" color="error">Predict Price and Location</Button>
      </form>
      {prediction ?
        (<div className='fpp_hp_rec'>
          <div className='fpp_hp_rec_sugg'>
            <h3 className='fpp_hp_rec_sugg-h'>Based on Your Prefered Location</h3>
            <p>Average Price for One: <span className='fpp_hp_rec_sugg-span'>{parseFloat(prediction.average_price.toFixed(2))}</span></p>
            <p>Popular Cuisine: <span className='fpp_hp_rec_sugg-span'>{prediction.popular_cuisine}</span></p>
            <p>Popular Restaurant: <span className='fpp_hp_rec_sugg-span'>{prediction.Popular_Restaurant}</span></p>
            <p>Popular Restaurant serving {inputs.cuisine}: <span className='fpp_hp_rec_sugg-span'>{prediction.Popular_Restaurant_serving_cuisine}</span></p>
          </div>
          <div className='fpp_hp_rec_sugg'>
            <h3 className='fpp_hp_rec_sugg-h'>Suggestions Based on Your Preferences</h3>
            <p>Suggested Price for One: <span className='fpp_hp_rec_sugg-span'>{prediction.suggested_price} Rupees</span></p>
          </div>
        </div>) : error ?
        (<div>
          <h3 className='fpp_hp_rec_sugg_err'>Invalid input. Please check the inputs and provide correct values for the price, location, and cuisine and try again.</h3>
        </div>) : <></>
      }
    </div>
  );
}

export default App;
