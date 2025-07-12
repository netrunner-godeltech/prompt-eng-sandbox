import WebSocket from 'ws';

// Adres serwera WebSocket
const ws = new WebSocket('ws://localhost:8081');

// Prompt do wysłania (możesz zmienić na dowolny)
const prompt = process.argv[2] || 'Hello, how are you?';

ws.on('open', () => {
  ws.send(prompt);
});

ws.on('message', (data) => {
  if (data === '[END]') {
    ws.close();
  } else if (data === '[ERROR]') {
    console.error('Błąd podczas komunikacji z serwerem!');
    ws.close();
  } else {
    process.stdout.write(data);
  }
});

ws.on('close', () => {
  process.stdout.write('\n[Połączenie zamknięte]\n');
});