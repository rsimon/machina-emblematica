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
        limit: 5,
        searchMethod: 'HYBRID'
      })
    })
    .then(res => res.json())
    .then((data: MarqoResponse[]) => {
      const hits = data.flatMap(r => r.hits);

      const pages = hits.reduce<Page[]>((deduplicated, hit) => {
        const imageUrl = hit.image_url;
        const viewerUrl = hit.viewer_url;
          
        if (deduplicated.some(p => p.imageUrl === imageUrl))
          return deduplicated;

        try {
          const pageNumber = parseInt(hit.page);
          return [...deduplicated, { pageNumber, imageUrl, viewerUrl }];
        } catch (error) {
          console.warn(error);
          console.warn('Could not parse page number', hit);
          return [...deduplicated, { imageUrl, viewerUrl }];
        }
      }, []);

      const context = hits.map((d: any) => d.text_page).join('\n\n');
      return { context, pages };
    });
  }, []);

  return { search };
}