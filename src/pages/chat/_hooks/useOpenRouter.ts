import { useCallback, useState } from 'react';
import type { ChatMessage, Page } from '../types';

export const useOpenRouter = () => {

  const [busy, setBusy] = useState(false);

  // Non-streaming version
  const generate = useCallback((question: string, context: string, chatHistory: ChatMessage[], modality: 'text' | 'image') => {
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
        modality,
        stream: false,
      }),
    })
    .then(res => res.json())
    .then(data => {
      setBusy(false);
      console.error(data);
      
      if (data.error) {
        throw new Error(data.message);
      } else {
        return data.content;
      }
    }).catch(error => {
      setBusy(false);
      throw new Error(error);
    })
  }, []);

  const generateStreaming = useCallback(
    (
      question: string, 
      context: string, 
      pages: Page[],
      chatHistory: ChatMessage[],
      modality: 'text' | 'image',
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
          pages,
          chatHistory,
          modality,
          stream: true,
        }),
      }).then(async response => {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error('No reader available');
        }

        let fullContent = '';

        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              
              if (data === '[DONE]') break;

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  setBusy(false);

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
        setBusy(false);
        throw error;
      });
    },
    []
  );

  return { generate, generateStreaming, busy };
 
}