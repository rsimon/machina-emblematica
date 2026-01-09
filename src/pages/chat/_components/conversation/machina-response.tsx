import { useMemo } from 'react';
import Markdown, { type Components } from 'react-markdown';
import RemarkDirective from 'remark-directive';
import type { MachinaChatMessage, Page } from '@/types';
import { ImageMarkerPlugin } from './image-marker-plugin';

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
    // Full separator streamed already – split
    const [narrative, rest] = str.split(SEPARATOR);

    try {
      const classification = JSON.parse(rest.trim());
      return { narrative: narrative.trim(), classification };
    } catch {
      return { narrative: narrative.trim() };
    }
  } else {
    // No separator or partial separator - trim if necessary
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

  const renderImageMarker = (properties: any) => {
    try {
      const n = parseInt(properties.id) - 1;
      const page = props.message.pages[n];

      return page ? (
        <button 
          className="cursor-pointer align-text-top mx-0.5"
          onClick={() => props.onShowSource(page)}>
          <img 
            src={page.imageUrl} 
            className="rounded-full size-5 border border-white/70 object-cover" />
        </button>
      ) : null;
    } catch {
      return null;
    }
  }
  
  return (
    <div>
      <div className="llm-response">
        <Markdown
          remarkPlugins={[ RemarkDirective, ImageMarkerPlugin ]}
          components={{
            'image-marker': ({ node }: any) => renderImageMarker(node.properties)
           } as Components}>{narrative}</Markdown>
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