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
      console.log(data);
      const pages = [...new Set(data.hits.map(h => {
        const page = h.page.length === 5 ? h.page : `0${h.page}`;
        return `https://api.digitale-sammlungen.de/iiif/image/v2/${h.documentID}_${page}/full/full/0/default.jpg`
        // return `https://api.digitale-sammlungen.de/iiif/image/v2/${h.textID.replaceAll('_', '/')}.jpg`
      }))];
      const context = data.hits.map((d: any) => d.text_page).join('\n\n');
      return { context, pages };
    });
  }, []);

  return { search };

}