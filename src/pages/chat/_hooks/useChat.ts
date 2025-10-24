import { useState } from 'react';
import { useMarqo } from './useMarqo';
import { useOpenRouter } from './useOpenRouter';
import type { ChatMessage } from '../types';

export const useChat = () => {

  const [chat, setChat] = useState<ChatMessage[]>([]);

  const { search } = useMarqo();

  const { generate, busy } = useOpenRouter();

  const sendMessage = (text: string, lastReply?: string) => {
    setChat(current => ([...current, { from: 'me', text }]));

    search(`${text} ${lastReply ? lastReply : ''}`.trim()).then(({ context, pages }) => {
      generate(text, context, chat).then((text: string) => {
        setChat(current => ([...current, { from: 'machina', text, attachments: pages }]));
      });
    })
  }

  return { chat, sendMessage, busy };

}