import { useState } from 'react';
import { useSearch } from './use-search';
import { useChat } from './use-chat';
import type { ChatMessage } from '@/types';

export const useMachina = () => {

  const [chat, setChat] = useState<ChatMessage[]>([]);

  const [error, setError] = useState<string | undefined>();

  const { search, busy: searchBusy } = useSearch();

  const { generateStreaming, busy: chatBusy } = useChat();

  const sendMessage = (userQuery: string) => {
    setError(undefined);
    setChat(current => ([...current, { from: 'me', text: userQuery }]));

    search(userQuery, chat)
      .then(res => {
        // Response being streamed right now
        const currentResponseIndex = chat.length + 1;

        setChat(current => ([
          ...current, 
          { from: 'machina', text: '', pages: res.pages }
        ]));

        generateStreaming(
          res.contextualizedQuery, 
          chat,
          res.pages,
          res.textContext,
          res.indexModality, 
          (chunk: string) => {
            setChat(current => {
              const updated = [...current];
                updated[currentResponseIndex] = {
                  ...updated[currentResponseIndex],
                  text: updated[currentResponseIndex].text + chunk
                };
                return updated;
              });
          }).catch(error => {
            setError(error.message);
          })
      }).catch(error => {
        setError(error.message);
      });
  }

  return { busy: searchBusy || chatBusy, chat, error, sendMessage };

}