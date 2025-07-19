const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');

// Load environment variables
dotenv.config();

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

// OpenAI setup (v4.x)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Simple simulation state
let simulationState = {
  traffic: 'normal',
  weather: 'clear',
  events: [],
};

// POST /api/prompt: handle operator prompt and update simulation
app.post('/api/prompt', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt required' });
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a smart city simulation assistant. Given operator instructions, suggest updates to the city simulation state (traffic, weather, events).' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 100,
    });
    const aiResponse = completion.choices[0].message.content;
    // For now, just return the AI response. Later, parse and update simulationState.
    res.json({ aiResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/review: handle neighborhood review and sensor recommendations
app.post('/api/review', async (req, res) => {
  const { neighborhood, sensorData } = req.body;
  if (!neighborhood) return res.status(400).json({ error: 'Neighborhood required' });
  
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a smart city planning expert. Analyze the given neighborhood and existing sensor data to provide specific recommendations for sensor placement and city improvements. Focus on practical, actionable advice that considers the neighborhood's characteristics, existing infrastructure, and potential for smart city enhancements.`
        },
        {
          role: 'user',
          content: `Analyze the neighborhood "${neighborhood.name}" (${neighborhood.characteristics}) and provide specific sensor placement recommendations. Consider the existing sensors in the area and suggest where to place new sensors for maximum impact.`
        }
      ],
      max_tokens: 300,
    });
    
    const aiResponse = completion.choices[0].message.content;
    res.json({ review: aiResponse });
  } catch (err) {
    console.error('OpenAI API error:', err);
    res.status(500).json({ error: 'Could not connect to AI service. Please check your backend server.' });
  }
});

app.listen(port, () => {
  console.log(`Smart City backend listening at http://localhost:${port}`);
});
