import type { APIRoute } from 'astro';
import { QueryContextualizer } from './_lib/query-contextualizer';

export const prerender = false;

const MARQO_BASE_URL = import.meta.env.MARQO_BASE_URL;

const INDEXES = [
  import.meta.env.MARQO_TXT_INDEX,
  import.meta.env.MARQO_IMG_INDEX
]

export const POST: APIRoute = async ({ request }) => {
  try {
    const { q, history } = await request.json();

    // Contextualize the query using chat history
    const contextualizer = new QueryContextualizer();
    const contextualizedQuery = await contextualizer.contextualizeQuery(q, history);

    // console.log('Original query:', q);
    // console.log('Contextualized query:', contextualizedQuery);

    const { target_index, retrieval_query } = contextualizedQuery;

    const index = target_index === 'image' 
      ? import.meta.env.MARQO_IMG_INDEX
      : import.meta.env.MARQO_TXT_INDEX;

    const result = await fetch(`${MARQO_BASE_URL}/indexes/${index}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: retrieval_query,
        limit: 10,
        searchMethod: 'HYBRID'
      }),
    }).then(res => res.json()).then(data => ({ index, contextualizedQuery: retrieval_query, ...data }));

    return new Response(JSON.stringify([result]), {
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