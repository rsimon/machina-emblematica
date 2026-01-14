import { useCallback, useState } from 'react';
import type { ChatMessage, ChatRequestPayload, Page } from '../../../types';

export const useChat = () => {

  const [busy, setBusy] = useState(false);

  /**
   * Queries the chat endpoint (non-streaming version).
   */
  const generate = useCallback((
    contextualizedQuery: string, 
    chatHistory: ChatMessage[], 
    pages: Page[],
    textContext: string, 
    modality: 'text' | 'image'
  ) => {
    setBusy(true);

    const payload: ChatRequestPayload = {
      contextualizedQuery,
      chatHistory,
      images: pages.map(p => ({ url: p.imageUrl })),
      textContext,
      modality,
      stream: false
    };

    return fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
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
  
  /**
   * Queries the chat endpoint (streaming version).
   */
  const generateStreaming = useCallback((
    contextualizedQuery: string, 
    chatHistory: ChatMessage[],
    pages: Page[],
    textContext: string,
    modality: 'text' | 'image',
    onChunk: (chunk: string) => void
  ) => {
    setBusy(true);

    const payload: ChatRequestPayload = {
      contextualizedQuery,
      chatHistory,
      images: pages.map(p => ({ url: p.imageUrl })),
      textContext,
      modality,
      stream: true
    };

    return fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then(async response => {
      if (!response.ok) {
        console.error (response);
        throw new Error(`HTTP error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader)
        throw new Error('No reader available');

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

      // console.log(fullContent);

      return fullContent.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    }).catch(error => {
      setBusy(false);
      throw error;
    });
  }, []);

  return { generate, generateStreaming, busy };
 
}