export interface MarqoResponse {

  index: string;

  modality: 'text' | 'image';

  contextualizedQuery: string;

  limit: number;

  offset: number;

  processingTimeMs: number;

  query: string;

  hits: MarqoHit[];

}

export interface MarqoHit {

  document: string;

  image_url: string;

  page: string;

  text_page: string;

  viewer_url: string;

}

export interface MarqoTextHit extends MarqoHit {

  regionID: string;

  textID: string;

  text_chunk: string;

}

export interface ChatMessage {

  from: 'me' | 'machina'

  text: string;

  attachments?: Page[];

}


export interface Page {

  pageNumber?: number;

  imageUrl: string; 

  viewerUrl: string;

}