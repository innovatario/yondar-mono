import '../scss/FeedToggle.scss'

export const FeedToggle = ({ globalFeed, toggleFeed }: { globalFeed: boolean; toggleFeed: () => void; }) => {
  return (
    <button className="component-feedtoggle" type="button" onClick={toggleFeed}>{globalFeed ? "Global" : "Friends"}</button>
  )
}
