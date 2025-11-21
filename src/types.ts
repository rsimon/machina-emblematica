export interface ChatMessage {

  from: 'me' | 'machina';

  text: string;

  pages?: Page[];

}

export interface Page {

  pageNumber?: number;

  imageUrl: string; 

  viewerUrl: string;

}

export interface SearchRequestPayload {
  
  q: string;

  history: ChatMessage[]

}

export interface SearchResponse {

  indexName: string;

  indexModality: 'text' | 'image';

  contextualizedQuery: string;

  limit: number;

  offset: number;

  processingTimeMs: number;

  query: string;

  hits: SearchResponseHit[];

}

export interface SearchResponseHit {

  document: string;

  image_url: string;

  page: string;

  text_page: string;

  viewer_url: string;

}

export interface SearchResponseTextHit extends SearchResponseHit {

  regionID: string;

  textID: string;

  text_chunk: string;

}

export interface ChatRequestPayload {

  chatHistory: ChatMessage[];

  contextualizedQuery: string;

  images: { url: string }[];

  modality: 'text' | 'image';

  stream: boolean;

  textContext: string;

}