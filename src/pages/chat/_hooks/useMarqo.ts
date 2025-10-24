import { useCallback } from 'react';
import type { MarqoResponse, Page } from '../types';

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
        const pages = data.hits.reduce<Page[]>((deduplicated, hit) => {
          const url = hit.image_url;
          
          if (deduplicated.some(p => p.url === url))
            return deduplicated;

          try {
            const pageNumber = parseInt(hit.page);
            return [...deduplicated, { pageNumber, url }];
          } catch (error) {
            console.warn(error);
            console.warn('Could not parse page number', hit);
            return [...deduplicated, { url }];
          }
        }, []);

        const context = data.hits.map((d: any) => d.text_page).join('\n\n');
        return { context, pages };
      });
  }, []);

  return { search };
}