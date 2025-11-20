import { useState } from 'react';
import { useMarqo } from './useMarqo';
import { useOpenRouter } from './useOpenRouter';
import type { ChatMessage } from '../types';

export const useChat = () => {

  const [chat, setChat] = useState<ChatMessage[]>([]);

  const [searchBusy, setSearchBusy] = useState(false);

  const [error, setError] = useState<string | undefined>();

  const { search } = useMarqo();

  const { generateStreaming, busy } = useOpenRouter();

  const sendMessage = (text: string) => {
    setSearchBusy(true);
    setError(undefined);
    setChat(current => ([...current, { from: 'me', text }]));

    search(text, chat)
      .then(({ context, pages, contextualizedQuery }) => {
        setSearchBusy(false);

        // Response being streamed right now
        const currentResponseIndex = chat.length + 1;

        setChat(current => ([
          ...current, 
          { from: 'machina', text: '', attachments: pages }
        ]));

        generateStreaming(contextualizedQuery, context, chat, (chunk: string) => {
          setChat(current => {
            const updated = [...current];
              updated[currentResponseIndex] = {
                ...updated[currentResponseIndex],
                text: updated[currentResponseIndex].text + chunk
              };
              return updated;
            });
        // }).then((text: string) => {
        //  setChat(current => ([...current, { from: 'machina', text, attachments: pages }]));
        }).catch(error => {
          setError(error.message);
        })
      }).catch(error => {
        setError(error.message);
      });
  }

  return { busy: busy || searchBusy, chat, error, sendMessage };

}