import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import type { Page } from '@/types';

interface SourcesProps {
  
  isMobile?: boolean;

  currentSource: Page;

  onClose(): void;

}

const patchIIIFURL = (url: string, pageNumber: number, changeTo: number) => {
  // Example: https://api.digitale-sammlungen.de/iiif/image/v2/bsb10575861_00412/full/full/0/default.jpg

  // Should make this more robust at some point...
  const searchValue = `${pageNumber}/full`;
  const replaceValue = `${changeTo}/full`;

  return url.replace(searchValue, replaceValue);
}

export const SourcePreview = (props: SourcesProps) => {
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    setIsLoading(true);
    
    const leftImg = new Image();
    const rightImg = right ? new Image() : null;
    
    let leftLoaded = false;
    let rightLoaded = !right; // If no right image, consider it "loaded"
    
    const checkBothLoaded = () => {
      if (leftLoaded && rightLoaded)
        setIsLoading(false);
    }
    
    leftImg.onload = () => {
      leftLoaded = true;
      checkBothLoaded();
    };
    
    leftImg.onerror = () => {
      leftLoaded = true;
      checkBothLoaded();
    };
    
    if (rightImg) {
      rightImg.onload = () => {
        rightLoaded = true;
        checkBothLoaded();
      };
      
      rightImg.onerror = () => {
        rightLoaded = true;
        checkBothLoaded();
      };
      
      rightImg.src = right!;
    }
    
    leftImg.src = left;
  }, [left, right]);

  return props.isMobile ? (
    <div className="relative w-full h-full flex flex-col">
      <div className="absolute top-4 right-4 z-20">
        <button 
          className="cursor-pointer text-white bg-black/50 rounded-full p-2 hover:bg-black/70"
          onClick={props.onClose}>
          <X className="size-6" />
        </button>
      </div>

      <div className="flex-1 flex justify-center items-center p-2">
        <div
          className={`max-w-1/2 max-h-7/12 aspect-25/42 flex justify-end ${right ? 'rounded-l' :  'rounded'}`}>
          <img 
            src={left} 
            className={`h-full w-auto object-contain shadow-2xl ${right ? 'rounded-l' : 'rounded'}`} />
        </div>

        {right && (
          <div
            className="max-w-1/2 max-h-7/12 rounded-r aspect-25/42 flex justify-start">
            <img 
              src={right} 
              className="h-full w-auto object-contain rounded-r shadow-2xl" />  
          </div>
        )}
      </div>
      
      <div className="pb-4 px-4 text-white/90 text-sm text-center">
        <a 
          target="_blank"
          href={props.currentSource.viewerUrl}
          className="hover:underline">
          View at <span className="underline">Münchener Digitale Bibliothek</span>
        </a>
      </div>
    </div>
  ) : (
    isLoading ? (
      <div className="fixed top-0 h-screen w-7/12">
        <div className="h-screen flex justify-center items-center -rotate-3">
          <div 
            className="w-5/12 h-[75vh] aspect-25/42 border border-white/5 bg-white/5 animate-pulse rounded-l" />

          <div 
            className="w-5/12 h-[75vh] aspect-25/42 border border-l-0 border-white/5 bg-white/5 animate-pulse rounded-r" />
        </div>
      </div>
    ) : (
      <div className="fixed top-0 h-screen w-7/12">
        <div className="absolute top-4 left-4 z-10">
          <button 
            className="cursor-pointer text-white/60 hover:text-white"
            onClick={props.onClose}>
            <X className="size-5" />
          </button>
        </div>

        <div className="h-screen flex justify-center items-center -rotate-3">
          <div 
            className={`max-w-5/12 max-h-[75vh] aspect-25/42 flex justify-end`}>
            <img 
              src={left}
              className={`h-full w-auto object-contain ${right ? 'rounded-l' : 'rounded'}`} />
          </div>

          {right && (
            <div 
              className="max-w-5/12 max-h-[75vh] rounded-r aspect-25/42 flex justify-start">
              <img 
                src={right} 
                className="h-full w-auto object-contain rounded-r" />  
            </div>
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
  )

}