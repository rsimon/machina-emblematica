import { useState } from 'react';
import { useMarqo } from './useMarqo';
import { useKlusterAI } from './useKlusterAI';

interface ChatMessage {

  from: 'me' | 'machina'

  text: string;

}


export const useChat = () => {

  const [chat, setChat] = useState<ChatMessage[]>([]);

  const { search } = useMarqo();

  const { generate } = useKlusterAI();

  const sendMessage = (text: string) => {
    setChat(current => ([...current, { from: 'me', text }]));
    search(text).then(context => {
      generate(text, context).then((text: string) => {
        setChat(current => ([...current, { from: 'machina', text }]));
      });
    })
  }

  return { chat, sendMessage };

}