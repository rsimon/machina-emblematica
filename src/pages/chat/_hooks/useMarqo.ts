import { useCallback } from 'react';
import type { MarqoResponse } from './types';

export const useMarqo = () => {

  const search = useCallback((query: string) => {
    return fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ 
        q: query,
        limit: 10,
        searchMethod: 'HYBRID'
      })
    })
    .then(res => res.json())
    .then((data: MarqoResponse) => {
        console.log(data);
        const pages = [...new Set(data.hits.map(h => {
          const page = h.page.length === 5 ? h.page : `0${h.page}`;
          return `https://api.digitale-sammlungen.de/iiif/image/v2/${h.documentID}_${page}/full/full/0/default.jpg`
        }))];
        const context = data.hits.map((d: any) => d.text_page).join('\n\n');
        return { context, pages };
      });
  }, []);

  return { search };
}