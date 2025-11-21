import type { APIRoute } from 'astro';
import { contextualizeQuery } from './_search';
import type { SearchRequestPayload, SearchResponse } from '@/types';

export const prerender = false;

const MARQO_BASE_URL = import.meta.env.MARQO_BASE_URL;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { q, history } = await request.json() as SearchRequestPayload;

    const { contextualizedQuery, indexModality } = await contextualizeQuery(q, history);
    // console.log('Original query:', q);
    // console.log('Contextualized query:', contextualizedQuery);

    const index = indexModality === 'image' 
      ? import.meta.env.MARQO_IMG_INDEX
      : import.meta.env.MARQO_TXT_INDEX;

    const result = await fetch(`${MARQO_BASE_URL}/indexes/${index}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: contextualizedQuery,
        limit: 10,
        searchMethod: 'HYBRID'
      }),
    }).then(res => res.json()).then(data => { 
      const response: SearchResponse = {
        contextualizedQuery,
        indexModality,
        indexName: index,
        ...data
      };

      return response;
    });

    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch from Marqo',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }
}