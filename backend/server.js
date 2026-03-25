import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Render health check / basic landing.
app.get('/', (req, res) => res.send('backend ok'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mongoose Schema
const flowSchema = new mongoose.Schema({
  prompt: String,
  response: String,
  createdAt: { type: Date, default: Date.now }
});
const FlowData = mongoose.model('FlowData', flowSchema);

// Endpoint 1: Call OpenRouter API
app.post('/api/ask-ai', async (req, res) => {
  const { prompt } = req.body;

  try {
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid `prompt` in request body.' });
    }
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ error: 'OPENROUTER_API_KEY is not set on the server.' });
    }

    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // Keep this aligned with OpenRouter's available model IDs.
        // You can override via env var OPENROUTER_MODEL if needed.
        "model": process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-lite-001",
        "messages": [
          {"role": "user", "content": prompt}
        ]
      })
    });

    let data;
    try {
      data = await aiResponse.json();
    } catch (e) {
      // If OpenRouter returns non-JSON (rare), fall back to text for debugging.
      data = { raw: await aiResponse.text().catch(() => null) };
    }

    if (!aiResponse.ok) {
      console.error('OpenRouter error:', {
        status: aiResponse.status,
        body: data
      });
      return res.status(502).json({
        error: 'OpenRouter request failed',
        status: aiResponse.status,
        details: data
      });
    }

    const answer = data?.choices?.[0]?.message?.content;
    if (!answer) {
      console.error('Unexpected OpenRouter response shape:', data);
      return res.status(502).json({
        error: 'OpenRouter response missing choices[0].message.content',
        details: data
      });
    }

    return res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch from AI' });
  }
});

// Endpoint 2: Save to MongoDB
app.post('/api/save', async (req, res) => {
  const { prompt, response } = req.body;
  try {
    const newRecord = new FlowData({ prompt, response });
    await newRecord.save();
    res.json({ message: 'Saved successfully', record: newRecord });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save to database' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));