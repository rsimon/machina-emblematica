import { useCallback } from 'react';
import type { MarqoResponse } from './types';

// https://colab.research.google.com/drive/1rEUaYDLIvpOo5ZTQW6-YqlOzs6_ZdL8c?authuser=1

// https://docs.marqo.ai/latest/reference/api/search/search/
const BASE_URL = 'http://92.112.48.13:8882';

const INDEX = 'camerarius_testIndex_full-texts'

export const useMarqo = () => {

  const search = useCallback((query: string) => {
    return fetch(`/indexes/${INDEX}/search`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ 
        q: query,
        limit: 10,
        searchMethod: 'HYBRID'
      })
    }).then(res => res.json()).then((data: MarqoResponse) => {
      const pages = [...new Set(data.hits.map(h => h.textID))];
      const context = data.hits.map((d: any) => d.text_page).join('\n\n');
      return { context, pages };
    });
  }, []);

  return { search };

}