import type { APIRoute } from 'astro';
import { OpenAI } from 'openai';
import type { ChatMessage, Page } from '../chat/types';

export const prerender = false;

const model = import.meta.env.OPENROUTER_API_MODEL;

const SYSTEM_PROMPT = 
`You are the Machina Emblematica – the mysterious curator of Symbola et 
Emblemata (1590) by Joachim Camerarius the Younger. You are part librarian, 
part adventuring scholar: a charming, multilingual nerd with a fondness 
for mysteries, metaphors, forgotten languages, and the occasional pun.

When you answer, there's a hint of light-hearted pulp adventure novel in your voice. 
Think Indiana Jones or Flynn Carsen! You like to quote original passages from the 
Symbola. Include a translation if you do. But you also explain, teach, point out meaning 
and intention. You like to involve visitors in a conversation, keep them engaged, draw
them deeper into the mysteries of the Symbola. You enjoy the thought of them leaving 
more knowledgeable than they arrived.

Any images attached to the conversation were retrieved from a vector database automatically.
When you refer to images in your reply, always refer to them as images that YOU FOUND IN THE SYMBOLA
FOR THE USER. Never refer to them as images that the user has shared with you. 

Limit your response to no more than 100 words total. That’s about one
paragraphs. Do not describe physical gestures, facial expressions, or actions (e.g., "smiles" or "opens 
book”). You are a voice, not a body.

Prohibited: The first token of any response may not be "Ah," "Ah" or any variant 
("Ahh," "Ahh," "Aah," etc.).`

const client = new OpenAI({
  apiKey: import.meta.env.OPENROUTER_API_KEY, 
  baseURL: 'https://openrouter.ai/api/v1',
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const { question, context, chatHistory, stream = false } = await request.json();
    
    const currentAttachments: Page[] = chatHistory[chatHistory.length - 1]?.attachments || [];

    const messages = [
      {
        role: 'system' as const,
        content: SYSTEM_PROMPT
      },
      ...chatHistory.map(({ from, text,  }: ChatMessage) => ({
        role: (from === 'machina' ? 'assistant' : 'user') as 'user' | 'assistant',
        content: text
      })),
      {
        role: 'user' as const,
        content: [
          ...currentAttachments.slice(0, 3).map(page => ({
            type: 'image_url',
            image_url: {
              url: page.imageUrl
            }
          })),
          {
            type: 'text',
            text: 
              `Using the given context, please answer the following question. Take into account our 
              previous conversation. Analyze the attached images and take into account what you see on them.

              ${question} 

              ---
              ${context}`
          }
        ]
      }
    ];

    // console.log(messages);

    if (stream) {
      // @ts-ignore
      const completion = await client.chat.completions.create({
        model,
        transforms: ['middle-out'], 
        max_completion_tokens: 4000,
        temperature: 0.1,
        messages,
        stream: true
      });

      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          
          try {
            for await (const chunk of completion) {
              const content = chunk?.choices[0]?.delta?.content;
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
      // @ts-ignore
      const completion = await client.chat.completions.create({
        model,
        transforms: ['middle-out'], 
        max_completion_tokens: 4000,
        temperature: 0.1,
        messages,
        stream: false,
      });

      // console.log(completion);

      if ('error' in completion) {
        return new Response(
          JSON.stringify({ error: { message: (completion.error as any).metadata?.raw || (completion.error as any).message }}),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      } else {
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
    }
  } catch (error) {
    console.error('OpenRouter proxy error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate response',
        message: (error as any).error?.message || 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}