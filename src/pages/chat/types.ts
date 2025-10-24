export interface MarqoResponse {

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

  regionID: string;

  textID: string;

  text_chunk: string;

  text_page: string;

}

export interface ChatMessage {

  from: 'me' | 'machina'

  text: string;

  attachments?: Page[];

}


export interface Page {

  pageNumber?: number;

  url: string; 

}