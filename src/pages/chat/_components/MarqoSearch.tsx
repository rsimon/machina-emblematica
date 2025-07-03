import { useState, type FormEvent } from 'react';
import { useChat } from '../_hooks/useChat';

export const MarqoSearch = () => {

  const [value, setValue] = useState('');

  const { chat, sendMessage } = useChat();

  const onSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    
    sendMessage(value);
    setValue('');
  }

  return (
    <main className="text-white">
      <ul className="space-y-6">
        {chat.map((message, idx) => (
          <li 
            key={`message-${message.from}-${idx}`}
            className="whitespace-pre-line bg-white/50 rounded-md p-4 ">
            {message.text}
          </li>
        ))}
      </ul>
      <form onSubmit={onSubmit}>
        <input 
          autoFocus
          autoCorrect="off"
          className="bg-white rounded-md p-2 text-black w-full"
          value={value}
          onChange={evt => setValue(evt.target.value)} />
      </form>
    </main>
  )

}