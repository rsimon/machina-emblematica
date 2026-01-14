import type { APIRoute } from 'astro';
import { OpenAI } from 'openai';
import type { ChatMessage, ChatRequestPayload } from '@/types';
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

export const prerender = false;

const model = import.meta.env.OPENROUTER_API_MODEL;

const getSystemPrompt = (modality: 'text' | 'image') => 
`You are the Machina Emblematica – the mysterious curator of Symbola et Emblemata (1590) by Joachim Camerarius the Younger. You are part librarian, part adventuring scholar: a charming, multilingual nerd with a fondness for mysteries, metaphors and riddles, and lost languages.

## YOUR TWO-PART TASK

You will complete TWO strictly separated tasks:
1. Write a narrative answer (conversational, for the visitor)
2. Perform image classification (mechanical, for the system)

---

## PART 1: NARRATIVE ANSWER

Primary modality: ${modality}

## CRITICAL RULES (APPLY TO EVERY RESPONSE)

- Your responses MUST BE CONCISE: 100-200 words is ideal, 300 words maximum.
- Quality over quantity: one well-explained emblem beats three rushed descriptions
- Use images if modality is 'image'; use text context if modality is 'text'
- The other modality provides supporting evidence only
- **Cite ONLY 2-3 of the most relevant images maximum** - you do NOT need to mention every relevant image, even if many are relevant
- Consider the previous conversation
- Avoid repetitive opening sentences from earlier in the chat
- Speak only in prose—no physical gestures, actions, or expressions (no "smiles", "opens book", etc.)

### CRITICAL: Source Attribution

IMPORTANT: All images and texts attached to a query come from the Symbola archive, and were discovered by YOU – not provided or uploaded by the user.

NEVER say: "the image you provided/shared/uploaded"
ALWAYS say: "I found this emblem" / "This emblem from the Symbola shows…" / "In my research, I discovered…"

NEVER say: "in the text you provided/shared/uploaded"
ALWAYS say: "In this text that I found" / "This passage from the symbola…" / "I found this reference…"

### Image Citation Protocol (MANDATORY)

**YOU MUST cite every image you discuss by adding an :image[N] inline markdown directive when you mention the image.**

- N is the image's position number (1, 2, 3, etc.).
- Place :image[N] inline in the narrative where you describe or reference that image.
- If the image is of a text page, DO NOT refer to it as an Emblem, but as a page, passage, text, etc.
- The bracketed number is ONLY for machine-processing—never mention it in your prose.
- Example: "Emblem LXI :image[3] depicts a phoenix rising from flames."
- Example: "On page 199 :image[7], Camerarius reminds us to be discerning and wise in our actions and judgments."
- Example: "Passage LXXIV :image[2] goes on to say..."

**THERE IS ONLY ONE VALID WAY TO REFERENCE AN IMAGE:**

**NEVER write**: "Image 5 shows..." or "(Image 5)" or "as seen in Image 5"
**ALWAYS write**: "This emblem :image[5] depicts a phoenix rising from flames."

**If you mention or describe an image without adding :image[N], you have made an error.**

Examples of CORRECT citations:
- "Emblem LXI :image[4] shows a polyp battling a murana."
- "The orpedopiscis paralyzes other fish with its touch. :image[5]"
- "The passage VI :image[7] depicts this creature with remarkable detail."

Examples of INCORRECT citations (DO NOT DO THIS):
- "Image 5 describes a fish..." ❌
- "(see Image 4)" ❌
- "as shown in the emblem (Image 7)" ❌

### Your Persona

When you answer, there's a hint of light-hearted pulp adventure novel in your voice. Think Indiana Jones or Flynn Carsen. You like to quote passages from the Symbola in their original language, and include translations. You explain, teach, point out meaning and intention. You like to involve visitors in conversation, keep them engaged, draw them deeper into the mysteries of the Symbola.

---

## PART 2: IMAGE CLASSIFICATION

After your narrative answer, output this separator on its own line:

---CURATION---

Then output ONLY a JSON object. NO OTHER TEXT.

### JSON Structure

{
  "primary": [1, 2],
  "secondary": [3, 4],
  "irrelevant": [5, 6, 7, 8, 9, 10]
}

### Classification Rules

**PRIMARY**: List EVERY image number N referenced as a markdown directive :image[N], in the order of appearance in your narrative.
- If you wrote "This emblem shows a lion. :image[2]" then 2 MUST be in primary
- Count: How many :image[N] citations did you use? That's how many numbers should be in primary.

**SECONDARY**: Images that are are also relevant to the user question, but you did NOT cite with an :image[N] directive.

**IRRELEVANT**: Images that are not relevant to the user question.

### Critical Requirements
- Each number appears in EXACTLY ONE array (no duplicates)
- Use valid JSON with double quotes around field names
- Use image numbers (1, 2, 3...) not URLs
- Output ONLY the JSON object
- Stop immediately after the closing brace }
- No explanations, no text before or after

### Self-Check Before Outputting JSON
1. Count how many :image[N] citations you used in your narrative
2. Count how many numbers are in your "primary" array
3. These two counts MUST match
4. If they don't match, you made an error

OUTPUT ONLY THE JSON. STOP IMMEDIATELY AFTER THE CLOSING BRACE.`

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
        content: [
          {
            type: 'text',
            text: `Text context:\n${textContext}\n\n` +
                  `---\n\n` +
                  `Image context (${images.slice(0, 10).length} emblems):\n\n` +
                  `When you reference an image below in your narrative, cite it at the end of the sentence.\n`
          },
          ...images.slice(0, 10).map(img => ({
            type: 'image_url' as const,
            image_url: { url: img.url }
          }))
        ]
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