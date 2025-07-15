// Prosta aplikacja Node.js, która przyjmuje string i go zwraca
import express from 'express';
import fetch from 'node-fetch';
import { WebSocketServer } from 'ws';

const app = express();
app.use(express.json());

const OLLAMA_API_URL = 'http://localhost:11434/api/chat'; // Endpoint streamujący

// REST API (jak dotychczas)
app.post('/echo', async (req, res) => {
  const { text } = req.body;
  try {
    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gemma3',
        messages: [
          { role: 'system', content: 'You are just artifical friend which should now almost everything about the world.' },
          { role: 'user', content: text }
        ]
      })
    });

    let answer = '';
    let buffer = '';

    response.body.on('data', (chunk) => {
      buffer += chunk.toString();
      let lines = buffer.split('\n');
      buffer = lines.pop(); // Ostatnia linia może być niepełna

      for (const line of lines) {
        if (line.trim()) {
          try {
            const json = JSON.parse(line);
            answer += json.message?.content || '';
          } catch {}
        }
      }
    });

    response.body.on('end', () => {
      // Przetwórz ostatnią linię w buforze
      if (buffer.trim()) {
        try {
          const json = JSON.parse(buffer);
          answer += json.message?.content || '';
        } catch {}
      }
      res.json({ answer: answer || 'Brak odpowiedzi.' });
    });

    response.body.on('error', (err) => {
      res.status(500).json({ error: 'error during communication with Ollama.' });
    });

  } catch (err) {
    res.status(500).json({ error: 'error during communication with Ollama.' });
  }
});

// WebSocket streaming
const wss = new WebSocketServer({ port: 8081 });

wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
    let messages;
    try {
      messages = JSON.parse(message.toString());
    } catch {
      // Jeśli nie uda się sparsować, potraktuj jako pojedynczy prompt
      messages = [
        { role: 'system', content: 'You are just artifical friend which should now almost everything about the world.' },
        { role: 'user', content: message.toString() }
      ];
    }
    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemma3',
        messages
      })
    });

    let buffer = '';
    response.body.on('data', (chunk) => {
      buffer += chunk.toString();
      let lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (line.trim()) {
          try {
            const json = JSON.parse(line);
            ws.send(json.message?.content || '');
          } catch {}
        }
      }
    });
    response.body.on('end', () => {
      if (buffer.trim()) {
        try {
          const json = JSON.parse(buffer);
          ws.send(json.message?.content || '');
        } catch {}
      }
      ws.send('[END]');
    });
    response.body.on('error', () => {
      ws.send('[ERROR]');
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API działa na porcie ${PORT}`);
});
