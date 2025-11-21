import { useState } from 'react';
import { Sources } from './sources/Sources';
import { Conversation } from './conversation/Conversationas';
import type { Page } from '../../../types';

export const ChatInterface = () => {

  const [currentSource, setCurrentSource] = useState<Page | undefined>(undefined);

  const sourcesClass = currentSource 
    ? 'w-7/12 transition-all duration-300 ease-in-out' 
    : 'w-0 transition-all duration-300 ease-in-out overflow-hidden';

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="flex min-h-full w-full">
        <div className={sourcesClass}>
          {currentSource && (
            <Sources 
              currentSource={currentSource} />
          )}
        </div>

        <div className="flex-1 min-h-full">
          <Conversation 
            currentSource={currentSource} 
            onShowSource={setCurrentSource} />
        </div>
      </div>
    </div>
  )

}