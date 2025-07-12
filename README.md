# Streamble client
Type node ws-client.js 'your prompt' to get streamable response from ollama (via node api)

# Prompt Engineering Sandbox (MCP)

Platforma do eksperymentowania z promptami AI przez MCP (Model Context Protocol).

## Funkcje
- API do wysyłania promptów do modeli AI przez MCP
- Łatwa rozbudowa o kolejne modele

## Start
1. Zainstaluj zależności: `npm install`
2. Uruchom serwer: `npm start`
3. Skonfiguruj MCP (patrz https://modelcontextprotocol.io/llms-full.txt)

## Pliki
- `index.js` – główny serwer Express/API
- `.github/copilot-instructions.md` – instrukcje dla Copilot

## Wymagania
- Node.js 18+
- MCP Server (np. uruchomiony lokalnie lub jako usługa)
