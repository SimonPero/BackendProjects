# Unit Converter
- idea from [RoadMap.sh](https://roadmap.sh/projects/unit-converter)

## Project Overview

This project is a **Unit Converter** web application that supports conversions for **length**, **weight**, and **temperature** units. Users can select the unit type, input values, and convert between different units. The application is built using **Node.js**, **Express.js**, and features **HTML** for the front end.

## Features

- **Unit Conversion:** Supports conversion between units for length, weight, and temperature.
- **Frontend Forms:** Dynamic forms for selecting units and input values for conversion.
- **Navigation:** A header with navigation links to different types of conversions (Length, Weight, Temperature).
- **API Integration:** Converts data by sending JSON to an Express.js backend, processing the conversion, and returning the result.

## Technologies

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for Node.js.
- **HTML/CSS**: Simple front-end for form-based input.
- **JavaScript (Vanilla)**: For managing form data and dynamically updating the content.
- **Fetch API**: For sending POST requests to the backend and receiving responses.

## Project Structure

```bash
.
├── public
│   ├── length.html
│   ├── weight.html
│   ├── temperature.html
│   ├── header.js
│   ├── index.js
│   └── style.css
├── controllers
│   └── unitConvert.controller.js
├── routers
│   └── unitConvert.route.js
├── app.js
└── README.md
```

### `/public/`
- **HTML Files**: There are three separate HTML files (`length.html`, `weight.html`, and `temperature.html`) corresponding to the unit types.
- **JavaScript Files**:
  - `header.js`: Contains the logic to generate the navigation bar.
  - `index.js`: Manages the form submission and handles the API request to the backend for conversion.

### `/controllers/`
- **unitConvert.controller.js**: The controller defines the logic for handling conversion requests. It includes conversion functions for length, weight, and temperature.

### `/routers/`
- **unitConvert.route.js**: The router that defines the API endpoints for loading HTML and handling the conversion requests. It directs `/convert` POST requests to the appropriate conversion logic.

### `/app.js`
- The entry point of the project. It sets up the Express server, serves static files from the `/public` directory, and handles routing through the `unitConvert.route.js`.

## API Endpoints

1. **GET /api/**
   - Redirects to the HTML form for conversion.
   
2. **POST /api/convert**
   - Accepts JSON input to perform the conversion based on unit type, fromUnit, toUnit, and value.
   - Example Request:
     ```json
     {
       "typeUnit": "length",
       "value": 100,
       "fromUnit": "m",
       "toUnit": "km"
     }
     ```
   - Example Response:
     ```json
     {
       "value": 100,
       "convertedValue": 0.1
     }
     ```

## How to Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the server:**
   ```bash
   npm start
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

## Frontend Usage

- Navigate through the header links to select the type of unit conversion (Length, Weight, Temperature).
- Enter the values in the form and select the units.
- Click "Convert" to see the result.
  
## Example Conversions

### Length
- Convert **meters** to **kilometers**.
  
### Weight
- Convert **grams** to **pounds**.

### Temperature
- Convert **Celsius** to **Fahrenheit**.
