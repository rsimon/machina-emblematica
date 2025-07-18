interface SourcesProps {

  currentSource: string;

}

export const Sources = (props: SourcesProps) => {

  return (
    <div>
      <img src={props.currentSource} />
    </div>
  )

}