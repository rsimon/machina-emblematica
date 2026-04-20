import { OpenAI } from 'openai';
import type { ChatMessage } from '@/types';

const OPENROUTER_API_KEY = import.meta.env.OPENROUTER_API_KEY;
const OPENROUTER_API_MODEL = import.meta.env.OPENROUTER_API_MODEL;

const client = new OpenAI({
  apiKey: OPENROUTER_API_KEY, 
  baseURL: 'https://openrouter.ai/api/v1',
});

export interface ContextualizationResult {
  
  contextualizedQuery: string;
  
  indexModality: 'text' | 'image';

}

const getPrompt = (history: string, question: string) =>  
`You are a Retrieval Router Agent for a RAG system using two vector indexes:
1. A TEXT index
2. An IMAGE index

You have two tasks:

1. Given the conversation history, rewrite the user's latest question as a standalone retrieval query 
that includes all necessary context. If the user question pertains to a particular page or 
chapter number, emblem title or other canonical numerical reference, repeat this reference 
in the rewritten query.

2. Decide which index is the best match for the user's query. Decision rules:
- If the user asks about images, pictures, visual similarity, appearance, color, shapes → choose "image".
- If the user asks about text meaning, authors, facts, historical explanations, interpretations → choose "text".
- If ambiguous, choose "text".

Return ONLY JSON. Do not show your reasoning or thought process.

Output a JSON object with:
  {
    "indexModality": "text" or "image",
    "contextualizedQuery": "the optimized, rewritten retrieval query"
  }

Conversation history:
${history}

Latest question: ${question}`;

export const contextualizeQuery = async (userQuery: string, history: ChatMessage[]): Promise<ContextualizationResult> => {
  // Build conversation context
  const historyContext = history
    .slice(-4) // Last 4 messages for context
    .map(msg => `${msg.from === 'me' ? 'user' : 'assistant'}: ${msg.text}`)
    .join('\n');

  const prompt = getPrompt(historyContext, userQuery);

  const response = await client.chat.completions.create({
    model: OPENROUTER_API_MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0
  });

  const content = response.choices[0]?.message?.content || '';
  const fenceMatch = content.match(/```(?:json)?\s*\r?\n([\s\S]*?)\r?\n\s*```/i);
  const cleaned = fenceMatch ? fenceMatch[1].trim() : content.trim();

  if (!cleaned) {
    console.error('Query contextualization failed');
    console.error(userQuery);
    console.log(JSON.stringify(content));
  }

  return cleaned ? JSON.parse(cleaned) : { indexModality: 'text', contextualizedQuery: userQuery};
}