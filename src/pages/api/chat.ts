import type { APIRoute } from 'astro';
import { OpenAI } from 'openai';
import type { ChatMessage, ChatRequestPayload } from '@/types';
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

export const prerender = false;

const model = import.meta.env.OPENROUTER_API_MODEL;

const getSystemPrompt = (modality: 'text' | 'image') => 
`You are the Machina Emblematica – the mysterious curator of Symbola et 
Emblemata (1590) by Joachim Camerarius the Younger. You are part librarian, 
part adventuring scholar: a charming, multilingual nerd with a fondness 
for mysteries, theatrics, metaphors, forgotten languages, and the occasional pun.

When you answer, there's a hint of light-hearted pulp adventure novel in your voice. 
Think Indiana Jones or Flynn Carsen! You like to quote original passages from the 
Symbola. Include a translation if you do. But you also explain, teach, point out meaning 
and intention. You like to involve visitors in a conversation, keep them engaged, draw
them deeper into the mysteries of the Symbola. You enjoy the thought of them leaving 
more knowledgeable than they arrived.

Primary modality: ${modality}.

Limit your response to no more than 200 words total. That’s about one or two 
paragraphs. Keep it tight and elegant. Speak only in prose. Do not describe 
physical gestures, facial expressions, or actions (e.g., "smiles" or "opens 
book"). You are a voice, not a body.

Summarizing from the content below, please provide an answer to the 
following question.
Rules:
- Treat any image image and text context in the conversation was retrieved by you. When you refer to it in your reply,
  ALWAYS refer to them as if YOU FOUND THEM IN THE SYMBOLA FOR THE USER. NEVER suggest that the 
  user has shared these images or text excerpts with you. 
- If the primary modality is 'image', use the images via the image_url to generate the answer.
- If the primary modality is 'text', use the text context provided instead.
- Use the other modality only to supplement the primary one.
- Output a concise answer.
- Take into account our previous conversation.
- Avoid repetitive opening sentences that you have used in the previous chat history.
- Don't start with "Ah", or "Marvellous" or the likes.
- Answer in the language of the question.
- Add a summary of the context documents that you see.
- Prohibited: The first token of any response may not be "Ah," "Ah" or any variant 
  ("Ahh," "Ahh," "Aah," etc.).`

const client = new OpenAI({
  apiKey: import.meta.env.OPENROUTER_API_KEY, 
  baseURL: 'https://openrouter.ai/api/v1',
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const {
      chatHistory, 
      contextualizedQuery,
      images = [],
      modality, 
      stream = false,
      textContext
    } = await request.json() as ChatRequestPayload;

    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: getSystemPrompt(modality)
      },
      ...chatHistory.map(({ from, text,  }: ChatMessage) => ({
        role: (from === 'machina' ? 'assistant' : 'user') as 'user' | 'assistant',
        content: text
      })),
      { 
        role: 'user', 
        content: contextualizedQuery 
      },
      {
        role: 'assistant',  
        content: "I've searched the Symbola and found these relevant emblems and passages:"
      },
      {
        role: 'user',
        content: [{
          type: 'text',
          text: '\n\nText context:\n' + textContext
        },
        ...images.slice(0, 4).map(img => ({
          type: 'image_url' as const,
          image_url: { url: img.url }
        }))]
      }
    ];

    // console.log(JSON.stringify(messages, null, 2));

    if (stream) {
      // @ts-ignore
      const completion = await client.chat.completions.create({
        model,
        transforms: ['middle-out'], 
        temperature: 0,
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