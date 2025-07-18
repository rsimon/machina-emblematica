import { useState } from 'react';
import { useMarqo } from './useMarqo';
import { useKlusterAI } from './useKlusterAI';

export interface ChatMessage {

  from: 'me' | 'machina'

  text: string;

  attachments?: string[];

}


export const useChat = () => {

  const [chat, setChat] = useState<ChatMessage[]>([]);

  const { search } = useMarqo();

  const { generate, busy } = useKlusterAI();

  const sendMessage = (text: string, lastReply?: string) => {
    setChat(current => ([...current, { from: 'me', text }]));

    search(`${text} ${lastReply ? lastReply : ''}`.trim()).then(({ context, pages }) => {
      generate(text, context, chat).then((text: string) => {
        const attachments = pages.map(str => `${str.replaceAll('_', '/')}.jpg`);
        setChat(current => ([...current, { from: 'machina', text, attachments }]));
      });
    })
  }

  return { chat, sendMessage, busy };

}