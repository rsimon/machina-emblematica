import { useCallback, useState } from 'react';
import type { 
  ChatMessage, 
  Page, 
  SearchResponse, 
  SearchRequestPayload 
} from '@/types';

interface UseSearchResponse {

  contextualizedQuery: string;

  indexModality: 'text' | 'image';

  indexName: string;

  originalQuery: string;

  pages: Page[];

  textContext: string;

}

export const useSearch = () => {

  const [busy, setBusy] = useState(false);

  /**
   * Queries the search endpoint which performs the following steps:
   * - Contextualizes the query, returning the appropriate modality and rewritte query version
   * - Searches the index
   * 
   * Normalizes/simplifies results:
   * - De-duplicates pages
   * - Merges text results into a single 'context' string
   */
  const search = useCallback((q: string, history: ChatMessage[]): Promise<UseSearchResponse> => {
    setBusy(true);

    const payload: SearchRequestPayload = { q, history };

    return fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then((data: SearchResponse) => {
      setBusy(false);

      const pages = data.hits.reduce<Page[]>((deduplicated, hit) => {
        const id = `${hit.document}::${hit.page}`;
        const imageUrl = hit.image_url;
        const viewerUrl = hit.viewer_url;
          
        if (deduplicated.some(p => p.imageUrl === imageUrl))
          return deduplicated;

        try {
          const pageNumber = parseInt(hit.page);
          return [...deduplicated, { id, pageNumber, imageUrl, viewerUrl }];
        } catch (error) {
          console.warn(error);
          console.warn('Could not parse page number', hit);
          return [...deduplicated, { id, imageUrl, viewerUrl }];
        }
      }, []);

      const textContext = data.hits.map((d: any) => d.text_page).join('\n\n');

      return {
        contextualizedQuery: data.contextualizedQuery,
        indexModality: data.indexModality,
        indexName: data.indexName,
        originalQuery: q,
        pages,
        textContext
      }
    }).catch(error => {
      setBusy(false);
      throw new Error(error);
    })
  }, []);

  return { search, busy };
}