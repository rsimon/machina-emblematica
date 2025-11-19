// lib/query-contextualizer.ts
import { ChatOpenAI } from "@langchain/openai";
import type { ChatMessage } from '../../chat/types';

const OPENROUTER_API_KEY = import.meta.env.OPENROUTER_API_KEY;
const OPENROUTER_API_MODEL = import.meta.env.OPENROUTER_API_MODEL;

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
  ): Promise<string> {
    if (chatHistory.length === 0) return currentQuery;

    // Build conversation context
    const historyText = chatHistory
      .slice(-4) // Last 4 messages for context
      .map(msg => `${msg.from === 'me' ? 'User' : 'Assistant'}: ${msg.text}`)
      .join('\n');

    const prompt = `Given the following conversation history, rewrite the user's latest question as a standalone question that includes all necessary context. Output ONLY the rewritten question, nothing else. If the user query pertains to a particular page or chapter number, emblem title or other canonical numerical reference, repeat this reference in the rewritten question.

Conversation history:
${historyText}

Latest question: ${currentQuery}

Standalone question:`;

    const response = await this.llm.invoke(prompt);
    return response.content.toString().trim();
  }
}