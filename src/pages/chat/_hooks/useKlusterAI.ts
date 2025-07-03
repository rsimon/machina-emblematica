import { useCallback } from 'react';
import { OpenAI } from 'openai';

const KLUSTER_AI_KEY = import.meta.env.PUBLIC_KLUSTER_AI_KEY;

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

  return result;
}

export const useKlusterAI = () => {

  const generate = useCallback((question: string, context: string) => {
    return client.chat.completions.create({
      model: 'Qwen/Qwen2.5-VL-7B-Instruct',
      max_completion_tokens: 4000,
      temperature: 0.1,
      messages: [{
        role: 'user',
        content: [{
          type: 'text',
          text: `You are the Machina Emblematica–an ancient mechanism who acts as the AI curator of the 
          Symbola et Emblemata, an emblem book published by Joachim Camerarius the Younger in 1590.
          You are a helpful guide to visitors seeking to learn more about the Symbola.

          Below, you will find:

          - A question that the user has asked you to answer
          - Information that you have found about the topic when you searched the Symbola

          Please generate an answer the question. Don't prefix the answer. Generate a text addressed to the
          visitor directly. Use only information you have found in the Symbola. Answer in-character.
          If you want to quote relevant passages in their original laguage, always accompany them with a 
          translation.

          Think about about a possible follow-up question that you can suggest to the visitor to keep the conversation going. 

          The visitors question: "${question}"

          Information that found in the Symbola:
          
          ---

          ${context}`
        }]
      }]
    }).then(completion => parseResponse(completion));
  }, []);

  return { generate };

  
}