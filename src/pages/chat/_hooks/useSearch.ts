import { useCallback } from 'react';

// https://colab.research.google.com/drive/1rEUaYDLIvpOo5ZTQW6-YqlOzs6_ZdL8c?authuser=1

// https://docs.marqo.ai/latest/reference/api/search/search/
const BASE_URL = 'http://92.112.48.13:8882';

const INDEX = 'camerarius_testIndex_full-texts'

export const useSearch = () => {

  const search = useCallback((query: string) => {
    fetch(`/indexes/${INDEX}/search`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ 
        q: query,
        searchMethod: 'LEXICAL'
      })
    }).then(res => res.json()).then(data => {
      // console.log(data);

      console.log(data.hits.map((d: any) => d.text_page).join(' --- '));
    });
  }, []);

  return { search };

}