# Google Maps Setup

## Getting Started

1. **Get a Google Maps API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the "Maps JavaScript API"
   - Go to "Credentials" and create an API key
   - Restrict the key to your domain for security

2. **Configure Environment:**
   - Create a `.env` file in the `smartcity-app` directory
   - Add your API key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

## Features

- Interactive Google Maps with dark theme styling
- Example marker at New York City coordinates
- Responsive design that fits the smart city interface
- Compatible with React 19
- Custom dark theme that matches your app's aesthetic

## Customization

- Change the initial coordinates in `src/components/Map.jsx`
- Modify the map styling by editing the `options.styles` array
- Add more markers, info windows, or interactive features
- Customize the marker appearance and behavior

## Google Maps Features Available

- Street view
- Satellite view
- Traffic data
- Places API integration
- Directions API
- Geocoding
- Custom styling 