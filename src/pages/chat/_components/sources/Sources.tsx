interface SourcesProps {

  currentSource: string;

}

export const Sources = (props: SourcesProps) => {

  return (
    <div className="fixed top-0 h-[100vh] w-7/12 flex justify-center items-center">
      <img 
        src={props.currentSource} 
        className="max-w-8/12 max-h-[80vh] rounded -rotate-3" />
    </div>
  )

}