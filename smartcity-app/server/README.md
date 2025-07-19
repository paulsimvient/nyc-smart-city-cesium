# Smart City Backend Server

## OpenAI Integration Setup

To enable AI-powered sensor recommendations, you need to configure your OpenAI API key:

### 1. Get an OpenAI API Key
- Go to [OpenAI Platform](https://platform.openai.com/api-keys)
- Sign in or create an account
- Create a new API key

### 2. Configure the API Key
Create a `.env` file in the `smartcity-app/server/` directory:

```bash
# OpenAI API Configuration
OPENAI_API_KEY=your_actual_api_key_here

# Server Configuration
PORT=3002
NODE_ENV=development
```

### 3. Start the Server
```bash
cd smartcity-app/server
npm install
npm start
```

### 4. Test the AI Integration
1. Start the frontend: `cd smartcity-app && npm run dev`
2. Open http://localhost:5178/sandcastle-demo.html
3. Select a neighborhood and click "AI Analysis"

## API Endpoints

### POST /api/review
Analyzes neighborhoods and provides sensor placement recommendations.

**Request:**
```json
{
  "neighborhood": {
    "name": "Financial District",
    "characteristics": "Financial District is an urban neighborhood in NYC..."
  },
  "sensorData": [...]
}
```

**Response:**
```json
{
  "review": "AI-generated recommendations for sensor placement..."
}
```

## Troubleshooting

- **"API key not configured"**: Make sure your `.env` file exists and contains the correct API key
- **"Could not connect to AI service"**: Check your internet connection and API key validity
- **Rate limiting**: OpenAI has usage limits. Consider upgrading your plan if needed

## Cost Optimization

This implementation uses:
- **Model**: `gpt-3.5-turbo` (cost-effective)
- **Max tokens**: 250 (keeps responses concise)
- **Temperature**: 0.7 (balanced creativity and consistency) 