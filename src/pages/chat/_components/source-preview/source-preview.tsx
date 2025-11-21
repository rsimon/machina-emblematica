import { useMemo } from 'react';
import type { Page } from '@/types';

interface SourcesProps {

  currentSource: Page;

}

const patchIIIFURL = (url: string, pageNumber: number, changeTo: number) => {
  // Example: https://api.digitale-sammlungen.de/iiif/image/v2/bsb10575861_00412/full/full/0/default.jpg

  // Should make this more robust at some point...
  const searchValue = `${pageNumber}/full`;
  const replaceValue = `${changeTo}/full`;

  return url.replace(searchValue, replaceValue);
}

export const SourcePreview = (props: SourcesProps) => {

  const { left, right } = useMemo(() => {
    const { pageNumber, imageUrl } = props.currentSource;

    if (pageNumber === undefined)
      return { left: props.currentSource.imageUrl };

    if (pageNumber % 2 === 0) {
      const left = imageUrl;
      const right = patchIIIFURL(imageUrl, pageNumber, pageNumber + 1);
      return { left, right };
    } else {
      const left = patchIIIFURL(imageUrl, pageNumber, pageNumber - 1);
      const right = props.currentSource.imageUrl;
      return { left, right };
    }
  }, [props.currentSource]);

  return (
    <div className="fixed top-0 h-screen w-7/12">
      <div className="h-screen flex justify-center items-center -rotate-3">
        <img 
          src={left} 
          className={`max-w-4/12 max-h-[80vh] ${right ? 'rounded-l' :  'rounded'}`} />

        {right && (
          <img 
            src={right} 
            className="max-w-4/12 max-h-[80vh] rounded-r" />  
        )}
      </div>
      
      <div 
        className="fixed bottom-4 left-4 text-white/70 text-sm">
        <a 
          target="_blank"
          href={props.currentSource.viewerUrl}>
          View at <span className="underline">Münchener Digitale Bibliothek</span>
        </a>
      </div>
    </div>
  )

}