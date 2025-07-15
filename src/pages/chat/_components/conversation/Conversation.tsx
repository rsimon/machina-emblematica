import { useEffect, useRef, useState, type FormEvent } from 'react';
import Markdown from 'react-markdown';
import { useChat } from '../../_hooks/useChat';

interface ConversationProps {

  showSources: boolean;

}

export const Conversation = (props: ConversationProps) => {

  const [value, setValue] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  const { busy, chat, sendMessage } = useChat();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, busy]);

  const onSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    
    sendMessage(value);
    setValue('');
  }

  const containerClass = props.showSources 
    ? 'container relative max-w-2xl mx-auto flex-1 flex flex-col min-h-full'
    : 'container relative max-w-2xl mx-auto flex-1 flex flex-col min-h-full';

  return (
    <div className="min-h-full flex flex-col">
      <div className={containerClass}>
        <div className="flex-1 px-4">
          <ul className="space-y-6 flex flex-col items-end py-4">
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
                <Markdown>{message.text}</Markdown>
              </li>
            ))}
          </ul>

          {busy && (
            <div className="font-rosarivo italic text-white/70 tracking-wider text-base mx-auto animate-pulse pb-4">Thinking...</div>
          )}

          <div ref={chatEndRef} />
        </div>

        <form onSubmit={onSubmit} className="sticky bottom-0 w-full px-4 py-0 flex-shrink-0">
          <div className="relative pb-6 z-10 
            before:absolute before:left-0 before:-top-8 before:z-10
            before:w-full before:h-12 before:bg-contain before:bg-center 
            before:bg-[url('/images/chat-input-top.png')] before:bg-no-repeat
            after:absolute after:left-0 after:bottom-3 after:z-10
            after:w-full after:h-5.5 after:bg-contain after:bg-center 
            after:bg-[url('/images/chat-input-bottom.png')] after:bg-no-repeat">
            <input 
              autoFocus
              autoCorrect="off"
              className="relative p-4 w-full rounded-md text-white/70 text-base tracking-wide
                outline-none bg-gradient-to-b from-[#6b5d4a] to-[#a79077] 
                shadow-[0_0_18px_rgba(0,0,0,0.8),inset_0_0_80px_rgba(0,0,0,0.6)]
                border border-[#6e5539] placeholder-[#a79077]"
              value={value}
              placeholder="Ask any question..."
              onChange={evt => setValue(evt.target.value)} />
          </div>

          <div className="absolute blur-2xl bottom-4 w-full left-1/2 -translate-x-1/2 h-10 bg-white/15" />
        </form>
      </div>
    </div>
  )

}