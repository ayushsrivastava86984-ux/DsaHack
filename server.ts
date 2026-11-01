import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '1mb' }));

// Server-side Gemini API client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI DSA Mentor Endpoint
app.post('/api/gemini/mentor', async (req: Request, res: Response): Promise<void> => {
  const { prompt, mode = 'general_chat', problemTitle, problemDescription, userCode, language = 'Python' } = req.body;

  try {
    if (ai) {
      const systemInstruction = `You are "DsaHack AI Mentor", a friendly, world-class Data Structures & Algorithms coach.
Your personality is encouraging, clear, and pedagogical.
Tone: friendly, professional, developer-focused, concise.
Colors and branding of DsaHack: "Code. Compete. Conquer."

Rules:
1. When asked for hints, provide progressive hints: start with a conceptual nudge (Level 1: Intuition), then Level 2: Approach/Data structure, Level 3: Pseudocode sketch. Do NOT blurt out the direct complete code solution unless explicitly requested.
2. When explaining code, be structured and point out time & space complexity clearly.
3. Support Java, Python, JavaScript, C++, and C.
4. Format output with clean markdown headers and backtick code snippets.`;

      let userPrompt = prompt || '';
      if (mode === 'hint') {
        userPrompt = `Problem: ${problemTitle || 'DSA Problem'}\nDescription: ${problemDescription || ''}\nCurrent Code (${language}):\n${userCode || 'None'}\n\nPlease give me a progressive hint (start with high-level intuition without giving away the full answer) for this problem.`;
      } else if (mode === 'explain_problem') {
        userPrompt = `Problem: ${problemTitle}\nDescription: ${problemDescription}\n\nPlease explain this problem simply, highlight the tricky edge cases, and clarify the core invariant or pattern needed to solve it.`;
      } else if (mode === 'complexity') {
        userPrompt = `Problem: ${problemTitle}\nCode (${language}):\n${userCode}\n\nPlease analyze the Time Complexity and Space Complexity of this code. Provide Big-O notation, explain each component step-by-step, and state whether it can be further optimized.`;
      } else if (mode === 'line_by_line') {
        userPrompt = `Please explain this ${language} code line by line with clear comments and logic:\n\n${userCode}`;
      } else if (mode === 'optimize') {
        userPrompt = `Here is my current solution in ${language} for ${problemTitle}:\n\n${userCode}\n\nHow can I optimize this algorithm for lower runtime and less memory? Suggest alternative data structures or techniques.`;
      } else if (mode === 'generate_practice') {
        userPrompt = `Based on the topic ${problemTitle || 'current DSA topic'}, create a follow-up interview practice problem with: Problem Title, Difficulty, Problem Statement, 2 Examples with Input/Output, Constraints, and a Brief Starter template in ${language}.`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction,
        },
      });

      const reply = response.text || "I'm here to help you conquer your algorithms! What would you like to review next?";
      res.json({ success: true, text: reply });
      return;
    }
  } catch (error: any) {
    console.error('Gemini API call failed:', error?.message || error);
    // Graceful fallback response will follow below
  }

  // Graceful pedagogical fallback when offline or if API key isn't provided
  let fallbackReply = `### DsaHack AI Mentor Insight 💡\n\n`;
  if (mode === 'hint') {
    fallbackReply += `**Step 1: Understand the Invariant**\nNotice that if the input has sorted properties or asks for subarray sums, an optimal approach usually uses **Two Pointers**, a **Hash Map**, or a **Sliding Window**.\n\n**Hint:** Rather than nested loops ($O(N^2)$), compute what complement value you need at index $i$, and store seen elements in an auxiliary table ($O(1)$ average lookup).`;
  } else if (mode === 'complexity') {
    fallbackReply += `**Complexity Breakdown:**\n- **Time Complexity:** $O(N)$ because each element is traversed at most twice through single passes or linear pointer movements.\n- **Space Complexity:** $O(N)$ worst-case for auxiliary hash storage / recursion stack, or $O(1)$ if in-place array manipulation is utilized.`;
  } else if (mode === 'explain_problem') {
    fallbackReply += `**Core Intuition:**\nIdentify the core pattern: is it divide-and-conquer, graph traversal, or greedy choice? Pay special attention to edge cases like empty arrays, negative integers, and duplicate keys.`;
  } else {
    fallbackReply += `Keep up the momentum! Remember: practice builds intuition. Start by writing down sample inputs on paper, trace step-by-step, and test your base cases before writing the code.`;
  }

  res.json({ success: true, text: fallbackReply, fallback: true });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`DsaHack server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
