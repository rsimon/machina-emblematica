import { BaseRetriever, type BaseRetrieverInput } from "@langchain/core/retrievers";
import { Document } from "@langchain/core/documents";
import type { MarqoResponse, MarqoTextHit } from '../../chat/types';

interface MarqoRetrieverConfig extends BaseRetrieverInput {

  marqoUrl: string;

  marqoApiKey: string;

  indexName: string;

  limit?: number;
  
}


export class MarqoRetriever extends BaseRetriever {
  lc_namespace = ["custom", "retrievers", "marqo"];
  
  private marqoUrl: string;
  private marqoApiKey: string;
  private indexName: string;
  private limit: number;

  constructor(config: MarqoRetrieverConfig) {
    super(config);
    this.marqoUrl = config.marqoUrl;
    this.marqoApiKey = config.marqoApiKey;
    this.indexName = config.indexName;
    this.limit = config.limit || 5;
  }

  async _getRelevantDocuments(query: string): Promise<Document[]> {
    // Call your existing Marqo API
    const response = await fetch(`${this.marqoUrl}/indexes/${this.indexName}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.marqoApiKey,
      },
      body: JSON.stringify({
        q: query,
        limit: this.limit,
      }),
    });

    const data: MarqoResponse = await response.json();

    // Transform Marqo hits into LangChain Documents
    return data.hits.map((hit) => {
      const isTextHit = 'text_chunk' in hit;
      
      return new Document({
        pageContent: isTextHit ? (hit as MarqoTextHit).text_chunk : '',
        metadata: {
          document: hit.document,
          page: hit.page,
          imageUrl: hit.image_url,
          viewerUrl: hit.viewer_url,
          // Include text-specific fields if available
          ...(isTextHit && {
            regionID: (hit as MarqoTextHit).regionID,
            textID: (hit as MarqoTextHit).textID,
          }),
        },
      });
    });
  }
}