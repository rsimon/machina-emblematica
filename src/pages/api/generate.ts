// src/pages/api/openrouter/chat.ts
import type { APIRoute } from 'astro';
import { OpenAI } from 'openai';

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

Limit your response to no more than 200 words total. That's about one or two 
paragraphs. Keep it tight and elegant. Speak only in prose. Do not describe 
physical gestures, facial expressions, or actions (e.g., "smiles" or "opens 
book"). You are a voice, not a body.`;

// Initialize the OpenAI client on the server side
const client = new OpenAI({
  apiKey: import.meta.env.OPENROUTER_API_KEY, // Store in .env file
  baseURL: 'https://openrouter.ai/api/v1',
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const { question, context, chatHistory, stream = false } = await request.json();

    const messages = [
      {
        role: 'system' as const,
        content: SYSTEM_PROMPT
      },
      ...chatHistory.map(({ from, text }: { from: string; text: string }) => ({
        role: (from === 'machina' ? 'assistant' : 'user') as 'user' | 'assistant',
        content: text
      })),
      {
        role: 'user' as const,
        content: `Summarizing from the content below, please provide an answer to the 
        following question. Take into account our previous conversation. Avoid repetitive
        opening sentences that you have used in the previous chat history. Don't start with "Ah", 
        or "Marvellous" or the likes. Answer in the language of the question.
        
        ${question} 

        ---
        ${context}`
      }
    ];

    if (stream) {
      // STREAMING RESPONSE
      const completion = await client.chat.completions.create({
        model: 'deepseek/deepseek-chat-v3.1:free',
        max_completion_tokens: 4000,
        temperature: 0.1,
        messages,
        stream: true,
      });

      // Create a ReadableStream for the SSE response
      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          
          try {
            for await (const chunk of completion) {
              const content = chunk.choices[0]?.delta?.content;
              if (content) {
                // Send as Server-Sent Events format
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
                );
              }
            }
            
            // Send done signal
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } else {
      // NON-STREAMING RESPONSE (your current approach)
      const completion = await client.chat.completions.create({
        model: 'deepseek/deepseek-chat-v3.1:free',
        max_completion_tokens: 4000,
        temperature: 0.1,
        messages,
        stream: false,
      });

      const result = completion.choices[0]?.message?.content || '';
      const cleaned = result.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

      return new Response(
        JSON.stringify({ content: cleaned }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  } catch (error) {
    console.error('OpenRouter proxy error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate response',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};