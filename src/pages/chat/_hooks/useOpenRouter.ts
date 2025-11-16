import { useCallback, useState } from 'react';
import type { ChatMessage } from '../types';

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

export const useOpenRouter = () => {

  const [busy, setBusy] = useState(false);

  // Non-streaming version
  const generate = useCallback((question: string, context: string, chatHistory: ChatMessage[]) => {
    setBusy(true);

    return fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        context,
        chatHistory,
        stream: false,
      }),
    })
    .then(res => res.json())
    .then(data => {
      setBusy(false);
      if (data.error) {
        throw data.message;
      } else {
        return data.content;
      }
    })
    .catch(error => {
      setBusy(false);
      throw error;
    });
  }, []);

  const generateStreaming = useCallback(
    (
      question: string, 
      context: string, 
      chatHistory: ChatMessage[],
      onChunk: (chunk: string) => void
    ) => {
      setBusy(true);

      return fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          context,
          chatHistory,
          stream: true,
        }),
      })
        .then(async response => {
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();

          if (!reader) {
            throw new Error('No reader available');
          }

          let fullContent = '';

          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              setBusy(false);
              break;
            }

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                
                if (data === '[DONE]') {
                  setBusy(false);
                  break;
                }

                try {
                  const parsed = JSON.parse(data);
                  if (parsed.content) {
                    fullContent += parsed.content;
                    onChunk(parsed.content);
                  }
                } catch (e) {
                  // console.warn('Invalid JSON', e, data);
                }
              }
            }
          }

          return fullContent.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
        })
        .catch(error => {
          console.error(error);
          setBusy(false);
        });
    },
    []
  );

  return { generate, generateStreaming, busy };
 
}