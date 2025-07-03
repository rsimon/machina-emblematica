import { useCallback, useState } from 'react';
import { OpenAI } from 'openai';
import type { ChatMessage } from './useChat';

const KLUSTER_AI_KEY = import.meta.env.PUBLIC_KLUSTER_AI_KEY;

const SYSTEM_PROMPT = 
`You are the Machina Emblematica – the mysterious curator of Symbola et 
Emblemata (1590) by Joachim Camerarius the Younger. You are part librarian, 
part adventuring scholar: a charming, multilingual nerd with a fondness 
for mysteries, theatrics, metaphors, forgotten languages, and the occasional pun.

When you answer, there's a hint of light-hearted pulp adventure novel in your voice. 
Think Indiana Jones or Flynn Carson! You like to quote original passages from the 
Symbola. Include a translation if you do. But you also explain, teach, point out meaning 
and intention. You like to involve visitors in a conversation, keep them engaged, draw
them deeper into the mysteries of the Symbola. You enjoy the thought of them leaving 
more knowledgeable than they arrived.

Limit your response to no more than 200 words total. That’s about one or two 
paragraphs. Keep it tight and elegant. Speak only in prose. Do not describe 
physical gestures, facial expressions, or actions (e.g., "smiles" or "opens 
book”). You are a voice, not a body.`

const client = new OpenAI({
  apiKey: KLUSTER_AI_KEY,
  baseURL: 'https://api.kluster.ai/v1',
  dangerouslyAllowBrowser: true
});

const parseResponse = (data: any) => {
  const choices = (data.choices || []);
  if (choices.length === 0) {
    console.warn('Repsonse with no choices', data);
    return undefined;
  }

  const result = choices.find((c: any) => c.message.content)?.message?.content;
  if (!result) {
    console.warn('Response with no result content', data);
    return undefined;
  }

  return result.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
}

export const useKlusterAI = () => {

  const [busy, setBusy] = useState(false);

  const generate = useCallback((question: string, context: string, chatHistory: ChatMessage[]) => {
    setBusy(true);

    return client.chat.completions.create({
      model: 'deepseek-ai/DeepSeek-R1-0528',
      max_completion_tokens: 4000,
      temperature: 0.1,
      messages: [{
        role: 'system',
        content: SYSTEM_PROMPT
      }, ...chatHistory.map(({ from, text }) => ({
        role: (from === 'machina' ? 'assistant' : 'user') as 'user' | 'assistant',
        content: text
      })), {
        role: 'user',
        content: `Summarizing from the content below, please provide an anser to the 
        following question. Take into account our previous conversation. Avoid repetitive
        opening sentences that you have used in the previous chat history. Don't start with "Ah", 
        or "Marvellous" or the likes.
        
        ${question} 

        ---
        ${context}`
      }, {
        role: 'user',
        content: question
      }]
    }).then(completion => {
      setBusy(false);
      return parseResponse(completion);
    }).catch(error => {
      console.error(error);
      setBusy(false);
    })
  }, []);

  return { generate, busy };
 
}