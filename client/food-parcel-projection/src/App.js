import './App.css';
import logo from "./resources/logo.png"
import { useState } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from "@mui/material"
import axios from "axios"

function App() {
  const [inputs, setInputs] = useState({ location: "", cuisine: "", price: "0" });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Predefined locations and cuisines
  const locations = ["Koramangala", "Indiranagar", "Whitefield", "HSR Layout"];
  const cuisines = ["North Indian", "Chinese", "Italian", "South Indian", "Mexican"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      ...inputs,
      price: parseInt(inputs.price)
    };

    axios.post("http://127.0.0.1:5000/predict", payload, config)
         .then((res) => {
            setPrediction(res.data);
            setError(null);
         })
         .catch((err) => {
            setError("Invalid input or server error. Please try again.");
            setPrediction(null);
            console.error(err.message);
         })
  }

  const handleChange = (event) => {
    setInputs((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };

  return (
    <div className="fpp_hp">
      <div className="fpp_hp_header">
        <img className="fpp_hp_header_img" src={logo} alt="logo" />
      </div>

      <form className="fpp_hp_container" onSubmit={handleSubmit}>
        <h2 className="fpp_hp_form_title">AI-Driven Price and Location Prediction</h2>
        <p className="fpp_hp_form_p">Predicting ideal locations, prices and competitive insights for your remote kitchen startup in Bangalore.</p>
        
        <div className='fpp_hp_form'>
          <FormControl variant="standard" className="fpp_hp_form_input">
            <InputLabel>Location</InputLabel>
            <Select
              name="location"
              value={inputs.location}
              onChange={handleChange}
            >
              {locations.map((loc) => (
                <MenuItem key={loc} value={loc}>{loc}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="standard" className="fpp_hp_form_input">
            <InputLabel>Cuisine</InputLabel>
            <Select
              name="cuisine"
              value={inputs.cuisine}
              onChange={handleChange}
            >
              {cuisines.map((cui) => (
                <MenuItem key={cui} value={cui}>{cui}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField 
            className="fpp_hp_form_input" 
            name="price" 
            label="Preferred Price For One" 
            variant="standard" 
            onChange={handleChange} 
            type='number' 
            value={inputs.price}
          />
        </div>

        <Button 
          type="submit"
          className='fpp_hp_form_button' 
          variant="contained" 
          color="error"
        >
          Predict Price and Location
        </Button>
      </form>

      {prediction && (
        <div className='fpp_hp_rec'>
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
        </div>
      )}

      {error && (
        <div>
          <h3 className='fpp_hp_rec_sugg_err'>{error}</h3>
        </div>
      )}

    </div>
  );
}

export default App;
