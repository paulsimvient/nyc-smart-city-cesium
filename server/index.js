const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');

dotenv.config();

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

let simulationState = {
  traffic: 'normal',
  weather: 'clear',
  events: [],
};

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
    res.json({ aiResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Smart City backend listening at http://localhost:${port}`);
}); 