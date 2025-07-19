# NYC Smart City - Cesium 3D Map Demo

A 3D smart city visualization platform built with Cesium.js that allows users to explore NYC neighborhoods and visualize sensor data placement with AI-powered recommendations.

## Features

- **3D NYC Map**: Interactive Cesium.js 3D globe with NYC neighborhoods
- **Neighborhood Selection**: Fly to 15 different NYC neighborhoods
- **Sensor Visualization**: Place and visualize different types of sensors (traffic, air quality, energy, water, lighting)
- **AI Integration**: OpenAI-powered sensor placement recommendations
- **Analytics Dashboard**: Real-time sensor coverage and data quality metrics
- **Dark Theme UI**: Modern, Palantir-inspired dark interface

## Neighborhoods Included

- Financial District
- Williamsburg
- Long Island City
- DUMBO
- Chelsea
- SoHo
- East Village
- West Village
- Harlem
- Astoria
- Bushwick
- Red Hook
- Gowanus
- Sunset Park

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **3D Engine**: Cesium.js 1.111
- **Backend**: Node.js, Express.js
- **AI**: OpenAI GPT-4 API
- **Development**: Vite

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd smartycity
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd smartcity-app
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # In smartcity-app/server/
   cp .env.example .env
   ```
   
   Add your OpenAI API key to the `.env` file:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development servers**
   ```bash
   # Terminal 1: Start backend server
   cd smartcity-app/server
   npm start
   
   # Terminal 2: Start frontend server
   cd smartcity-app
   npm run dev
   ```

5. **Open the application**
   - Frontend: http://localhost:5178/sandcastle-demo.html
   - Backend API: http://localhost:3002

## Usage

1. **Select a Neighborhood**: Choose from the dropdown menu in the sidebar
2. **Fly to Location**: Click "Fly to Location" to navigate to the selected neighborhood
3. **Place Sensors**: Click "Place Sensors" to visualize sensor data in the area
4. **AI Analysis**: Click "AI Analysis" to get AI-powered recommendations for sensor placement
5. **Test Camera**: Use "Test Camera" to test camera movements

## API Endpoints

### POST /api/review
Analyzes sensor placement for a neighborhood using AI.

**Request Body:**
```json
{
  "neighborhood": "Financial District",
  "sensors": [
    {
      "name": "Traffic-001",
      "type": "traffic",
      "lat": 40.7075,
      "lng": -74.0107
    }
  ]
}
```

**Response:**
```json
{
  "analysis": "Detailed AI analysis of sensor placement..."
}
```

## Project Structure

```
smartycity/
├── smartcity-app/
│   ├── public/
│   │   ├── sandcastle-demo.html    # Main 3D demo
│   │   └── test-simple.html        # Simple Cesium test
│   ├── server/
│   │   ├── index.js               # Express server
│   │   ├── package.json
│   │   └── .env                   # Environment variables
│   ├── src/
│   │   └── App.jsx                # React app (if used)
│   └── package.json
├── README.md
└── .gitignore
```

## Development

### Running in Development Mode

```bash
# Frontend (Vite dev server)
cd smartcity-app
npm run dev

# Backend (Express server)
cd smartcity-app/server
npm start
```

### Building for Production

```bash
cd smartcity-app
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Cesium.js](https://cesium.com/) for the 3D globe technology
- [OpenAI](https://openai.com/) for AI-powered recommendations
- NYC neighborhoods data and coordinates

## Support

For support, please open an issue in the GitHub repository or contact the development team. 