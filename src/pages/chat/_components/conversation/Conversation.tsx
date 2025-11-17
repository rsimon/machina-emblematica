import { useEffect, useRef, useState, type FormEvent } from 'react';
import Markdown from 'react-markdown';
import { Frown } from 'lucide-react';
import { useChat } from '../../_hooks/useChat';
import type { Page } from '../../types';

import './Conversation.css';

interface ConversationProps {

  currentSource?: Page;

  onShowSource(page: Page): void;

}

export const Conversation = (props: ConversationProps) => {

  const [value, setValue] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  const { busy, chat, error, sendMessage } = useChat();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, busy]);

  const onSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    
    sendMessage(value);
    setValue('');
  }

  const containerClass = props.currentSource 
    ? 'container relative max-w-2xl mx-auto flex-1 flex flex-col min-h-full'
    : 'container relative max-w-2xl mx-auto flex-1 flex flex-col min-h-full';

  return (
    <div className="min-h-full flex flex-col">
      <div className={containerClass}>
        <div className="flex-1 px-4">
          <ul className="space-y-6 flex flex-col items-end py-4 pb-16">
            {chat.map((message, idx) => message.from === 'me' ? (
              <li 
                key={`message-${message.from}-${idx}`}
                className="bg-linear-to-b from-[#54493a] to-[#594c3f] w-2/3 rounded-md px-5 py-2.5 text-white/70">
                {message.text}
              </li>
            ) : message.text ? (
              <li
                key={`message-${message.from}-${idx}`}
                className="font-rosarivo text-white/80 rounded-md py-4 pr-8 leading-loose tracking-wide italic">
                <div className="llm-response">
                  <Markdown>{message.text}</Markdown>
                </div>

                {(message.attachments || []).length > 0 && (
                  <ul className="flex flex-wrap gap-2 pt-4">
                    {message.attachments?.map(page => (
                      <li key={page.imageUrl}>
                        <button 
                          className="cursor-pointer"
                          onClick={() => props.onShowSource(page)}>
                          <img 
                            src={page.imageUrl} 
                            className="rounded-full shrink-0 size-10 border-2 border-white/70 object-cover" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ) : null)}
          </ul>

          {busy && (
            <div className="font-rosarivo w-full flex italic text-white/70 tracking-wider 
              text-base mx-auto animate-pulse justify-center p-4 pb-16">
              Thinking...
            </div>
          )}
          
          {error && (
            <div className="text-white/70 space-y-4 text-sm">
              <div className="flex gap-2 items-center">
                <Frown className="size-4" /> Yikes – something went wrong
              </div>

              <div className="bg-white/5 rounded p-3 border border-white/25 text-xs font-mono leading-relaxed">
                {error}
              </div>
            </div>
          )}
     
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={onSubmit} 
          className={`sticky bottom-0 w-full py-0 shrink-0 ${props.currentSource ? 'px-4' : 'px-10'}`}>
          <div className="relative pb-6 z-10 
            before:absolute before:left-0 before:-top-6 before:z-10
            before:w-full before:h-10 before:bg-contain before:bg-center 
            before:bg-[url('/images/chat-input-top.png')] before:bg-no-repeat
            after:absolute after:left-0 after:bottom-4 after:z-10
            after:w-full after:h-3.5 after:bg-contain after:bg-center 
            after:bg-[url('/images/chat-input-bottom.png')] after:bg-no-repeat">
            <input 
              autoFocus
              autoCorrect="off"
              className="relative p-4 w-full rounded-md text-white/70 text-base tracking-wide
                outline-none bg-linear-to-b from-[#6b5d4a] to-[#8d7965] 
                shadow-[0_0_18px_rgba(0,0,0,0.8),inset_0_0_80px_rgba(0,0,0,0.6)]
                border border-[#6e5539] placeholder-mocha"
              value={value}
              placeholder="Ask me anything about the Symbola et Emblemata..."
              onChange={evt => setValue(evt.target.value)} />
          </div>

          <div className="absolute blur-2xl bottom-4 w-full left-1/2 -translate-x-1/2 h-10 bg-white/15" />
        </form>
      </div>
    </div>
  )

}