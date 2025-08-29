# Streamable Client

Type `node ws-client.js 'your prompt'` to get a streamable response from Ollama (via Node API).

# Prompt Engineering Sandbox (MCP)

A platform for experimenting with AI prompts using MCP (Model Context Protocol).

## Features
- API for sending prompts to AI models via MCP
- Easily extensible for additional models

## Getting Started
1. Install dependencies: `npm install`
2. Start the server: `npm start`
3. Configure MCP (see https://modelcontextprotocol.io/llms-full.txt)

## Files
- `index.js` – main Express/API server
- `.github/copilot-instructions.md` – Copilot instructions

## Requirements
- Node.js 18+
- MCP Server (running locally or as a service)

## Manual Client

You can also manually open `client.html` in your browser (after starting the server)
