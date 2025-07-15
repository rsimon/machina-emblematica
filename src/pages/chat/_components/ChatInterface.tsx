import { useState } from 'react';
import { Sources } from './sources/Sources';
import { Conversation } from './conversation/Conversation';

export const ChatInterface = () => {

  const [showSources, setShowSources] = useState(true);

  const sourcesClass = showSources 
    ? 'w-7/12 transition-all duration-300 ease-in-out' 
    : 'w-0 transition-all duration-300 ease-in-out overflow-hidden';

  return (
    <div className="h-full w-full overflow-y-auto">
      <button 
        onClick={() => setShowSources(s => !s)} className="absolute top-2 left-2 z-20">Toggle
      </button>

      <div className="flex min-h-full w-full">
        <div className={sourcesClass}>
          <Sources />
        </div>

        <div className="flex-1 min-h-full">
          <Conversation 
            showSources={showSources} />
        </div>
      </div>
    </div>
  )

}