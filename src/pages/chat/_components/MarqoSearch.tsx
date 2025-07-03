import { useState, type FormEvent } from 'react';
import { useChat } from '../_hooks/useChat';

export const MarqoSearch = () => {

  const [value, setValue] = useState('');

  const { busy, chat, sendMessage } = useChat();

  const onSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    
    sendMessage(value);
    setValue('');
  }

  return (
    <main>
      <ul className="space-y-6 flex flex-col items-end">
        {chat.map((message, idx) => message.from === 'me' ? (
          <li 
            key={`message-${message.from}-${idx}`}
            className="bg-mocha w-2/3 rounded-3xl px-5 py-2.5">
            {message.text}
          </li>
        ) : (
          <li 
            key={`message-${message.from}-${idx}`}
            className="font-rosarivo text-white/80 whitespace-pre-line rounded-md p-4 leading-loose tracking-wide italic">
            {message.text}
          </li>
        ))}
      </ul>

      {busy && (
        <div className="font-white font-rosarivo italic text-white/50 tracking-wider text-sm">Thinking...</div>
      )}

      <form onSubmit={onSubmit} className="mt-6">
        <input 
          autoFocus
          autoCorrect="off"
          className="bg-white/10 border border-white/10 outline-none rounded-3xl px-5 py-2.5 text-white/70 tracking-wide w-full shadow-[0_0_24px_rgba(255,255,255,0.1)]"
          value={value}
          onChange={evt => setValue(evt.target.value)} />
      </form>
    </main>
  )

}