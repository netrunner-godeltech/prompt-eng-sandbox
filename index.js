// Prosta aplikacja Node.js, która przyjmuje string i go zwraca
import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

app.post('/echo', async (req, res) => {
  const { text } = req.body;
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Brak klucza API OpenAI w zmiennej środowiskowej OPENAI_API_KEY.' });
  }
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Jesteś pomocnym asystentem programisty.' },
          { role: 'user', content: text }
        ]
      })
    });
    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || 'Brak odpowiedzi.';
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: 'Błąd podczas komunikacji z OpenAI.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API działa na porcie ${PORT}`);
});
