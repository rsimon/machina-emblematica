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
        // console.log(data);
        const pages = [...new Set(data.hits.map(h => h.image_url))];
        const context = data.hits.map((d: any) => d.text_page).join('\n\n');
        return { context, pages };
      });
  }, []);

  return { search };
}