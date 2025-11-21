// lib/query-contextualizer.ts
import { ChatOpenAI } from "@langchain/openai";
import type { ChatMessage } from '../../../types';

const OPENROUTER_API_KEY = import.meta.env.OPENROUTER_API_KEY;
const OPENROUTER_API_MODEL = import.meta.env.OPENROUTER_API_MODEL;

export interface ContextualizedResult {

  target_index: 'text' | 'image';

  retrieval_query: string;

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
    "target_index": "text" or "image",
    "retrieval_query": "the optimized, rewritten retrieval query"
  }

Conversation history:
${history}

Latest question: ${question}`;

export class QueryContextualizer {

  private llm: ChatOpenAI;

  constructor() {
    // TODO we could use a faster, cheaper model for query rewriting
    this.llm = new ChatOpenAI({
      apiKey: OPENROUTER_API_KEY,
      modelName: OPENROUTER_API_MODEL,
      temperature: 0,
      configuration: {
        baseURL: 'https://openrouter.ai/api/v1',
      }
    });
  }

  async contextualizeQuery(
    currentQuery: string,
    chatHistory: ChatMessage[]
  ): Promise<ContextualizedResult> {
    // if (chatHistory.length === 0) currentQuery;

    // Build conversation context
    const historyText = chatHistory
      .slice(-4) // Last 4 messages for context
      .map(msg => `${msg.from === 'me' ? 'User' : 'Assistant'}: ${msg.text}`)
      .join('\n');

    const prompt = getPrompt(historyText, currentQuery);

    const response = await this.llm.invoke(prompt);

    const cleaned = response.content.toString().replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/, '');
    return JSON.parse(cleaned);
  }
}