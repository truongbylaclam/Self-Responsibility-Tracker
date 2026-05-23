/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client Lazily/Safely so it doesn't crash if API key is missing
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API endpoint for financial & project tracking suggestions using Gemini
app.post('/api/fintrack/ai-suggest', async (req, res) => {
  try {
    const { goals, projects, todos } = req.body;

    const ai = getAi();
    const systemPrompt = `You are a professional cross-platform Kotlin Multiplatform (KMP) finance adviser and engineering coordinator.
Analyze the user's current personal finance goals, active project budgets, and todo items.
Formulate 3 specific, context-aware suggestions.
At least one should focus on financial optimization (e.g., budget buffers, emergency funding, tax milestones).
At least one should focus on engineering/project execution (e.g., SQLite SQLDelight driver optimization, state sync tasks, checklist prioritization).
Deliver your response strictly in the requested JSON structure. Keep description concise (1-2 sentences).`;

    const contents = `
Goals: ${JSON.stringify(goals)}
Projects: ${JSON.stringify(projects)}
Todos: ${JSON.stringify(todos)}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  category: { type: Type.STRING, description: "e.g., Savings, Budget, Development, Database Sync" },
                },
                required: ['id', 'title', 'description', 'category'],
              },
            },
          },
          required: ['suggestions'],
        },
      },
    });

    const text = response.text || '{"suggestions":[]}';
    res.setHeader('Content-Type', 'application/json');
    res.send(text);
  } catch (error: any) {
    console.error('Gemini API query error:', error);
    // Return gracefully so the UI can display a helpful fallback recommendation if the key is not set yet
    res.status(200).json({
      suggestions: [
        {
          id: 'fb-1',
          title: 'Establish a Kotlin DB Driver Thread Safety Pool',
          description: 'Ensure SQLDelight drivers are isolated using single-threaded dispatches or mutual exclusion blocks to avoid synchronization locking blocks in cross-platform code.',
          category: 'Development'
        },
        {
          id: 'fb-2',
          title: 'Emergency Reserve Liquidation Review',
          description: 'Assess Emergency Reserve Goal progress. Allocate a 10% cash equivalent runway as a buffer before starting high-budget milestones.',
          category: 'Budget'
        },
        {
          id: 'fb-3',
          title: 'Unify Task Checkpoints with Calendar Alerts',
          description: 'Connect local SQLite Todos directly to upcoming calendar deadlines to maintain clear synchronization checkpoints.',
          category: 'Database Sync'
        }
      ],
      aiConfigured: false,
    });
  }
});

// Configure Vite or Serve static production content
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
