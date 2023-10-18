import { WavyText } from './WavyText';

export const AddPlace = ({ drop }: { drop: boolean; }) => {
  const classes = "cursor-menu " + (drop ? "no-shadow" : "")
  return (
    <div className={classes}>
      {drop ? null : <div className="add-a-place"><WavyText text="Add a Place" /></div>}
      {drop ? <div className="dropped-pin">📍</div> : <WavyText text='📍' />}
    </div>
  )
}
