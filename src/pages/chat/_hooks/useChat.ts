import { useState } from 'react';
import { useMarqo } from './useMarqo';
import { useOpenRouter } from './useOpenRouter';
import type { ChatMessage } from '../types';

export const useChat = () => {

  const [chat, setChat] = useState<ChatMessage[]>([]);

  const [error, setError] = useState<string | undefined>();

  const { search } = useMarqo();

  const { generate, busy } = useOpenRouter();

  const sendMessage = (text: string, lastReply?: string) => {
    setError(undefined);
    setChat(current => ([...current, { from: 'me', text }]));

    search(`${text} ${lastReply ? lastReply : ''}`.trim())
      .then(({ context, pages }) => {
        generate(text, context, chat).then((text: string) => {
          setChat(current => ([...current, { from: 'machina', text, attachments: pages }]));
        }).catch(error => {
          console.log('caught it', JSON.stringify(error));
          setError(error);
        })
      }).catch(error => {
        console.log('yikes error!')
        console.error(error);
        setError(error.message);
      });
  }

  return { busy, chat, error, sendMessage };

}