import { useRef, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { SourcePreview } from './source-preview';
import { Conversation } from './conversation';
import type { Page } from '@/types';

export const ChatInterface = () => {

  const [currentSource, setCurrentSource] = useState<Page | undefined>(undefined);

  const scrollParent = useRef<HTMLDivElement>(null);

  const sourcesClass = currentSource 
    ? 'w-7/12 transition-all duration-300 ease-in-out' 
    : 'w-0 transition-all duration-300 ease-in-out overflow-hidden';

  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <div 
      ref={scrollParent}
      className="h-full w-full overflow-y-auto">
      <div className="flex min-h-full w-full">
        {isDesktop && (
          <div className={sourcesClass}>
            {currentSource && (
              <SourcePreview
                currentSource={currentSource} 
                onClose={() => setCurrentSource(undefined)} />
            )}
          </div>
        )}

        <div className="flex-1 min-h-full">
          <Conversation 
            scrollParent={scrollParent}
            currentSource={currentSource} 
            onShowSource={setCurrentSource} />
        </div>
      </div>
      
      {!isDesktop && currentSource && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <SourcePreview
            currentSource={currentSource}
            onClose={() => setCurrentSource(undefined)}
            isMobile={true} />
        </div>
      )}
    </div>
  )

}