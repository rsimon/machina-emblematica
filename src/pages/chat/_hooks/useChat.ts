import { useState } from 'react';
import { useMarqo } from './useMarqo';
import { useKlusterAI } from './useKlusterAI';

export interface ChatMessage {

  from: 'me' | 'machina'

  text: string;

}


export const useChat = () => {

  const [chat, setChat] = useState<ChatMessage[]>([]);

  const { search } = useMarqo();

  const { generate, busy } = useKlusterAI();

  const sendMessage = (text: string, lastReply?: string) => {
    setChat(current => ([...current, { from: 'me', text }]));
    search(`${text} ${lastReply ? lastReply : ''}`.trim()).then(context => {
      generate(text, context, chat).then((text: string) => {
        setChat(current => ([...current, { from: 'machina', text }]));
      });
    })
  }

  return { chat, sendMessage, busy };

}