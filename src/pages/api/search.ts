import type { APIRoute } from 'astro';

export const prerender = false;

// const MARQO_BASE_URL = 'http://92.112.48.13:8882';
const MARQO_BASE_URL = import.meta.env.MARQO_BASE_URL;

// const MARQO_INDEX = 'camerarius_testIndex_full-texts';
const MARQO_INDEX = import.meta.env.MARQO_INDEX;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    const response = await fetch(`${MARQO_BASE_URL}/indexes/${MARQO_INDEX}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
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