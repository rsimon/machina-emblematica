import { useMemo } from 'react';
import Markdown from 'react-markdown';
import type { MachinaChatMessage, Page } from '@/types';

const SEPARATOR = '\n\n---CURATION---\n\n';

interface LLMResponse {

  narrative: string;

  classification?: {

    primary: number[];

    secondary: number[];

    irrelevant: number[];

  }

}

const parseResponse = (str: string): LLMResponse => {
  if (str.includes(SEPARATOR)) {
    // Full separator streamed already
    const [narrative, rest] = str.split(SEPARATOR);

    try {
      const classification = JSON.parse(rest.trim());
      return { narrative: narrative.trim(), classification };
    } catch {
      return { narrative: narrative.trim() };
    }
  } else {
    for (let i = SEPARATOR.length - 1; i > 0; i--) {
      if (str.endsWith(SEPARATOR.slice(0, i)))
        return { narrative: str.slice(0, -i) };
    }
  
    return { narrative: str };
  }
}

interface MachinaResponseProps {

  message: MachinaChatMessage;

  onShowSource(page: Page): void;

}

export const MachinaResponse = (props: MachinaResponseProps) => {

  const { narrative, classification } = useMemo(() => parseResponse(props.message.text), [props.message.text]);

  const pages = useMemo(() => {
    if (!classification) return [];
    
    return [
      ...classification.primary,
      ...classification.secondary,
    ].map(i => props.message.pages[i - 1]);
  }, [narrative, classification, props.message.pages]);
  
  return (
    <div>
      <div className="llm-response">
        <Markdown>{narrative}</Markdown>
      </div>
      
      {pages.length > 0 && (
        <ul className="flex flex-wrap gap-2 pt-4">
          {pages.map(page => (
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
    </div>
  )


}